import { Router } from 'express';
import {
  getUnitsWithSubunits,
  getUnitDetails,
  createUnit,
  updateUnit,
  deleteUnit,
} from '../controllers/unit.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';
import { checkClassMember } from '../middleware/checkClassMember';

const router = Router({ mergeParams: true });

router.get('/', authenticate, checkClassMember, getUnitsWithSubunits);
router.get('/:id', authenticate, checkClassMember, getUnitDetails);
router.post('/', authenticate, checkClassRole(['instructor']), createUnit);
router.put('/:id', authenticate, checkClassRole(['instructor']), updateUnit);
router.delete('/:id', authenticate, checkClassRole(['instructor']), deleteUnit);

export default router;
