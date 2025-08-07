/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/audits/all:
 *   get:
 *     summary: Retrieve a list of all audits
 *     description: Retrieve a paginated list of all audits. Only accessible by admin users.
 *     tags:
 *       - Audit Logs
 *     security:
 *      - bearerAuth: []
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
 *         description: A paginated list of audits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 audits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       action:
 *                         type: string
 *                         example: "User login"
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-01T12:34:56Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/audits/detail/{id}:
 *   get:
 *     summary: Retrieve details of a specific audit
 *     description: Retrieve detailed information about a specific audit by its ID. Only accessible by admin users.
 *     tags:
 *       - Audit Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the audit to retrieve
 *     responses:
 *       200:
 *         description: Detailed information about the audit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "12345"
 *                 action:
 *                   type: string
 *                   example: "User login"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:34:56Z"
 *                 details:
 *                   type: string
 *                   example: "User logged in from IP 192.168.1.1"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Audit not found
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
const { _viewAudit, _getAuditDetails } = require("../../controllers/auditController");
const { authenticationMiddleware } = require("../../middlewares/authenticationMiddleware");
const { authorizationMiddleware } = require("../../middlewares/authorizationMiddleware");

const auditRouter = Router();

const roles = ["admin", "hr"];

auditRouter.get("/all", authenticationMiddleware(), authorizationMiddleware(roles, '_viewAudit'), _viewAudit);
auditRouter.get("/detail/:id", authenticationMiddleware(), authorizationMiddleware(roles, '_getAuditDetails'), _getAuditDetails);


export default auditRouter;