import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let db: sqlite3.Database;

// Initialize SQLite database connection
export const connectDB = async (): Promise<sqlite3.Database> => {
  return new Promise((resolve, reject) => {
    let dbPath: string;
    
    // Handle different database configurations
    const databaseUrl = process.env.DATABASE_URL;
    
    if (databaseUrl === ':memory:') {
      // Use in-memory database for CI/testing
      dbPath = ':memory:';
    } else if (databaseUrl && path.isAbsolute(databaseUrl)) {
      // Use absolute path if provided
      dbPath = databaseUrl;
    } else {
      // Use relative path for development
      dbPath = path.resolve(__dirname, databaseUrl || '../../data/database.sqlite');
    }
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        console.log(`Connected to SQLite: ${dbPath}`);
        resolve(db);
      }
    });
  });
};

export { db };
