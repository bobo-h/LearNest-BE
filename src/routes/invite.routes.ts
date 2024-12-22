import { Router } from 'express';
import { createInvite } from '../controllers/invite.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';
import { joinClass } from '../controllers/invite.controller';

const router = Router();

router.post(
  '/:classId',
  authenticate,
  checkClassRole('instructor'),
  createInvite,
);
router.post('/:classId/accept/:token', authenticate, joinClass);

export default router;
