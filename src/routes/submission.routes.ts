import { Router } from 'express';
import {
  createSubmission,
  getSubmission,
  deleteSubmission,
  updateSubmission,
  provideFeedback,
} from '../controllers/submission.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from './../middleware/checkClassRole';
import { checkClassMember } from './../middleware/checkClassMember';

const router = Router({ mergeParams: true });

router.post('/', authenticate, checkClassMember, createSubmission);
router.get('/', authenticate, checkClassMember, getSubmission);
router.put('/:id', authenticate, checkClassMember, updateSubmission);
router.delete('/:id', authenticate, checkClassMember, deleteSubmission);
router.put(
  '/:id/feedback',
  authenticate,
  checkClassRole(['instructor']),
  provideFeedback,
);

export default router;
