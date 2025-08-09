import { User } from '../../../src/models/User';
import { UserType, RegistrationType, userStatuses } from '../../../src/types';
import { TestHelper } from '../../helpers/testHelper';

describe('User Model', () => {
  beforeAll(async () => {
    await TestHelper.setupTestDatabase();
  });

  beforeEach(async () => {
    await TestHelper.cleanDatabase();
  });

  afterAll(async () => {
    await TestHelper.closeDatabase();
  });

  describe('User model functions', () => {
    it('should create a new user successfully', async () => {
      const userData = new User(
        'John Doe',
        'john@example.com',
        'hashedpassword123',
        UserType.User,
        RegistrationType.Manual,
        'https://example.com/profile.jpg',
        new Date(),
        new Date(),
        undefined,
        userStatuses.Active
      );

      const savedUser = await User.save(userData);

      expect(savedUser).toBeDefined();
      expect(savedUser.id).toBeDefined();
      expect(savedUser.names).toBe('John Doe');
      expect(savedUser.email).toBe('john@example.com');
      expect(savedUser.type).toBe(UserType.User);
    });

    it('should find user by email', async () => {
      const testEmail = 'findme@example.com';
      const userData = new User(
        'Find Me',
        testEmail,
        'hashedpassword123',
        UserType.User,
        RegistrationType.Manual,
        'https://example.com/profile.jpg',
        new Date(),
        new Date(),
        undefined,
        userStatuses.Active
      );

      await User.save(userData);
      const foundUser = await User.findByEmail(testEmail);

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(testEmail);
      expect(foundUser?.names).toBe('Find Me');
    });

    it('should return null when user not found by email', async () => {
      const foundUser = await User.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });

    it('should update user successfully', async () => {
      const userData = new User(
        'Update Me',
        'updateme@example.com',
        'hashedpassword123',
        UserType.User,
        RegistrationType.Manual,
        'https://example.com/profile.jpg',
        new Date(),
        new Date(),
        undefined,
        userStatuses.Active
      );

      const savedUser = await User.save(userData);
      
      const updatedUser = await User.update(savedUser.id!, {
        names: 'Updated Name',
        userStatus: userStatuses.Inactive
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.names).toBe('Updated Name');
      expect(updatedUser?.userStatus).toBe(userStatuses.Inactive);
    });

    it('should delete user successfully', async () => {
      const userData = new User(
        'Delete Me',
        'deleteme@example.com',
        'hashedpassword123',
        UserType.User,
        RegistrationType.Manual,
        'https://example.com/profile.jpg',
        new Date(),
        new Date(),
        undefined,
        userStatuses.Active
      );

      const savedUser = await User.save(userData);
      const deleted = await User.delete(savedUser.id!);

      expect(deleted).toBe(true);

      const foundUser = await User.findOne(savedUser.id!);
      expect(foundUser).toBeNull();
    });

    it('should get all users', async () => {
      // Clear existing users first
      const existingUsers = await User.find();
      for (const user of existingUsers) {
        if (user.id) await User.delete(user.id);
      }

      // Create test users
      const user1 = new User(
        'User One',
        'user1@example.com',
        'hashedpassword123',
        UserType.User,
        RegistrationType.Manual,
        'https://example.com/profile.jpg',
        new Date(),
        new Date(),
        undefined,
        userStatuses.Active
      );

      const user2 = new User(
        'User Two',
        'user2@example.com',
        'hashedpassword123',
        UserType.Admin,
        RegistrationType.OAuth,
        'https://example.com/profile2.jpg',
        new Date(),
        new Date(),
        undefined,
        userStatuses.Pending
      );

      await User.save(user1);
      await User.save(user2);

      const allUsers = await User.find();
      expect(allUsers).toHaveLength(2);
      expect(allUsers.map(u => u.email)).toContain('user1@example.com');
      expect(allUsers.map(u => u.email)).toContain('user2@example.com');
    });

  });
});
