import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import classRoutes from './class.routes';
import inviteRoutes from './invite.routes';
import unitRoutes from './unit.routes';
import subunitRoutes from './subunit.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/classes/:classId/invite', inviteRoutes);
router.use('/classes/:classId/units', unitRoutes);
router.use('/classes/:classId/units/:unitId/subunits', subunitRoutes);

export default router;
