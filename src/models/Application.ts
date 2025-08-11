import { applicationStatuses, JobApplicationInterface } from '../types';
import { db } from '../config/db';
import logger from '../config/logger';

export class Application implements JobApplicationInterface {
    constructor(
        public jobId: number,
        public coverLetter: string,
        public resumeURL: string,
        public status: applicationStatuses,
        public appliedAt: Date,
        public updatedAt: Date,
        public id?: number,
        public phoneNumber?: string,
        public email?: string,
        public linkedInProfile?: string,
        public jobTitle?: string,
        public names?: string,
    ) { }

    static fromRow(row: any): Application {
        return new Application(
            row.jobId,
            row.coverLetter,
            row.resumeURL,
            row.status,
            new Date(row.appliedAt),
            new Date(row.updatedAt),
            row.id,
            row.phoneNumber,
            row.email,
            row.linkedInProfile,
            row.jobTitle,
            row.names,
        );
    }

    static async save(application: Application): Promise<Application> {
        return new Promise((resolve, reject) => {
            const stmt = `
                INSERT INTO applications (jobId, coverLetter, resumeURL, status, appliedAt, updatedAt, phoneNumber, email, linkedInProfile, jobTitle, names)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
                stmt,
                [
                    application.jobId,
                    application.coverLetter,
                    application.resumeURL,
                    application.status,
                    application.appliedAt,
                    application.updatedAt,
                    application.phoneNumber,
                    application.email,
                    application.linkedInProfile,
                    application.jobTitle,
                    application.names
                ],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM applications WHERE id = ?`,
                        [this.lastID],
                        (err, row) => {
                            if (err) return reject(err);
                            resolve(Application.fromRow(row));
                        }
                    );
                }
            );
        });
    }

    static async update(id: number, data: Partial<Application>): Promise<Application | null> {
        const fields = Object.keys(data);
        const values = Object.values(data);
        if (fields.length === 0) return null;

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE applications SET ${setClause}, updatedAt = ? WHERE id = ?`,
                [...values, new Date(), id],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM applications WHERE id = ?`,
                        [id],
                        (err, row) => {
                            if (err) return reject(err);
                            if (!row) return resolve(null);
                            resolve(Application.fromRow(row));
                        }
                    );
                }
            );
        });
    }

    static async find(): Promise<Application[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM applications`, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(Application.fromRow));
            });
        });
    }

    static async findOne(id: number): Promise<Application | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM applications WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(Application.fromRow(row));
            });
        });
    }

    static async delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM applications WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }

    static async findApplicationByJobSeeker(jobId: number, email: string): Promise<Application | null> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM applications WHERE jobId = ? AND email = ?`, [jobId, email], (err, rows) => {
                if (err) return reject(err);
                if (rows.length === 0) {
                    logger.warn(`No applications found for jobId ${jobId} and email ${email}`);
                    return resolve(null);
                }
                resolve(Application.fromRow(rows[0]));
            });
        });
    }

    static async getApplicationsByJobId(jobId: number): Promise<Application[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM applications WHERE jobId = ?`, [jobId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(Application.fromRow));
            });
        });
    }
}