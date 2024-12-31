import { Router } from 'express';
import {
  createUnit,
  updateUnit,
  deleteUnit,
} from '../controllers/unit.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';

const router = Router({ mergeParams: true });

router.post('/', authenticate, checkClassRole(['instructor']), createUnit);
router.put('/:id', authenticate, checkClassRole(['instructor']), updateUnit);
router.delete('/:id', authenticate, checkClassRole(['instructor']), deleteUnit);

export default router;
