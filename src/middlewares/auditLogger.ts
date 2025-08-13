import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';

export const auditLogger = (req: any, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    let oldSend = res.send;
    res.send = function (data) {
        res.locals.body = data;
        return oldSend.call(res, data);
    };
    res.on('finish', async () => {
        const endTime = Date.now();
        const duration = `${endTime - startTime}ms`;
        const auditLog = new AuditLog(
            new Date(),
            req.method,
            req.originalUrl,
            res.statusCode,
            req.headers['user-agent'] || 'unknown',
            new Date(),
            new Date(),
            duration
        );
        const xForwardedFor = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userIpFromFrontend = req.headers['user-public-ip'];
        auditLog.timestamp = new Date();
        auditLog.method = req.method;
        auditLog.url = req.originalUrl;
        auditLog.statusCode = res.statusCode;
        auditLog.duration = duration;
        auditLog.userAgent = req.headers['user-agent'] || 'unknown';
        auditLog.ipAddress = String(userIpFromFrontend || (typeof xForwardedFor === 'string' ? xForwardedFor.split(',')[0] : Array.isArray(xForwardedFor) ? xForwardedFor[0] : req.socket.remoteAddress || 'unknown'));
        auditLog.responseBody = Buffer.from(typeof res.locals.body === 'string' ? res.locals.body : JSON.stringify(res.locals.body || 'unknown')).toString('base64');
        auditLog.requestBody = Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || 'unknown')).toString('base64');

        let responseBody;
        try {
            responseBody = JSON.parse(res.locals.body);
        } catch (error) {
            responseBody = { message: 'unknown', status: 'unknown' };
        }

        auditLog.activity = req.method;
        auditLog.details = responseBody.message || 'unknown';
        auditLog.status = responseBody.status || 'unknown';

        // Get user email for audit log if available
        let userEmail = 'unknown';
        if (req.user && typeof req.user.email === 'string') {
            userEmail = req.user.email;
        } else if (req.user && typeof req.user === 'string') {
            userEmail = req.user;
        }
        auditLog.doneBy = userEmail;

        AuditLog.save(auditLog)
            .then(() => {
                console.log('Audit log saved successfully');
            })
            .catch((error) => {
                console.error('Error saving audit log:', error);
            });
    });
    next();
};