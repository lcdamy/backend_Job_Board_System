import { JobInterface, jobStatuses, jobTypes, JobApplicationInterface } from '../types';
import { db } from '../config/db';


export class Job implements JobInterface {
    constructor(
        public title: string,
        public description: string,
        public company: string,
        public location: string,
        public deadline: Date,
        public type: jobTypes,
        public status: jobStatuses,
        public postedBy: number,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: number,
        public applications?: JobApplicationInterface[] // Optional field to hold applications related to the job
    ) { }

    static fromRow(row: any): Job {
        return new Job(
            row.title,
            row.description,
            row.company,
            row.location,
            new Date(row.deadline),
            row.type,
            row.status,
            row.postedBy,
            new Date(row.createdAt),
            new Date(row.updatedAt),
            row.id,
            row.applications ? JSON.parse(row.applications) : []
        );
    }

    static async save(job: Job): Promise<Job> {
        return new Promise((resolve, reject) => {
            const stmt = `
                INSERT INTO jobs (title, description, company, location, deadline, type, status, postedBy, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
                stmt,
                [
                    job.title,
                    job.description,
                    job.company,
                    job.location,
                    job.deadline,
                    job.type,
                    job.status,
                    job.postedBy,
                    job.createdAt,
                    job.updatedAt
                ],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM jobs WHERE id = ?`,
                        [this.lastID],
                        (err, row) => {
                            if (err) return reject(err);
                            resolve(Job.fromRow(row));
                        }
                    );
                }
            );
        });
    }

    static async update(id: number, data: Partial<Job>): Promise<Job | null> {
        const fields = Object.keys(data);
        const values = Object.values(data);
        if (fields.length === 0) return null;

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE jobs SET ${setClause}, updatedAt = ? WHERE id = ?`,
                [...values, new Date(), id],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM jobs WHERE id = ?`,
                        [id],
                        (err, row) => {
                            if (err) return reject(err);
                            if (!row) return resolve(null);
                            resolve(Job.fromRow(row));
                        }
                    );
                }
            );
        });
    }

    static async find(): Promise<Job[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM jobs`, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(Job.fromRow));
            });
        });
    }

    static async findOne(id: number): Promise<Job | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM jobs WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(Job.fromRow(row));
            });
        });
    }

    static async findJobExistent(title: string, company: string, location: string): Promise<Job | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM jobs WHERE title = ? AND company = ? AND location = ?`, [title, company, location], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(Job.fromRow(row));
            });
        });
    }

    static async delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM jobs WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }

    static async findDeadline(criteria: any): Promise<Job[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM jobs WHERE deadline < ? AND status = ?`, [criteria.deadline, criteria.status], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(Job.fromRow));
            });
        });
    }

}