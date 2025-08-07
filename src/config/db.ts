import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let db: sqlite3.Database;
// Initialize SQLite database connection
export const connectDB = async (): Promise<sqlite3.Database> => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      path.resolve(__dirname, process.env.DATABASE_URL || '../../data/database.sqlite'),
      (err) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite');
          resolve(db);
        }
      }
    );
  });
};

export { db };
