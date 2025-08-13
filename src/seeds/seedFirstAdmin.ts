
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/emailService";
import { generateRandomPassword } from "../utils/helper";
import { userStatuses, UserType, RegistrationType } from "../types";
import { connectDB, db } from '../config/db';
import { createTablesIfNotExist } from '../database/init';


const seedFirstAdmin = async () => {
    try {
        // Initialize database connection first
        console.log('🔄 Initializing database connection...');
        await connectDB();
        console.log('✅ Database connected successfully');
        
        console.log('🔄 Creating tables if they don\'t exist...');
        await createTablesIfNotExist();
        console.log('✅ Tables initialized successfully');

        const admin_email = process.env.FIRST_ADMIN_EMAIL || "zudanga@gmail.com";
        console.log(`🔍 Checking if admin exists: ${admin_email}`);

    const admin_password = generateRandomPassword(12);
    const frontend_host = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : 'http://localhost:3000';

    const adminExists = await User.findByEmail(admin_email);
    console.log(`📄 Admin exists check result:`, adminExists ? 'Found' : 'Not found');

    // Ensure adminExists is null or undefined if not found
    if (!adminExists) {
        console.log('🔄 Creating new admin user...');
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
                message: `Congratulations on becoming the Super Admin of alight HR Platform! As a Super Admin, you have full access to the system and the ability to manage all aspects of the platform. 
            Here is your temporary password: ${admin_password}. We highly recommend changing it after logging in for security purposes. 
            Thank you for taking on this important role!`,
                link: `${frontend_host}/login`,
                link_label: 'Click to Login'
            };
            await sendEmail('email_template', 'Super Admin Account creation', admin_email, context);
            console.log("First admin user created successfully");
            console.log(`Admin email: ${admin_email}`);
            console.log(`Temporary password: ${admin_password}`);
        } else {
            console.log("Failed to create admin user");
        }
    } else {
        console.log("Admin user already exists");
        return admin_email;
    }
    } catch (error) {
        console.error('❌ Error in seedFirstAdmin:', error);
        throw error;
    }
};

seedFirstAdmin().catch((error) => {
    console.error("Error seeding First admin", error);
    process.exit(1);
});