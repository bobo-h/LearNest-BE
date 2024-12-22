import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import classRoutes from './class.routes';
import inviteRoutes from './invite.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/invite', inviteRoutes);

export default router;
