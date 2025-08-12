import { db } from '../config/db';
import fs from 'fs';
import path from 'path';

export const initializeDatabase = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Read the setup SQL file
        const setupSQLPath = path.join(__dirname, 'setup.sql');
        const setupSQL = fs.readFileSync(setupSQLPath, 'utf8');

        // Execute the setup SQL
        db.exec(setupSQL, (err) => {
            if (err) {
                console.error('Error initializing database:', err);
                reject(err);
            } else {
                console.log('Database initialized successfully');
                resolve();
            }
        });
    });
};

// Alternative: Create tables programmatically without SQL file
export const createTablesIfNotExist = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const createAuditLogsTable = `
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME NOT NULL,
                method TEXT NOT NULL,
                url TEXT NOT NULL,
                statusCode INTEGER NOT NULL,
                userAgent TEXT NOT NULL,
                duration TEXT,
                doneBy TEXT,
                ipAddress TEXT,
                activity TEXT,
                details TEXT,
                status TEXT,
                responseBody TEXT,
                requestBody TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                names TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                type TEXT NOT NULL,
                registrationType TEXT NOT NULL,
                userStatus TEXT NOT NULL,
                profilePictureURL TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createJobsTable = `
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                company TEXT NOT NULL,
                location TEXT NOT NULL,
                deadline DATETIME NOT NULL,
                type TEXT NOT NULL,
                status TEXT NOT NULL,
                postedBy INTEGER NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (postedBy) REFERENCES users(id)
            )
        `;

        const createApplicationsTable = `
            CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jobId INTEGER NOT NULL,
            coverLetter TEXT NOT NULL,
            resumeURL TEXT NOT NULL,
            status TEXT NOT NULL,
            appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            phoneNumber TEXT,
            email TEXT,
            linkedInProfile TEXT,
            jobTitle TEXT,
            names TEXT,
            FOREIGN KEY (jobId) REFERENCES jobs(id)
            )
        `;

        const createIndexes = [
            `CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)`,
            `CREATE INDEX IF NOT EXISTS idx_audit_logs_method ON audit_logs(method)`,
            `CREATE INDEX IF NOT EXISTS idx_audit_logs_status_code ON audit_logs(statusCode)`,
            `CREATE INDEX IF NOT EXISTS idx_audit_logs_done_by ON audit_logs(doneBy)`
        ];

        const tables = [createUsersTable, createJobsTable, createApplicationsTable, createAuditLogsTable];
        
        // Create tables first, then indexes
        const createTablesSequentially = async () => {
            try {
                // Create all tables first
                for (const sql of tables) {
                    await new Promise<void>((resolveTable, rejectTable) => {
                        db.run(sql, (err) => {
                            if (err) {
                                console.error('Error creating table:', err);
                                rejectTable(err);
                                return;
                            }
                            resolveTable();
                        });
                    });
                }
                console.log('All tables created successfully');

                // Then create all indexes
                for (const sql of createIndexes) {
                    await new Promise<void>((resolveIndex, rejectIndex) => {
                        db.run(sql, (err) => {
                            if (err) {
                                console.error('Error creating index:', err);
                                rejectIndex(err);
                                return;
                            }
                            resolveIndex();
                        });
                    });
                }
                console.log('All indexes created successfully');
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        createTablesSequentially();
    });
};
