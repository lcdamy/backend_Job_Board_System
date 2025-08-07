import express from 'express';
import authRoutes from './authRoutes';
import applicationRoutes from './applicationRoutes';
import jobRoutes from './jobRoutes';
import auditRouter from './auditRoutes';


const router = express.Router();

router.use('/auth', authRoutes);
// router.use('/application', applicationRoutes);
// router.use('/job', jobRoutes);
router.use('/audits', auditRouter);


export default router;