import { Router } from 'express';
import { getSubunitDetails } from '../controllers/subunit.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassMember } from '../middleware/checkClassMember';

const router = Router({ mergeParams: true });

router.get('/:id', authenticate, checkClassMember, getSubunitDetails);

export default router;
