import { Request, Response } from 'express';
import { AuditService } from '../services/auditService';
import { StatusCodes } from "http-status-codes";
import { formatResponse } from "../utils/helper";
import logger from '../config/logger';


const auditService = new AuditService();

// get all audit logs
export const _viewAudit = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';

        // Extract filters from query parameters
        const filters: Record<string, any> = {};
        Object.keys(req.query).forEach((key) => {
            if (!['page', 'limit', 'search'].includes(key)) {
                filters[key] = req.query[key];
            }
        });

        const auditLogs = await auditService.getAllAudit(page, limit, search, filters);
        auditLogs.data.forEach((log: any) => {
            log.timestamp = new Date(log.timestamp).toLocaleString();
        });
        
        return res.status(StatusCodes.OK).json(formatResponse("success", "Audit logs retrieved successfully", auditLogs));
    } catch (error) {
        logger.error(`Internal server error: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', (error as Error).message, error));
    }
}

// get audit log details by id
export const _getAuditDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const auditId = req.params.id;
        const auditLog = await auditService.getAuditById(auditId);
        if (!auditLog) {
            return res.status(StatusCodes.NOT_FOUND).json(formatResponse('error', 'Audit log not found'));
        }
        // Hide password and other sensitive data
        if (auditLog.request) {
            if (auditLog.request.password) {
            auditLog.request.password = "********";
            }
            if (auditLog.request.newPassword) {
            auditLog.request.newPassword = "********";
            }
            if (auditLog.request.token) {
            auditLog.request.token = "********";
            }
        }

        if (auditLog.response?.data?.profileDetails?.user?.password) {
            auditLog.response.data.profileDetails.user.password = "********";
        }
    
        return res.status(StatusCodes.OK).json(formatResponse("success", "Audit log retrieved successfully", auditLog));
    } catch (error) {
        logger.error(`Internal server error: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse('error', (error as Error).message, error));
    }
}