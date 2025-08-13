import fs from 'fs';
import path from 'path';
import { User } from "../models/User";
import { Job } from '../models/Job';
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/emailService";
import { generateRandomPassword } from "../utils/helper";
import { userStatuses, UserType, RegistrationType, jobTypes, jobStatuses } from "../types";
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
        await seedJobListings();
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
                    link_label: 'Click to Login'
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
 * Seed some job listings
 */
export const seedJobListings = async (): Promise<void> => {
    try {
        console.log('🔄 Seeding job listings...');
        const jobs = [
            {
                title: "Software Engineer",
                description: "Develop and maintain software applications.",
                company: "Tech Corp",
                location: "Kampala, Uganda",
                deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
                type: jobTypes.FullTime,
                status: jobStatuses.Open,
                postedBy: 1,
            },
            {
                title: "Product Manager",
                description: "Lead product development and strategy.",
                company: "Business Inc",
                location: "Kigali, Rwanda",
                deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), // 45 days from now
                type: jobTypes.FullTime,
                status: jobStatuses.Open,
                postedBy: 1,
            },
            {
                title: "UX Designer",
                description: "Design user-friendly interfaces and experiences.",
                company: "Creative Agency",
                location: "Bujumbura, Burundi",
                deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days from now
                type: jobTypes.PartTime,
                status: jobStatuses.Open,
                postedBy: 1,
            },
            {
                title: "Data Scientist",
                description: "Analyze and interpret complex data.",
                company: "Data Solutions",
                location: "Kampala, Uganda",
                deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
                type: jobTypes.FullTime,
                status: jobStatuses.Open,
                postedBy: 1,
            },
            {
                title: "Machine Learning Engineer",
                description: "Develop machine learning models and algorithms.",
                company: "AI Innovations",
                location: "North-Province, Rwanda",
                deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), // 45 days from now
                type: jobTypes.FullTime,
                status: jobStatuses.Open,
                postedBy: 1,
            }
        ];

        for (const job of jobs) {
            const newJob = new Job(
                job.title,
                job.description,
                job.company,
                job.location,
                job.deadline,
                job.type,
                job.status,
                job.postedBy,
                new Date(),
                new Date()
            );
            await Job.save(newJob);
            console.log(`Seeded job: ${newJob.title} at ${newJob.company}`);
        }
        console.log("✅ Seeded 3 job listings successfully.");
    } catch (error) {
        console.error('❌ Error in seedJobListings:', error);
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
