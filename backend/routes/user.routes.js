import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    changeUserPassword,
    getUserProfile,
    getUserProfileByUserId,
    clearWatchHistory,
    editUserProfile,
    getSubscriptions,
    getWatchHistory,
    getUserVideos,
} from '../controllers/user.controller.js';
import {
    userSignInValidator,
    userSignUpValidator,
    userPasswordValidator,
    editProfileValidator,
} from '../validators/user.validator.js';
import { protectedRoute } from '../middlewares/user.middleware.js';
import { handleValidationErrors } from '../middlewares/commonMiddlewares.js';

const router = Router();

router.post(
    '/signup',
    userSignUpValidator,
    handleValidationErrors,
    registerUser
);
router.post('/signin', userSignInValidator, handleValidationErrors, loginUser);
router.post('/signout', logoutUser);

router.patch('/clear-watch-history', protectedRoute, clearWatchHistory);
router.patch(
    '/change-password',
    protectedRoute,
    userPasswordValidator,
    handleValidationErrors,
    changeUserPassword
);
router.patch(
    '/edit-profile',
    protectedRoute,
    editProfileValidator,
    handleValidationErrors,
    editUserProfile
);

router.get('/', protectedRoute, getUserProfile);
router.get('/watch-history', protectedRoute, getWatchHistory);
router.get('/videos', protectedRoute, getUserVideos);
router.get('/subs', protectedRoute, getSubscriptions);
router.get('/:id', getUserProfileByUserId);

export default router;
