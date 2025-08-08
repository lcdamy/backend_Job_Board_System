import { Request, Response } from 'express';
import { JobService } from '../services/jobService';
import { StatusCodes } from "http-status-codes";
import { formatResponse } from "../utils/helper";
import { JobDTO } from '../dtos/jobDTO';
import { jobValidationSchema } from '../utils/validate';
import logger from '../config/logger';

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: { id: number; [key: string]: any };
        }
    }
}

const jobService = new JobService();

export const createJob = async (req: Request, res: Response) => {
    try {
        logger.info('Received request to create job');
        const jobData: JobDTO = req.body;

        const { error } = jobValidationSchema.validate(jobData);
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', error.details[0].message));
        }

        const userId = req.user?.id; 
        if (!userId) {
            logger.error('User ID not found in request');
            return res.status(StatusCodes.UNAUTHORIZED).json(formatResponse('error', 'User not authenticated'));
        }

        const newJob = await jobService.createJob(jobData, userId);
        logger.info(`Job created with ID: ${newJob.id}`);

        return res.status(StatusCodes.CREATED).json(formatResponse("success", "Job created successfully", newJob));
    } catch (error) {
        logger.error(`Error creating job: ${(error as Error).message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse("error", (error as Error).message));
    }
};

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        logger.info('Received request to get all jobs');
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const jobs = await jobService.getAllJobs(page, limit);
        logger.info(`Retrieved jobs`);

        return res.status(StatusCodes.OK).json(formatResponse("success", "Jobs retrieved successfully", jobs));
    } catch (error) {
        logger.error(`Error retrieving jobs: ${(error as Error).message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse("error", (error as Error).message));
    }
};

export const getJobById = async (req: Request, res: Response) => {
    try {
        const jobId = parseInt(req.params.id);
        logger.info(`Received request to get job with ID: ${jobId}`);

        const job = await jobService.getJobById(jobId);
        if (!job) {
            logger.warn(`Job with ID ${jobId} not found`);
            return res.status(StatusCodes.NOT_FOUND).json(formatResponse("error", "Job not found"));
        }

        return res.status(StatusCodes.OK).json(formatResponse("success", "Job retrieved successfully", job));
    } catch (error) {
        logger.error(`Error retrieving job: ${(error as Error).message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse("error", (error as Error).message));
    }
};

export const updateJob = async (req: Request, res: Response) => {
    try {
        const jobId = parseInt(req.params.id);
        logger.info(`Received request to update job with ID: ${jobId}`);

        const jobData: JobDTO = req.body;

        const { error } = jobValidationSchema.validate(jobData);
        if (error) {
            logger.error(`Validation error: ${error.details[0].message}`);
            return res.status(StatusCodes.BAD_REQUEST).json(formatResponse('error', error.details[0].message));
        }

        const updatedJob = await jobService.updateJob(jobId, jobData);
        if (!updatedJob) {
            logger.warn(`Job with ID ${jobId} not found`);
            return res.status(StatusCodes.NOT_FOUND).json(formatResponse("error", "Job not found"));
        }

        logger.info(`Job with ID ${jobId} updated successfully`);
        return res.status(StatusCodes.OK).json(formatResponse("success", "Job updated successfully", updatedJob));
    } catch (error) {
        logger.error(`Error updating job: ${(error as Error).message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse("error", (error as Error).message));
    }
};

export const deleteJob = async (req: Request, res: Response) => {
    try {
        const jobId = parseInt(req.params.id);
        logger.info(`Received request to delete job with ID: ${jobId}`);

        const deleted = await jobService.deleteJob(jobId);
        if (!deleted) {
            logger.warn(`Job with ID ${jobId} not found`);
            return res.status(StatusCodes.NOT_FOUND).json(formatResponse("error", "Job not found"));
        }

        logger.info(`Job with ID ${jobId} deleted successfully`);
        return res.status(StatusCodes.OK).json(formatResponse("success", "Job deleted successfully"));
    } catch (error) {
        logger.error(`Error deleting job: ${(error as Error).message}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse("error", (error as Error).message));
    }
};