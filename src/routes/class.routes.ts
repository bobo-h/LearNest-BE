import { Router } from 'express';
import {
  createClass,
  getUserClasses,
  updateClass,
  deleteClass,
} from '../controllers/class.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from './../middleware/checkClassRole';

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

export default router;
