import { applicationStatuses, JobApplicationInterface } from '../types';
import { db } from '../config/db';

export class Application implements JobApplicationInterface {
    constructor(
        public jobId: number,
        public userId: number,
        public coverLetter: string,
        public resumeURL: string,
        public status: applicationStatuses,
        public appliedAt: Date,
        public updatedAt: Date,
        public id?: number
    ) { }

    static fromRow(row: any): Application {
        return new Application(
            row.jobId,
            row.userId,
            row.coverLetter,
            row.resumeURL,
            row.status,
            new Date(row.appliedAt),
            new Date(row.updatedAt),
            row.id
        );
    }

    static async save(application: Application): Promise<Application> {
        return new Promise((resolve, reject) => {
            const stmt = `
                INSERT INTO applications (jobId, userId, coverLetter, resumeURL, status, appliedAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
                stmt,
                [
                    application.jobId,
                    application.userId,
                    application.coverLetter,
                    application.resumeURL,
                    application.status,
                    application.appliedAt,
                    application.updatedAt
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
}