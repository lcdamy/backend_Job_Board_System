import { Request, Response } from 'express';
import { ApplicationService } from '../services/applicationService';
import { JobService } from '../services/jobService';
import { AuthService } from '../services/authService';
import { StatusCodes } from "http-status-codes";
import { formatResponse } from "../utils/helper";
import logger from '../config/logger';
import { ApplicationDTO } from '../dtos/applicationDTO';
import { applicationValidationSchema } from '../utils/validate';

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: { id: number; [key: string]: any };
        }
    }
}

const applicationService = new ApplicationService();
const jobService = new JobService(); 
const authService = new AuthService();

export const createApplication = async (req: Request, res: Response) => {
    try {
        logger.info('Received request to create application');
        // Validate request body against ApplicationDTO
        const applicationData: ApplicationDTO = req.body;
        const { error } = applicationValidationSchema.validate(applicationData);
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', error.details[0].message));
        }

        //check if job exists
        const jobExists = await jobService.getJobById(applicationData.jobId);
        if (!jobExists) {
            logger.error(`Job with ID ${applicationData.jobId} does not exist`);
            return res.status(StatusCodes.NOT_FOUND).json(formatResponse('error', 'Job not found'));
        }
        //check if user has already applied for the job
        const existingApplication = await applicationService.getApplicationByJobAndUser(applicationData.jobId, applicationData.email);
        if (existingApplication) {
            logger.warn(`User with email ${applicationData.email} has already applied for job with ID ${applicationData.jobId}`);
            return res.status(StatusCodes.CONFLICT).json(formatResponse('error', 'You have already applied for this job'));
        }
        // check if the deadline for the job has passed
        const jobDeadline = jobExists.deadline;
        if (new Date(jobDeadline) < new Date()) {
            logger.warn(`Application for job with ID ${applicationData.jobId} is closed`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', 'Application for this job is closed'));
        }

        const newApplication = await applicationService.createApplication(applicationData);
        logger.info(`Application created with ID: ${newApplication.id}`);
        return res.status(StatusCodes.CREATED).json(formatResponse("success", "Application submitted successfully", newApplication));
    } catch (error) {
        logger.error(`Error creating application: ${(error as Error).message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse("error", (error as Error).message));
    }
};

export const getAllApplications = async (req: Request, res: Response) => {
    try {
        logger.info('Received request to get all applications');
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const applications = await applicationService.getAllApplications(page, limit);
        logger.info(`Retrieved applications`);
        return res.status(StatusCodes.OK).json(formatResponse("success", "Applications retrieved successfully", applications));
    } catch (error) {
        logger.error(`Error retrieving applications: ${(error as Error).message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse("error", (error as Error).message));
    }
};

export const getApplicationById = async (req: Request, res: Response) => {
    try {
        const applicationId = parseInt(req.params.id);
        logger.info(`Received request to get application with ID: ${applicationId}`);
        const application = await applicationService.getApplicationById(applicationId);
        return res.status(StatusCodes.OK).json(formatResponse("success", "Application retrieved successfully", application));
    } catch (error) {
        logger.error(`Error retrieving application: ${(error as Error).message}`);
        return res.status(StatusCodes.NOT_FOUND).json(formatResponse("error", (error as Error).message));
    }
};

export const updateApplication = async (req: Request, res: Response) => {
    try {
        const applicationId = parseInt(req.params.id);
        logger.info(`Received request to update application with ID: ${applicationId}`);
        const applicationData = req.body;
        const updatedApplication = await applicationService.updateApplication(applicationId, applicationData);
        logger.info(`Application with ID ${applicationId} updated successfully`);
        return res.status(StatusCodes.OK).json(formatResponse("success", "Application updated successfully", updatedApplication));
    } catch (error) {
        logger.error(`Error updating application: ${(error as Error).message}`);
        return res.status(StatusCodes.NOT_FOUND).json(formatResponse("error", (error as Error).message));
    }
};

export const deleteApplication = async (req: Request, res: Response) => {
    try {
        const applicationId = parseInt(req.params.id);
        logger.info(`Received request to delete application with ID: ${applicationId}`);
        await applicationService.deleteApplication(applicationId);
        logger.info(`Application with ID ${applicationId} deleted successfully`);
        return res.status(StatusCodes.OK).json(formatResponse("success", "Application deleted successfully"));
    } catch (error) {
        logger.error(`Error deleting application: ${(error as Error).message}`);
        return res.status(StatusCodes.NOT_FOUND).json(formatResponse("error", (error as Error).message));
    }
};

//import file user using multer and xlsx
export const uploadFile = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', 'No file uploaded'));
        }

        const file = req.file;

        if (!file) {
            throw new Error('Invalid file type. Please upload a valid file.');
        }
        const experts = await applicationService.uploadUsersFile(file);
        if (!experts) {
            logger.warn('No expert users found in the file');
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', 'No expert users found in the file'));
        }
        logger.info('Expert users imported successfully');
        return res.status(StatusCodes.OK).json(formatResponse("success", "Expert users imported successfully", experts));
    } catch (error) {
        logger.error(`Internal server error: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', (error as Error).message, error));
    }
}
