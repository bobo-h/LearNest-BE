import { Router } from 'express';
import {
  getClassMembers,
  removeMember,
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

export default router;
