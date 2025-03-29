import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
    uploadVideo,
    getVideo,
    deleteVideo,
    getAllVideo,
    searchVideos,
} from '../controllers/video.controller.js';
import {
    protectedRoute,
    unProtectedRoute,
} from '../middlewares/user.middleware.js';
import { videoPostValidator } from '../validators/video.validator.js';

const router = Router();
const uploads = upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]);

router.post('/post', protectedRoute, uploads, videoPostValidator, uploadVideo);

router.get('/', getAllVideo);
router.get('/:id', unProtectedRoute, getVideo);
router.get('/search/:key', searchVideos);

router.delete('/:id', protectedRoute, deleteVideo);

export default router;
