import { NextFunction, Request, Response } from "express";
import { formatResponse } from "../utils/helper";
import { StatusCodes } from "http-status-codes";


export const authorizationMiddleware = (roles: string[], method: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;

            //check if the user is authenticated and has a role
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json(formatResponse("error", "User not found"));
            }
 
            //check if the user role is in the allowed roles list
            if (!roles.includes(user.role)) {
                return res.status(StatusCodes.FORBIDDEN).json(formatResponse("error", "You are not authorized to access this resource"));
            }
            next();
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(formatResponse("error", "An error occurred during authorization"));
        }
    };
};