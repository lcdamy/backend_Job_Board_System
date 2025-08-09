/**
 * @swagger
 * /api/v1/job/create:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Software Engineer"
 *               description:
 *                 type: string
 *                 example: "Responsible for developing backend services."
 *               company:
 *                 type: string
 *                 example: "Isco tech"
 *               location:
 *                 type: string
 *                 example: "Kigali,Rwanda"
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               status:
 *                 type: string
 *                 enum: [open, closed]
 *                 example: "open"
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship]
 *                 example: "full-time"
 *     responses:
 *       200:
 *         description: Job created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Title is a required field"
 */

/**
 * @swagger
 * /api/v1/job/detail/{id}:
 *   get:
 *     summary: Get job details by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID
 *     responses:
 *       200:
 *         description: Job details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                   example: "Software Engineer"
 *                 description:
 *                   type: string
 *                   example: "Responsible for developing backend services."
 *                 company:
 *                   type: string
 *                   example: "Isco tech"
 *                 location:
 *                   type: string
 *                   example: "Kigali,Rwanda"
 *                 deadline:
 *                   type: string
 *                   format: date
 *                   example: "2025-09-01"
 *                 status:
 *                   type: string
 *                   enum: [open, closed]
 *                   example: "open"
 *                 type:
 *                   type: string
 *                   enum: [full-time, part-time, contract, internship]
 *                   example: "full-time"
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Job not found"
 */

/**
 * @swagger
 * /api/v1/job/update/{id}:
 *   put:
 *     summary: Update a job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Software Engineer"
 *               description:
 *                 type: string
 *                 example: "Responsible for developing backend services."
 *               company:
 *                 type: string
 *                 example: "Isco tech"
 *               location:
 *                 type: string
 *                 example: "Kigali,Rwanda"
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               status:
 *                 type: string
 *                 enum: [open, closed]
 *                 example: "open"
 *               type:
 *                 type: string
 *                 enum: [full-time, part-time, contract, internship]
 *                 example: "full-time"
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Title is a required field"
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Job not found"
 */

/**
 * @swagger
 * /api/v1/job/delete/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Job deleted"
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Job not found"
 */

/**
 * @swagger
 * /api/v1/job/list:
 *   get:
 *     summary: Get a list of all jobs
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: List of jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                     example: "Software Engineer"
 *                   description:
 *                     type: string
 *                     example: "Responsible for developing backend services."
 *                   company:
 *                     type: string
 *                     example: "Isco tech"
 *                   location:
 *                     type: string
 *                     example: "Kigali,Rwanda"
 *                   deadline:
 *                     type: string
 *                     format: date
 *                     example: "2025-09-01"
 *                   status:
 *                     type: string
 *                     enum: [open, closed]
 *                     example: "open"
 *                   type:
 *                     type: string
 *                     enum: [full-time, part-time, contract, internship]
 *                     example: "full-time"
 */

/**
 * @swagger
 * /api/v1/job/list-with-applications:
 *   get:
 *     summary: Get a list of all jobs with their applications
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs with applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                     example: "Software Engineer"
 *                   description:
 *                     type: string
 *                     example: "Responsible for developing backend services."
 *                   company:
 *                     type: string
 *                     example: "Isco tech"
 *                   location:
 *                     type: string
 *                     example: "Kigali,Rwanda"
 *                   deadline:
 *                     type: string
 *                     format: date
 *                     example: "2025-09-01"
 *                   status:
 *                     type: string
 *                     enum: [open, closed]
 *                     example: "open"
 *                   type:
 *                     type: string
 *                     enum: [full-time, part-time, contract, internship]
 *                     example: "full-time"
 *                   applications:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         applicantName:
 *                           type: string
 *                           example: "John Doe"
 *                         applicantEmail:
 *                           type: string
 *                           example: "john.doe@example.com"
 *                         resumeUrl:
 *                           type: string
 *                           example: "https://example.com/resume.pdf"
 *                         status:
 *                           type: string
 *                           enum: [pending, accepted, rejected]
 *                           example: "pending"
 *                         appliedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-06-01T12:00:00Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */  


import { Router } from "express";
const { authorizationMiddleware } = require("../../middlewares/authorizationMiddleware");
const { authenticationMiddleware } = require("../../middlewares/authenticationMiddleware");
const {
    createJob,
    getJobById,
    updateJob,
    deleteJob,
    getAllJobs,
    getJobsWithApplications
} = require("../../controllers/jobController");

const jobRouter = Router();

const roles = ["admin"];

jobRouter.post('/create', authenticationMiddleware(), authorizationMiddleware(roles, 'createJob'), createJob);
jobRouter.get('/detail/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'getJobById'), getJobById);
jobRouter.put('/update/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'updateJob'), updateJob);
jobRouter.delete('/delete/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'deleteJob'), deleteJob);
jobRouter.get('/list', authenticationMiddleware(), authorizationMiddleware(roles, 'getAllJobs'), getAllJobs);
jobRouter.get('/list-with-applications', authenticationMiddleware(), authorizationMiddleware(roles, 'getJobsWithApplications'), getJobsWithApplications);

export default jobRouter;
