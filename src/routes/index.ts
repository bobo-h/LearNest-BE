import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import classRoutes from './class.routes';
import inviteRoutes from './invite.routes';
import unitRoutes from './unit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/invite', inviteRoutes);
router.use('/classes/:classId/units', unitRoutes);

export default router;
