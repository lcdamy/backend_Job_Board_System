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
 *               position:
 *                 type: string
 *                 example: "Software Engineer"
 *               positionLeft:
 *                 type: number
 *                 example: 3
 *               applicants:
 *                 type: number
 *                 example: 10
 *               interviewed:
 *                 type: number
 *                 example: 5
 *               rejected:
 *                 type: number
 *                 example: 2
 *               feedbackPending:
 *                 type: number
 *                 example: 1
 *               offered:
 *                 type: number
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "Responsible for developing backend services."
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["TypeScript", "Node.js"]
 *               responsabilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Write clean code", "Review PRs"]
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *               applicationLink:
 *                 type: string
 *                 example: "https://company.com/apply"
 *               status:
 *                 type: string
 *                 enum: [open, closed]
 *                 example: "open"
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
 *                   example: "Position is a required field"
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
 *                 position:
 *                   type: string
 *                 positionLeft:
 *                   type: number
 *                 applicants:
 *                   type: number
 *                 interviewed:
 *                   type: number
 *                 rejected:
 *                   type: number
 *                 feedbackPending:
 *                   type: number
 *                 offered:
 *                   type: number
 *                 description:
 *                   type: string
 *                 requirements:
 *                   type: array
 *                   items:
 *                     type: string
 *                 responsabilities:
 *                   type: array
 *                   items:
 *                     type: string
 *                 applicationDeadline:
 *                   type: string
 *                   format: date
 *                 applicationLink:
 *                   type: string
 *                 status:
 *                   type: string
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
 *               position:
 *                 type: string
 *               positionLeft:
 *                 type: number
 *               applicants:
 *                 type: number
 *               interviewed:
 *                 type: number
 *               rejected:
 *                 type: number
 *               feedbackPending:
 *                 type: number
 *               offered:
 *                 type: number
 *               description:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               responsabilities:
 *                 type: array
 *                 items:
 *                   type: string
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *               applicationLink:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, closed]
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
 *                   example: "Invalid job data"
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
 *                   position:
 *                     type: string
 *                   positionLeft:
 *                     type: number
 *                   applicants:
 *                     type: number
 *                   interviewed:
 *                     type: number
 *                   rejected:
 *                     type: number
 *                   feedbackPending:
 *                     type: number
 *                   offered:
 *                     type: number
 *                   description:
 *                     type: string
 *                   requirements:
 *                     type: array
 *                     items:
 *                       type: string
 *                   responsabilities:
 *                     type: array
 *                     items:
 *                       type: string
 *                   applicationDeadline:
 *                     type: string
 *                     format: date
 *                   applicationLink:
 *                     type: string
 *                   status:
 *                     type: string
 */


import { Router } from "express";
const { authorizationMiddleware } = require("../../middlewares/authorizationMiddleware");
const { authenticationMiddleware } = require("../../middlewares/authenticationMiddleware");
const {
    createJob,
    getJobById,
    updateJob,
    deleteJob,
    getAllJobs
} = require("../../controllers/jobController");

const jobRouter = Router();

const roles = ["admin", "hr"];

jobRouter.post('/create', authenticationMiddleware(), authorizationMiddleware(roles, 'createJob'), createJob);
jobRouter.get('/detail/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'getJobById'), getJobById);
jobRouter.put('/update/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'updateJob'), updateJob);
jobRouter.delete('/delete/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'deleteJob'), deleteJob);
jobRouter.get('/list', authenticationMiddleware(), authorizationMiddleware(roles, 'getAllJobs'), getAllJobs);


export default jobRouter;
