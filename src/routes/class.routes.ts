import { Router } from 'express';
import {
  createClass,
  getUserClasses,
  updateClass,
  deleteClass,
  leaveClass,
} from '../controllers/class.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from './../middleware/checkClassRole';
import { checkClassMember } from '../middleware/checkClassMember';

const router = Router();

router.post('/', authenticate, createClass);
router.get('/', authenticate, getUserClasses);
router.put(
  '/:classId',
  authenticate,
  checkClassRole(['instructor']),
  updateClass,
);
router.delete(
  '/:classId',
  authenticate,
  checkClassRole(['instructor']),
  deleteClass,
);
router.delete('/:classId/leave', authenticate, checkClassMember, leaveClass);

export default router;
