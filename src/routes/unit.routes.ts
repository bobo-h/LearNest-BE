import { Router } from 'express';
import {
  getUnitDetails,
  getUnitsWithSubunits,
  fetchUnitsWithSubunits,
} from '../controllers/unit.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';
import { checkClassMember } from '../middleware/checkClassMember';

const router = Router({ mergeParams: true });

router.get('/:id', authenticate, checkClassMember, getUnitDetails);
router.get('/', authenticate, checkClassMember, getUnitsWithSubunits);
router.post(
  '/',
  authenticate,
  checkClassRole(['instructor']),
  fetchUnitsWithSubunits,
);

export default router;
