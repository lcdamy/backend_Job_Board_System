import express from 'express';
import authRoutes from './authRoutes';
import applicationRoutes from './applicationRoutes';
import jobRoutes from './jobRoutes';
import auditRouter from './auditRoutes';


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/job', jobRoutes);
router.use('/audits', auditRouter);
router.use('/application', applicationRoutes);


export default router;