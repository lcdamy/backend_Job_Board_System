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
      db.serialize(() => {
        db.run('DELETE FROM applications', (err) => {
          if (err) console.warn('Error cleaning applications:', err.message);
        });
        db.run('DELETE FROM jobs', (err) => {
          if (err) console.warn('Error cleaning jobs:', err.message);
        });
        db.run('DELETE FROM users', (err) => {
          if (err) console.warn('Error cleaning users:', err.message);
        });
        db.run('DELETE FROM audit_logs', (err) => {
          if (err) console.warn('Error cleaning audit_logs:', err.message);
          resolve();
        });
      });
    });
  }

  static async closeDatabase(): Promise<void> {
    // Close database connection
    return new Promise((resolve) => {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        }
        resolve();
      });
    });
  }

  static async cleanupTestDatabase(): Promise<void> {
    const testDbPath = path.resolve(__dirname, '../data/test_database.sqlite');
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
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
      userId: 1,
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
