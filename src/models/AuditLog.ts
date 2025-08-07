import { AuditLogInterface } from '../types';
import { db } from '../config/db';

export class AuditLog implements AuditLogInterface {
    constructor(
        public timestamp: Date,
        public method: string,
        public url: string,
        public statusCode: number,
        public userAgent: string,
        public createdAt: Date,
        public updatedAt: Date,
        public duration?: string,
        public doneBy?: string,
        public ipAddress?: string,
        public activity?: string,
        public details?: string,
        public status?: string,
        public responseBody?: string,
        public requestBody?: string,
        public id?: string
    ) {}

    static fromRow(row: any): AuditLog {
        return new AuditLog(
            new Date(row.timestamp),
            row.method,
            row.url,
            row.statusCode,
            row.userAgent,
            new Date(row.createdAt),
            new Date(row.updatedAt),
            row.duration,
            row.doneBy,
            row.ipAddress,
            row.activity,
            row.details,
            row.status,
            row.responseBody,
            row.requestBody,
            row.id
        );
    }

    static async save(auditLog: AuditLog): Promise<AuditLog> {
        return new Promise((resolve, reject) => {
            const stmt = `
                INSERT INTO audit_logs (
                    timestamp, method, url, statusCode, userAgent, createdAt, updatedAt,
                    duration, doneBy, ipAddress, activity, details, status, responseBody, requestBody
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
                stmt,
                [
                    auditLog.timestamp,
                    auditLog.method,
                    auditLog.url,
                    auditLog.statusCode,
                    auditLog.userAgent,
                    auditLog.createdAt,
                    auditLog.updatedAt,
                    auditLog.duration,
                    auditLog.doneBy,
                    auditLog.ipAddress,
                    auditLog.activity,
                    auditLog.details,
                    auditLog.status,
                    auditLog.responseBody,
                    auditLog.requestBody
                ],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM audit_logs WHERE id = ?`,
                        [this.lastID],
                        (err, row) => {
                            if (err) return reject(err);
                            resolve(AuditLog.fromRow(row));
                        }
                    );
                }
            );
        });
    }

    static async update(id: string, data: Partial<AuditLog>): Promise<AuditLog | null> {
        const fields = Object.keys(data);
        const values = Object.values(data);
        if (fields.length === 0) return null;

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE audit_logs SET ${setClause}, updatedAt = ? WHERE id = ?`,
                [...values, new Date(), id],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM audit_logs WHERE id = ?`,
                        [id],
                        (err, row) => {
                            if (err) return reject(err);
                            if (!row) return resolve(null);
                            resolve(AuditLog.fromRow(row));
                        }
                    );
                }
            );
        });
    }

    static async find(): Promise<AuditLog[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM audit_logs`, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(AuditLog.fromRow));
            });
        });
    }

    static async findOne(id: string): Promise<AuditLog | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM audit_logs WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(AuditLog.fromRow(row));
            });
        });
    }

    static async delete(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM audit_logs WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }
}
