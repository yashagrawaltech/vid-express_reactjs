import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
    uploadVideo,
    getVideo,
    deleteVideo,
    getVideos,
    searchVideosByQuery,
} from '../controllers/video.controller.js';
import {
    protectedRoute,
    unProtectedRoute,
} from '../middlewares/user.middleware.js';
import { videoPostValidator } from '../validators/video.validator.js';
import { handleValidationErrors } from '../middlewares/commonMiddlewares.js';

const router = Router();
const uploads = upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]);

router.post(
    '/upload',
    protectedRoute,
    uploads,
    videoPostValidator,
    handleValidationErrors,
    uploadVideo
);

router.get('/', getVideos);
router.get('/search', searchVideosByQuery);
router.get('/:id', unProtectedRoute, getVideo);

router.delete('/:id', protectedRoute, deleteVideo);

export default router;
