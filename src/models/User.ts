import { UserInterface, UserType, RegistrationType, userStatuses } from '../types';
import { db } from '../config/db';

export class User implements UserInterface {
    constructor(
        public names: string,
        public email: string,
        public password: string,
        public type: UserType,
        public registrationType: RegistrationType,
        public profilePictureURL: string,
        public createdAt: Date,
        public updatedAt: Date,
        public id?: number,
        public userStatus?: userStatuses
    ) { }

    static fromRow(row: any): User {
        return new User(
            row.names,
            row.email,
            row.password,
            row.type,
            row.registrationType,
            row.profilePictureURL,
            new Date(row.createdAt),
            new Date(row.updatedAt),
            row.id,
            row.userStatus
        );
    }

    static async save(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            const stmt = `
                INSERT INTO users (names, email, password, type, registrationType, userStatus, profilePictureURL, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
                stmt,
                [
                    user.names,
                    user.email,
                    user.password,
                    user.type,
                    user.registrationType,
                    user.userStatus,
                    user.profilePictureURL,
                    user.createdAt,
                    user.updatedAt
                ],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM users WHERE id = ?`,
                        [this.lastID],
                        (err, row) => {
                            if (err) return reject(err);
                            resolve(User.fromRow(row));
                        }
                    );
                }
            );
        });
    }

    static async update(id: number, data: Partial<User>): Promise<User | null> {
        const fields = Object.keys(data);
        const values = Object.values(data);
        if (fields.length === 0) return null;

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET ${setClause}, updatedAt = ? WHERE id = ?`,
                [...values, new Date(), id],
                function (err) {
                    if (err) return reject(err);
                    db.get(
                        `SELECT * FROM users WHERE id = ?`,
                        [id],
                        (err, row) => {
                            if (err) return reject(err);
                            if (!row) return resolve(null);
                            resolve(User.fromRow(row));
                        }
                    );
                }
            );
        });
    }

    static async find(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM users`, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(User.fromRow));
            });
        });
    }

    static async findOne(id: number): Promise<User | null> {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(User.fromRow(row));
            });
        });
    }

    static async findByEmail(email: string): Promise<Partial<User> | null> {
        return new Promise<User | null>((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                resolve(User.fromRow(row));
            });
        });
    }

    static async delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes > 0);
            });
        });
    }
}
