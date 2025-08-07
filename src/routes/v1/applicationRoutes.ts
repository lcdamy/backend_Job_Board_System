import { Router } from "express";
const {
    createApplication,
    getApplicationById,
    updateApplication,
    deleteApplication,
    getAllApplications

} = require("../../controllers/ApplicationController");
const { authenticationMiddleware } = require("../../middlewares/authenticationMiddleware");
const { authorizationMiddleware } = require("../../middlewares/authorizationMiddleware");

const ApplicationRouter = Router();
const roles = ["admin", "hr"];

ApplicationRouter.post('/create', authenticationMiddleware(), authorizationMiddleware(roles, 'createApplication'), createApplication);
ApplicationRouter.get('/detail/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'getApplicationById'), getApplicationById);
ApplicationRouter.put('/update/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'updateApplication'), updateApplication);
ApplicationRouter.delete('/delete/:id', authenticationMiddleware(), authorizationMiddleware(roles, 'deleteApplication'), deleteApplication);
ApplicationRouter.get('/list', authenticationMiddleware(), authorizationMiddleware(roles, 'getAllApplications'), getAllApplications);


export default ApplicationRouter;