import { Job } from "../models/Job";
import { jobStatuses, jobTypes } from "../types";
import { connectDB } from '../config/db';
import { createTablesIfNotExist } from '../database/init';

const seedJobs = async () => {
    await connectDB();
    await createTablesIfNotExist();

    const jobsData = [
        {
            title: "Frontend Developer",
            description: "Develop and maintain web applications using React.",
            company: "Tech Innovators",
            location: "New York, NY",
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
            type: jobTypes.FullTime,
            status: jobStatuses.Open,
            postedBy: 1,
        },
        {
            title: "Backend Engineer",
            description: "Build scalable backend services with Node.js.",
            company: "Cloud Solutions",
            location: "San Francisco, CA",
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
            type: jobTypes.FullTime,
            status: jobStatuses.Open,
            postedBy: 1,
        },
        {
            title: "UI/UX Designer",
            description: "Design user interfaces and experiences for mobile apps.",
            company: "Creative Minds",
            location: "Remote",
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
            type: jobTypes.PartTime,
            status: jobStatuses.Open,
            postedBy: 1,
        },
        {
            title: "DevOps Engineer",
            description: "Manage CI/CD pipelines and cloud infrastructure.",
            company: "Enterprise Tech",
            location: "Austin, TX",
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
            type: jobTypes.Contract,
            status: jobStatuses.Open,
            postedBy: 1,
        },
        {
            title: "Data Analyst",
            description: "Analyze business data and generate reports.",
            company: "Data Insights",
            location: "Boston, MA",
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
            type: jobTypes.FullTime,
            status: jobStatuses.Open,
            postedBy: 1,
        }
    ];

    for (const jobData of jobsData) {
        const job = new Job(
            jobData.title,
            jobData.description,
            jobData.company,
            jobData.location,
            jobData.deadline,
            jobData.type,
            jobData.status,
            jobData.postedBy,
            new Date(),
            new Date()
        );
        await Job.save(job);
        console.log(`Seeded job: ${job.title} at ${job.company}`);
    }
    console.log("✅ Seeded 5 jobs successfully.");
};

seedJobs().catch((err) => {
    console.error("Error seeding jobs:", err);
    process.exit(1);
});