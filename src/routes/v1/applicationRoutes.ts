
/**
 * @swagger
 * /api/v1/application/create:
 *   post:
 *     summary: Create a new application
 *     tags: [Job Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: integer
 *                 example: 123
 *               coverLetter:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/cover-letter.pdf"
 *               resumeURL:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/resume.pdf"
 *               jobTitle:
 *                 type: string
 *                 example: "Software Engineer"
 *               names:
 *                 type: string
 *                 example: "John Doe"
 *               phoneNumber:
 *                 type: string
 *                 example: "+250785485889"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "zudanga100@gmail.com"
 *               linkedInProfile:
 *                 type: string
 *                 format: uri
 *                 example: "https://linkedin.com/in/johndoe"
 *     responses:
 *       200:
 *         description: Application created successfully
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
 *                   example: "jobId is required"
 */

/**
 * @swagger
 * /api/v1/application/detail/{id}:
 *   get:
 *     summary: Get application details by ID
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The application ID
 *     responses:
 *       200:
 *         description: Application details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 jobId:
 *                   type: string
 *                 coverLetter:
 *                   type: string
 *                 resume:
 *                   type: string
 *                 status:
 *                   type: string
 *                   example: "pending"
 *       404:
 *         description: Application not found
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
 *                   example: "Application not found"
 */

/**
 * @swagger
 * /api/v1/application/update/{id}:
 *   put:
 *     summary: Update an application by ID
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "under-review"
 *     responses:
 *       200:
 *         description: Application updated successfully
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
 *                   example: "status is required"
 *       404:
 *         description: Application not found
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
 *                   example: "Application not found"
 */

/**
 * @swagger
 * /api/v1/application/delete/{id}:
 *   delete:
 *     summary: Delete an application by ID
 *     tags: [Job Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
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
 *                   example: "Application deleted"
 *       404:
 *         description: Application not found
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
 *                   example: "Application not found"
 */

/**
 * @swagger
 * /api/v1/application/list:
 *   get:
 *     summary: Get a list of all applications
 *     tags: [Job Applications]
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
 *         description: List of applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   jobId:
 *                     type: string
 *                   coverLetter:
 *                     type: string
 *                   resume:
 *                     type: string
 *                   status:
 *                     type: string
 *                     example: "pending"
 */

/**
 * @swagger
 * /api/v1/application/upload:
 *   post:
 *     summary: Upload a file for a job application
 *     tags: [Job Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
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
 *                   example: "File uploaded"
 */

import { Router } from "express";
const {
    createApplication,
    getApplicationById,
    updateApplication,
    deleteApplication,
    getAllApplications,
    uploadFile

} = require("../../controllers/applicationController");
const { authenticationMiddleware } = require("../../middlewares/authenticationMiddleware");
const { authorizationMiddleware } = require("../../middlewares/authorizationMiddleware");
const { getUploadMiddleware } = require("../../middlewares/bucket");

const ApplicationRouter = Router();
const roles = ["admin", "job-seeker"];

ApplicationRouter.post('/create', createApplication);
ApplicationRouter.get('/detail/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'getApplicationById'), getApplicationById);
ApplicationRouter.put('/update/:id', authenticationMiddleware(), authorizationMiddleware(["admin"], 'updateApplication'), updateApplication);
ApplicationRouter.delete('/delete/:id', authenticationMiddleware(), authorizationMiddleware(["admin"], 'deleteApplication'), deleteApplication);
ApplicationRouter.get('/list', authenticationMiddleware(), authorizationMiddleware(roles, 'getAllApplications'), getAllApplications);
// Public upload endpoint (no authentication)
ApplicationRouter.post("/upload", getUploadMiddleware().single('file'), uploadFile);

export default ApplicationRouter;