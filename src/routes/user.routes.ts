import { Router } from 'express';
import { getUserProfile } from '../controllers/user.controller';

const router = Router();

router.get('/:id', getUserProfile);

export default router;
