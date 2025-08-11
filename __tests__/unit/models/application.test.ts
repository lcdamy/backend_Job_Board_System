import { Application } from '../../../src/models/Application';
import { applicationStatuses } from '../../../src/types';
import { TestHelper } from '../../helpers/testHelper';

describe('Application Model', () => {
    beforeAll(async () => {
        await TestHelper.setupTestDatabase();
    });

    beforeEach(async () => {
        await TestHelper.cleanDatabase();
    });

    afterAll(async () => {
        await TestHelper.closeDatabase();
    });

    describe('Application model functions', () => {
        it('should create a new application successfully', async () => {
            const applicationData = new Application(
                1,
                'This is my cover letter.',
                'https://example.com/resume.pdf',
                applicationStatuses.Pending,
                new Date(),
                new Date(),
                undefined,
                '1234567890',
                'applicant@example.com',
                'https://linkedin.com/in/applicant',
                'Software Engineer',
                'Applicant Name'
            );

            const savedApplication = await Application.save(applicationData);

            expect(savedApplication).toBeDefined();
            expect(savedApplication.id).toBeDefined();
            expect(savedApplication.jobId).toBe(1);
            expect(savedApplication.coverLetter).toBe('This is my cover letter.');
            expect(savedApplication.status).toBe(applicationStatuses.Pending);
        });

        it('should find application by id', async () => {
            const applicationData = new Application(
                2,
                'Another cover letter.',
                'https://example.com/resume2.pdf',
                applicationStatuses.Pending,
                new Date(),
                new Date(),
                undefined,
                '0987654321',
                'another@example.com',
                'https://linkedin.com/in/another',
                'Backend Developer',
                'Another Name'
            );

            const savedApplication = await Application.save(applicationData);
            const foundApplication = await Application.findOne(savedApplication.id!);

            expect(foundApplication).toBeDefined();
            expect(foundApplication?.id).toBe(savedApplication.id);
            expect(foundApplication?.jobId).toBe(2);
        });

        it('should return null when application not found by id', async () => {
            const foundApplication = await Application.findOne(99999);
            expect(foundApplication).toBeNull();
        });

        it('should update application successfully', async () => {
            const applicationData = new Application(
                3,
                'Initial cover letter.',
                'https://example.com/resume3.pdf',
                applicationStatuses.Pending,
                new Date(),
                new Date(),
                undefined,
                '1112223333',
                'update@example.com',
                'https://linkedin.com/in/update',
                'Frontend Developer',
                'Update Name'
            );

            const savedApplication = await Application.save(applicationData);

            const updatedApplication = await Application.update(savedApplication.id!, {
                coverLetter: 'Updated cover letter.',
                status: applicationStatuses.Accepted
            });

            expect(updatedApplication).toBeDefined();
            expect(updatedApplication?.coverLetter).toBe('Updated cover letter.');
            expect(updatedApplication?.status).toBe(applicationStatuses.Accepted);
        });

        it('should delete application successfully', async () => {
            const applicationData = new Application(
                4,
                'Delete this application.',
                'https://example.com/resume4.pdf',
                applicationStatuses.Pending,
                new Date(),
                new Date(),
                undefined,
                '4445556666',
                'delete@example.com',
                'https://linkedin.com/in/delete',
                'QA Engineer',
                'Delete Name'
            );

            const savedApplication = await Application.save(applicationData);
            const deleted = await Application.delete(savedApplication.id!);

            expect(deleted).toBe(true);

            const foundApplication = await Application.findOne(savedApplication.id!);
            expect(foundApplication).toBeNull();
        });

        it('should get all applications', async () => {
            // Clear existing applications first
            const existingApplications = await Application.find();
            for (const app of existingApplications) {
                if (app.id) await Application.delete(app.id);
            }

            // Create test applications
            const app1 = new Application(
                10,
                'App1 cover letter.',
                'https://example.com/resume10.pdf',
                applicationStatuses.Pending,
                new Date(),
                new Date(),
                undefined,
                '1010101010',
                'app1@example.com',
                'https://linkedin.com/in/app1',
                'DevOps Engineer',
                'App One'
            );

            const app2 = new Application(
                20,
                'App2 cover letter.',
                'https://example.com/resume20.pdf',
                applicationStatuses.Accepted,
                new Date(),
                new Date(),
                undefined,
                '2020202020',
                'app2@example.com',
                'https://linkedin.com/in/app2',
                'Data Scientist',
                'App Two'
            );

            await Application.save(app1);
            await Application.save(app2);

            const allApplications = await Application.find();
            expect(allApplications.length).toBe(2);
            expect(allApplications.map(a => a.email)).toContain('app1@example.com');
            expect(allApplications.map(a => a.email)).toContain('app2@example.com');
        });

        it('should find application by jobId and userId', async () => {
            const jobId = 99;
            const applicationData = new Application(
                jobId,
                'Find by job and user.',
                'https://example.com/resume99.pdf',
                applicationStatuses.Pending,
                new Date(),
                new Date(),
                undefined,
                '9998887777',
                'findby@example.com',
                'https://linkedin.com/in/findby',
                'Fullstack Developer',
                'Find By'
            );

            await Application.save(applicationData);

            const found = await Application.findApplicationByJobSeeker(jobId, 'findby@example.com');

            expect(found).toBeDefined();
            expect(found?.jobId).toBe(jobId);
            expect(found?.email).toBe('findby@example.com');
        });

        it('should return null if no application found by jobId and userId', async () => {
            const found = await Application.findApplicationByJobSeeker(123456, 'notfound@example.com');
            expect(found).toBeNull();
        });

        it('should get all applications by jobId', async () => {
            const jobId = 555;
            // Clear existing applications for this jobId
            const existing = await Application.getApplicationsByJobId(jobId);
            for (const app of existing) {
                if (app.id) await Application.delete(app.id);
            }

            const appA = new Application(
                jobId,
                'App A',
                'https://example.com/resumeA.pdf',
                applicationStatuses.Pending,
                new Date(),
                new Date(),
                undefined,
                '5551112222',
                'appa@example.com',
                'https://linkedin.com/in/appa',
                'Designer',
                'App A'
            );
            const appB = new Application(
                jobId,
                'App B',
                'https://example.com/resumeB.pdf',
                applicationStatuses.Accepted,
                new Date(),
                new Date(),
                undefined,
                '5553334444',
                'appb@example.com',
                'https://linkedin.com/in/appb',
                'Manager',
                'App B'
            );

            await Application.save(appA);
            await Application.save(appB);

            const apps = await Application.getApplicationsByJobId(jobId);
            expect(apps.length).toBe(2);
            expect(apps.map(a => a.email)).toContain('appa@example.com');
            expect(apps.map(a => a.email)).toContain('appb@example.com');
        });
    });
});