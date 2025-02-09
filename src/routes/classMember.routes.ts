import { Router } from 'express';
import {
  getClassMembers,
  leaveClass,
  removeMember,
} from '../controllers/classMember.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';
import { checkClassMember } from '../middleware/checkClassMember';

const router = Router({ mergeParams: true });

router.delete('/', authenticate, checkClassMember, leaveClass);
router.delete(
  '/:id',
  authenticate,
  checkClassRole(['instructor']),
  removeMember,
);
router.get('/', authenticate, checkClassRole(['instructor']), getClassMembers);

export default router;
