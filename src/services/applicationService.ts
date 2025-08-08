import { Application } from "../models/Application";
import { User } from "../models/User";
import { sendEmail } from "../utils/emailService";
import logger from '../config/logger';
import { applicationStatuses } from '../types';
import { ApplicationDTO } from "../dtos/applicationDTO";
import fs from 'fs';
import path from 'path';


export class ApplicationService {
    private frontend_host = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : 'http://localhost:3000';
    private backend_host = process.env.BACKEND_URL ? process.env.BACKEND_URL : 'http://localhost:3001';

    // Create a new application
    async createApplication(applicationData: ApplicationDTO, userId: number): Promise<Application> {
        const user = await User.findOne(userId);
        if (!user) {
            logger.error(`Application creation failed: User not found with id ${userId}`);
            throw new Error('User not found');
        }

        const newApplication = new Application(
            applicationData.jobId,
            userId,
            applicationData.coverLetter,
            applicationData.resumeURL,
            applicationStatuses.Pending,
            new Date(),
            new Date()
        );

        const savedApplication = await Application.save(newApplication);

        const context = {
            year: new Date().getFullYear(),
            logo_url: process.env.LOGO_URL,
            subject: 'Application Submitted Successfully',
            name: user.names,
            message: `Your application for job ID "${savedApplication.jobId}" has been submitted.`,
            link: `${this.frontend_host}/login`,
            link_label: 'Log in to your account'
        };
        if (user.email) {
            sendEmail('email_template', 'Application submission', user.email, context);
        }

        logger.info(`Application created successfully with id ${savedApplication.id} by user ${userId}`);
        return savedApplication;
    }

    // Get all applications with pagination
    async getAllApplications(page: number, limit: number): Promise<{ data: Application[]; total: number; page: number; lastPage: number }> {
        const allApplications = await Application.find();
        const total = allApplications.length;
        const lastPage = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const data = allApplications.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime()).slice(start, start + limit);
        return { data, total, page, lastPage };
    }

    // Get application by id
    async getApplicationById(applicationId: number): Promise<Application | null> {
        const application = await Application.findOne(applicationId);
        if (!application) {
            logger.warn(`Application not found with id ${applicationId}`);
            throw new Error('Application not found');
        }
        return application;
    }

    // Update application
    async updateApplication(applicationId: number, applicationData: Partial<Application>): Promise<Application> {
        const application = await Application.findOne(applicationId);
        if (!application) {
            logger.error(`Application update failed: Application not found with id ${applicationId}`);
            throw new Error('Application not found');
        }
        const updatedApplication = await Application.update(applicationId, { ...applicationData });
        if (!updatedApplication) {
            logger.error(`Application update failed: Could not update application with id ${applicationId}`);
            throw new Error('Failed to update application');
        }
        logger.info(`Application updated successfully with id ${applicationId}`);
        return updatedApplication;
    }

    // Delete application
    async deleteApplication(applicationId: number): Promise<boolean> {
        const application = await Application.findOne(applicationId);
        if (!application) {
            logger.error(`Application deletion failed: Application not found with id ${applicationId}`);
            throw new Error('Application not found');
        }
        const deleted = await Application.delete(applicationId);
        logger.info(`Application deleted with id ${applicationId}`);
        return deleted;
    }

    // Upload file
    async uploadUsersFile(file: Express.Multer.File): Promise<{ url: string }> {
        if (!file) {
            logger.error('File upload failed: No file provided');
            throw new Error('No file provided');
        }
        // rename file to include timestamp
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const newFileName = `${timestamp}-${file.originalname}`;
        const uploadsDir = path.join(__dirname, '../../uploads');
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            logger.info(`Uploads directory created: ${uploadsDir}`);
        }
        const fileUrl = `${this.backend_host}/uploads/${newFileName}`;
        logger.info(`File uploaded successfully: ${fileUrl}`);
        // Save file to local storage
        const filePath = path.join(uploadsDir, newFileName);
        await fs.promises.rename(file.path, filePath);
        logger.info(`File moved to uploads directory: ${filePath}`);
        // Optionally, you can save the file URL to the user's record or a related model
        return { url: fileUrl };
    }
}
