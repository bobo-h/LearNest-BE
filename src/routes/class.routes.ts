import { Router } from 'express';
import { createClass, getUserClasses } from '../controllers/class.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/', authenticate, createClass);
router.get('/', authenticate, getUserClasses);

export default router;
