import { Router } from 'express';
import {
  getClassMembers,
  removeMember,
  getSubmissionsByStudent,
} from '../controllers/classMember.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';

const router = Router({ mergeParams: true });

router.delete(
  '/:id',
  authenticate,
  checkClassRole(['instructor']),
  removeMember,
);
router.get('/', authenticate, checkClassRole(['instructor']), getClassMembers);
router.get(
  '/:userId/submissions',
  authenticate,
  checkClassRole(['instructor']),
  getSubmissionsByStudent,
);

export default router;
