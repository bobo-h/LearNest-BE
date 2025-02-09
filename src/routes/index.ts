import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import classRoutes from './class.routes';
import inviteRoutes from './invite.routes';
import unitRoutes from './unit.routes';
import subunitRoutes from './subunit.routes';
import classMemberRoutes from './classMember.routes';
import submissionRoutes from './submission.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/classes/:classId/members', classMemberRoutes);
router.use('/classes/:classId/invite', inviteRoutes);
router.use('/classes/:classId/units', unitRoutes);
router.use('/classes/:classId/units/:unitId/subunits', subunitRoutes);
router.use(
  '/classes/:classId/assignments/:assignmentId/submissions',
  submissionRoutes,
);

export default router;
