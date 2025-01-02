import { Router } from 'express';
import {
  getSubunitDetails,
  createSubunit,
  updateSubunit,
  deleteSubunit,
} from '../controllers/subunit.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';
import { checkClassMember } from '../middleware/checkClassMember';
import { checkUnitExists } from '../middleware/checkUnitExists';

const router = Router({ mergeParams: true });

router.get('/:id', authenticate, checkClassMember, getSubunitDetails);
router.post(
  '/',
  authenticate,
  checkClassRole(['instructor']),
  checkUnitExists,
  createSubunit,
);
router.put(
  '/:id',
  authenticate,
  checkClassRole(['instructor']),
  checkUnitExists,
  updateSubunit,
);
router.delete(
  '/:id',
  authenticate,
  checkClassRole(['instructor']),
  checkUnitExists,
  deleteSubunit,
);

export default router;
