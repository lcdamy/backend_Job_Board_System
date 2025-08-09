import { Job } from '../../../src/models/Job';
import { jobStatuses, jobTypes } from '../../../src/types';
import { TestHelper } from '../../helpers/testHelper';

describe('Job Model', () => {
    beforeAll(async () => {
        await TestHelper.setupTestDatabase();
    });

    afterAll(async () => {
        await TestHelper.cleanupTestDatabase();
    });

    describe('Job model functions', () => {
        it('should create a new job successfully', async () => {
            const jobData = new Job(
                'Software Engineer',
                'Develop and maintain software.',
                'Tech Corp',
                'Remote',
                new Date('2025-01-01'),
                jobTypes.FullTime,
                jobStatuses.Open,
                1,
                new Date(),
                new Date()
            );

            const savedJob = await Job.save(jobData);

            expect(savedJob).toBeDefined();
            expect(savedJob.id).toBeDefined();
            expect(savedJob.title).toBe('Software Engineer');
            expect(savedJob.company).toBe('Tech Corp');
            expect(savedJob.status).toBe(jobStatuses.Open);
        });

        it('should find job by id', async () => {
            const jobData = new Job(
                'Backend Developer',
                'Build APIs.',
                'DevHouse',
                'Onsite',
                new Date('2025-02-01'),
                jobTypes.PartTime,
                jobStatuses.Open,
                2,
                new Date(),
                new Date()
            );

            const savedJob = await Job.save(jobData);
            const foundJob = await Job.findOne(savedJob.id!);

            expect(foundJob).toBeDefined();
            expect(foundJob?.title).toBe('Backend Developer');
            expect(foundJob?.company).toBe('DevHouse');
        });

        it('should return null when job not found by id', async () => {
            const foundJob = await Job.findOne(999999);
            expect(foundJob).toBeNull();
        });

        it('should update job successfully', async () => {
            const jobData = new Job(
                'Frontend Developer',
                'Build UI.',
                'WebWorks',
                'Hybrid',
                new Date('2025-03-01'),
                jobTypes.Contract,
                jobStatuses.Open,
                3,
                new Date(),
                new Date()
            );

            const savedJob = await Job.save(jobData);

            const updatedJob = await Job.update(savedJob.id!, {
                title: 'Senior Frontend Developer',
                status: jobStatuses.Closed
            });

            expect(updatedJob).toBeDefined();
            expect(updatedJob?.title).toBe('Senior Frontend Developer');
            expect(updatedJob?.status).toBe(jobStatuses.Closed);
        });

        it('should delete job successfully', async () => {
            const jobData = new Job(
                'QA Engineer',
                'Test software.',
                'QualitySoft',
                'Remote',
                new Date('2025-04-01'),
                jobTypes.Internship,
                jobStatuses.Open,
                4,
                new Date(),
                new Date()
            );

            const savedJob = await Job.save(jobData);
            const deleted = await Job.delete(savedJob.id!);

            expect(deleted).toBe(true);

            const foundJob = await Job.findOne(savedJob.id!);
            expect(foundJob).toBeNull();
        });

        it('should get all jobs', async () => {
            // Clear existing jobs first
            const existingJobs = await Job.find();
            for (const job of existingJobs) {
                if (job.id) await Job.delete(job.id);
            }

            // Create test jobs
            const job1 = new Job(
                'DevOps Engineer',
                'Manage CI/CD.',
                'OpsInc',
                'Remote',
                new Date('2025-05-01'),
                jobTypes.FullTime,
                jobStatuses.Open,
                5,
                new Date(),
                new Date()
            );

            const job2 = new Job(
                'Product Manager',
                'Lead product development.',
                'ProdLead',
                'Onsite',
                new Date('2025-06-01'),
                jobTypes.PartTime,
                jobStatuses.Open,
                6,
                new Date(),
                new Date()
            );

            await Job.save(job1);
            await Job.save(job2);

            const allJobs = await Job.find();
            expect(allJobs).toHaveLength(2);
            expect(allJobs.map(j => j.title)).toContain('DevOps Engineer');
            expect(allJobs.map(j => j.title)).toContain('Product Manager');
        });

        it('should find job by title, company, and location', async () => {
            const jobData = new Job(
                'UI Designer',
                'Design user interfaces.',
                'DesignHub',
                'Remote',
                new Date('2025-07-01'),
                jobTypes.Contract,
                jobStatuses.Open,
                7,
                new Date(),
                new Date()
            );

            await Job.save(jobData);

            const foundJob = await Job.findJobExistent('UI Designer', 'DesignHub', 'Remote');
            expect(foundJob).toBeDefined();
            expect(foundJob?.title).toBe('UI Designer');
            expect(foundJob?.company).toBe('DesignHub');
            expect(foundJob?.location).toBe('Remote');
        });

        it('should return null when job not found by title, company, and location', async () => {
            const foundJob = await Job.findJobExistent('Nonexistent', 'NoCompany', 'Nowhere');
            expect(foundJob).toBeNull();
        });
    });
});