import { Request, Response } from 'express';
import { ApplicationService } from '../services/applicationService';
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
        const userId = req.user?.id;
        if (!userId) {
            logger.error('User ID not found in request');
            return res.status(StatusCodes.UNAUTHORIZED).json(formatResponse('error', 'User not authenticated'));
        }
        const newApplication = await applicationService.createApplication(applicationData, userId);
        logger.info(`Application created with ID: ${newApplication.id}`);
        return res.status(StatusCodes.CREATED).json(formatResponse("success", "Application created successfully", newApplication));
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

        if (!req.user) {
            logger.warn('User not authenticated', { user: req.user });
            return res.status(StatusCodes.UNAUTHORIZED).json(formatResponse('error', 'User not authenticated'));
        }

        const file = req.file;

        if (!file || file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            throw new Error('Invalid file type. Please upload a valid .xlsx file.');
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
