import { Router } from 'express';
import { createInvite } from '../controllers/invite.controller';
import { authenticate } from '../middleware/authenticate';
import { checkClassRole } from '../middleware/checkClassRole';
import { joinClass } from '../controllers/invite.controller';

const router = Router({ mergeParams: true });

router.post('/', authenticate, checkClassRole(['instructor']), createInvite);
router.post('/:token', authenticate, joinClass);

export default router;
