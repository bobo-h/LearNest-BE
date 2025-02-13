import { Router } from 'express';
import {
  getUnitDetails,
  getUnitsWithDetails,
  batchProcessUnits,
} from '../controllers/unit.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';
import { checkClassMember } from '../middleware/checkClassMember';

const router = Router({ mergeParams: true });

router.get('/:id', authenticate, checkClassMember, getUnitDetails);
router.get('/', authenticate, checkClassMember, getUnitsWithDetails);
router.post(
  '/',
  authenticate,
  checkClassRole(['instructor']),
  batchProcessUnits,
);

export default router;
