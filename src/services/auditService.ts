import { AuditLog } from "../models/AuditLog";
import { db } from '../config/db';

export class AuditService {
    // Get all audit logs with pagination, search, and filters
    async getAllAudit(
        page: number,
        limit: number,
        search?: string,
        filters?: any
    ): Promise<{ data: Partial<AuditLog>[], total: number, page: number, lastPage: number }> {
        const offset = (page - 1) * limit;
        let whereClauses: string[] = [];
        let params: any[] = [];

        // Search by doneBy or details
        if (search) {
            whereClauses.push('(doneBy LIKE ? OR details LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        // Date filter
        if (filters?.startDate && filters?.endDate) {
            whereClauses.push('createdAt BETWEEN ? AND ?');
            params.push(new Date(filters.startDate).toISOString(), new Date(filters.endDate).toISOString());
        }

        // Other filters (activity, status, etc.)
        if (filters) {
            Object.keys(filters).forEach(key => {
                if (key !== 'startDate' && key !== 'endDate' && filters[key] !== undefined && filters[key] !== '') {
                    whereClauses.push(`${key} = ?`);
                    params.push(filters[key]);
                }
            });
        }

        // Exclude a specific doneBy
        whereClauses.push('doneBy != ?');
        params.push('zudanga@gmail.com');

        const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

        // Count total
        const countStmt = `SELECT COUNT(*) as count FROM audit_logs ${whereSQL}`;
        const total: number = await new Promise((resolve, reject) => {
            db.get(countStmt, params, (err, row) => {
                if (err) return reject(err);
                resolve((row as { count: number }).count);
            });
        });

        // Fetch paginated data
        const dataStmt = `
            SELECT id, timestamp, doneBy, status, ipAddress, activity, details
            FROM audit_logs
            ${whereSQL}
            ORDER BY createdAt DESC
            LIMIT ? OFFSET ?
        `;
        const dataParams = [...params, limit, offset];
        const data: Partial<AuditLog>[] = await new Promise((resolve, reject) => {
            db.all(dataStmt, dataParams, (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(AuditLog.fromRow));
            });
        });

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    // Get audit log by ID
    async getAuditById(id: string): Promise<any> {
        const auditLog = await AuditLog.findOne(id);
        if (!auditLog) {
            return null;
        }
        let parsedRequest = null;
        let parsedResponse = null;
        try {
            if (auditLog.requestBody) {
                const decodedRequest = Buffer.from(auditLog.requestBody, 'base64').toString('utf-8');
                parsedRequest = JSON.parse(decodedRequest);
            }
            if (auditLog.responseBody) {
                const decodedResponse = Buffer.from(auditLog.responseBody, 'base64').toString('utf-8');
                parsedResponse = JSON.parse(decodedResponse);
            }
        } catch (e) {
            // Ignore parse errors
        }

        return {
            id: auditLog.id,
            timestamp: auditLog.timestamp,
            doneBy: auditLog.doneBy,
            status: auditLog.status,
            ipAddress: auditLog.ipAddress,
            activity: auditLog.activity,
            details: auditLog.details,
            createdAt: auditLog.createdAt,
            updatedAt: auditLog.updatedAt,
            request: parsedRequest,
            response: parsedResponse,
        };
    }
}