import { connectDB, db } from '../../src/config/db';
import { createTablesIfNotExist } from '../../src/database/init';
import fs from 'fs';
import path from 'path';

export class TestHelper {
  static async setupTestDatabase(): Promise<void> {
    await connectDB();
    await createTablesIfNotExist();
  }

  static async cleanDatabase(): Promise<void> {
    // Clean all test data from tables while preserving schema
    return new Promise((resolve, reject) => {
      if (!db) {
        resolve();
        return;
      }
      
      db.serialize(() => {
        let pendingOperations = 4;
        let hasError = false;
        
        const handleComplete = (err?: any) => {
          if (err && !hasError) {
            hasError = true;
            reject(err);
            return;
          }
          pendingOperations--;
          if (pendingOperations === 0 && !hasError) {
            resolve();
          }
        };
        
        db.run('DELETE FROM applications', handleComplete);
        db.run('DELETE FROM jobs', handleComplete);
        db.run('DELETE FROM users', handleComplete);
        db.run('DELETE FROM audit_logs', handleComplete);
      });
    });
  }

  static async closeDatabase(): Promise<void> {
    // Close database connection
    return new Promise((resolve) => {
      if (db) {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  static async cleanupTestDatabase(): Promise<void> {
    // Only try to delete file if not using in-memory database
    if (process.env.DATABASE_URL !== ':memory:') {
      const testDbPath = path.resolve(__dirname, '../../data/test_database.sqlite');
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
    }
  }

  static generateMockUser(overrides = {}) {
    return {
      names: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      type: 'job-seeker',
      registrationType: 'manual',
      userStatus: 'active',
      profilePictureURL: 'https://example.com/profile.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static generateMockJob(overrides = {}) {
    return {
      title: 'Software Engineer',
      description: 'A great job opportunity',
      company: 'Tech Corp',
      location: 'Remote',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      type: 'full-time',
      status: 'open',
      postedBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static generateMockApplication(overrides = {}) {
    return {
      jobId: 1,
      coverLetter: 'I am very interested in this position',
      resumeURL: 'https://example.com/resume.pdf',
      status: 'pending' as any,
      appliedAt: new Date(),
      updatedAt: new Date(),
      phoneNumber: '+1234567890',
      email: 'applicant@example.com',
      linkedInProfile: 'https://linkedin.com/in/user',
      jobTitle: 'Software Engineer',
      names: 'Test Applicant',
      ...overrides
    };
  }

  static async waitFor(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
