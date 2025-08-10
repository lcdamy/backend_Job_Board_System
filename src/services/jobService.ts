import { Job } from "../models/Job";
import { ApplicationService } from "./applicationService";
import { User } from "../models/User";
import { JobDTO } from "../dtos/jobDTO";
import { sendEmail } from "../utils/emailService";
import logger from '../config/logger';
import { jobStatuses } from '../types';


export class JobService {
    private frontend_host = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : 'http://localhost:3000';
    private applicationService = new ApplicationService();

    // Create a new job
    async createJob(jobData: JobDTO, userId: number): Promise<Job> {
        const user = await User.findOne(userId);
        if (!user) {
            logger.error(`Job creation failed: User not found with id ${userId}`);
            throw new Error('User not found');
        }

        const newJob = new Job(
            jobData.title,
            jobData.description,
            jobData.company,
            jobData.location,
            new Date(jobData.deadline),
            jobData.type,
            jobStatuses.Open,
            userId,
            new Date(),
            new Date()
        );

        const savedJob = await Job.save(newJob);

        const context = {
            year: new Date().getFullYear(),
            logo_url: process.env.LOGO_URL,
            subject: 'Job Created Successfully',
            name: user.names,
            message: `Your job titled "${savedJob.title}" has been successfully created.`,
            link: `${this.frontend_host}/login`,
            link_label: 'Log in to your account'
        };
        if (user.email) {
            sendEmail('email_template', 'Job creation', user.email, context);
        }

        logger.info(`Job created successfully with id ${savedJob.id} by user ${userId}`);
        return savedJob;
    }

    // Get all jobs with pagination
    async getAllJobs(page: number, limit: number): Promise<{ data: Job[]; total: number; page: number; lastPage: number }> {
        const allJobs = await Job.find();
        const total = allJobs.length;
        const lastPage = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const data = allJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(start, start + limit);
        return { data, total, page, lastPage };
    }

    // Get jobs  with pagination and applications that are related to the job
    async getJobsWithApplications(page: number, limit: number): Promise<{ data: Job[]; total: number; page: number; lastPage: number }> {
        const allJobs = await Job.find();
        const total = allJobs.length;
        const lastPage = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const data = allJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(start, start + limit);

        // Fetch applications for each job
        for (const job of data) {
            if (typeof job.id === 'number') {
                job.applications = await this.applicationService.getApplicationsByJobId(job.id);
            } else {
                logger.warn(`Job id is undefined for job: ${JSON.stringify(job)}`);
                job.applications = [];
            }
        }

        return { data, total, page, lastPage };
    }

    // Get job by id
    async getJobById(jobId: number): Promise<Job | null> {
        const job = await Job.findOne(jobId);
        if (!job) {
            logger.warn(`Job not found with id ${jobId}`);
            throw new Error('Job not found');
        }
        return job;
    }

    // Get job by title
    async getJobByTitle(
        title: string,
        company: string,
        location: string
    ): Promise<Job | null> {
        const job = await Job.findJobExistent(title, company, location);
        if (!job) {
            logger.warn(`Job not found with title ${title}`);
            return null;
        }
        return job;
    }

    // Update job
    async updateJob(jobId: number, jobData: Partial<JobDTO>): Promise<Job> {
        const job = await Job.findOne(jobId);
        if (!job) {
            logger.error(`Job update failed: Job not found with id ${jobId}`);
            throw new Error('Job not found');
        }
        const updatedJob = await Job.update(jobId, { ...jobData });
        if (!updatedJob) {
            logger.error(`Job update failed: Could not update job with id ${jobId}`);
            throw new Error('Failed to update job');
        }
        logger.info(`Job updated successfully with id ${jobId}`);
        return updatedJob;
    }

    // Delete job
    async deleteJob(jobId: number): Promise<boolean> {
        const job = await Job.findOne(jobId);
        if (!job) {
            logger.error(`Job deletion failed: Job not found with id ${jobId}`);
            throw new Error('Job not found');
        }
        const deleted = await Job.delete(jobId);
        logger.info(`Job deleted with id ${jobId}`);
        return deleted;
    }

    // Update jobs by deadline
    async updateJobsByDeadline(): Promise<void> {
        const now = new Date();
        const expiredJobs = await Job.findDeadline({ deadline: { $lt: now }, status: 'open' });
        for (const job of expiredJobs) {
            job.status = jobStatuses.Closed;
            await Job.save(job);
            logger.info(`Job closed due to deadline expiration: ${job.id}`);
        }
    }
}