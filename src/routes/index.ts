import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import classRoutes from './class.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);

export default router;
