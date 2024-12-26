import { Router } from 'express';
import { createClass, getUserClasses } from '../controllers/class.controller';
import { authenticate } from '../middleware/authenticate';
import { upload } from '../middleware/multer';

const router = Router();

router.post('/', authenticate, upload.single('main_image'), createClass);
router.get('/', authenticate, getUserClasses);

export default router;
