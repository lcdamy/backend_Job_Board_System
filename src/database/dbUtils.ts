import fs from 'fs';
import path from 'path';
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/emailService";
import { generateRandomPassword } from "../utils/helper";
import { userStatuses, UserType, RegistrationType } from "../types";
import { createTablesIfNotExist } from './init';

/**
 * Check if database file exists
 */
export const checkDatabaseExists = (): boolean => {
    const dbPath = path.resolve(__dirname, process.env.DATABASE_URL || '../../data/database.sqlite');
    return fs.existsSync(dbPath);
};

/**
 * Run initial database setup (migrations + seeds)
 */
export const runInitialDatabaseSetup = async (): Promise<void> => {
    try {
        console.log('🔄 Setting up database for the first time...');
        
        // Run migrations (create tables)
        console.log('🔄 Running database migrations...');
        await createTablesIfNotExist();
        console.log('✅ Database migrations completed');

        // Run seeds (create first admin)
        console.log('🔄 Running database seeds...');
        await seedFirstAdmin();
        console.log('✅ Database seeding completed');

        console.log('🎉 Initial database setup completed successfully!');
    } catch (error) {
        console.error('❌ Error during initial database setup:', error);
        throw error;
    }
};

/**
 * Seed first admin user
 */
export const seedFirstAdmin = async (): Promise<void> => {
    try {
        const admin_email = process.env.FIRST_ADMIN_EMAIL || "zudanga@gmail.com";
        console.log(`🔍 Checking if admin exists: ${admin_email}`);

        const admin_password = generateRandomPassword(12);
        const frontend_host = process.env.FRONTEND_URL || 'http://localhost:3000';

        const adminExists = await User.findByEmail(admin_email);
        console.log(`📄 Admin exists check result:`, adminExists ? 'Found' : 'Not found');

        if (!adminExists) {
            console.log('🔄 Creating first admin user...');
            const hashedPassword = await bcrypt.hash(admin_password, 10);
            const user = new User(
                "Super Admin",
                admin_email,
                hashedPassword,
                UserType.Admin,
                RegistrationType.Manual,
                'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                new Date(),
                new Date(),
                undefined,
                userStatuses.Active
            );

            const adminUser = await User.save(user);

            if (adminUser) {
                const context = {
                    year: new Date().getFullYear(),
                    logo_url: process.env.LOGO_URL,
                    subject: 'Super Admin Account Creation',
                    name: 'Super Admin',
                    message: `Congratulations on becoming the Super Admin of the HR Platform! As a Super Admin, you have full access to the system and the ability to manage all aspects of the platform. 
                Here is your temporary password: ${admin_password}. We highly recommend changing it after logging in for security purposes. 
                Thank you for taking on this important role!`,
                    link: `${frontend_host}/login`,
                    link_label: 'Log in to your account'
                };

                try {
                    await sendEmail('email_template', 'Super Admin Account creation', admin_email, context);
                    console.log("✅ Welcome email sent to admin");
                } catch (emailError) {
                    console.warn("⚠️  Failed to send welcome email, but admin user was created:", emailError);
                }

                console.log("✅ First admin user created successfully");
                console.log(`📧 Admin email: ${admin_email}`);
                console.log(`🔐 Temporary password: ${admin_password}`);
                console.log(`⚠️  Please save this password and change it after first login!`);
            } else {
                throw new Error("Failed to create admin user");
            }
        } else {
            console.log("ℹ️  Admin user already exists, skipping creation");
        }
    } catch (error) {
        console.error('❌ Error in seedFirstAdmin:', error);
        throw error;
    }
};

/**
 * Create initial data directory if it doesn't exist
 */
export const ensureDataDirectory = (): void => {
    const dataDir = path.resolve(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('📁 Created data directory');
    }
};
