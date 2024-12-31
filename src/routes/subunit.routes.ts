import { Router } from 'express';
import {
  createSubunit,
  updateSubunit,
  deleteSubunit,
} from '../controllers/subunit.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';
import { checkUnitExists } from '../middleware/checkUnitExists';

const router = Router({ mergeParams: true });

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
