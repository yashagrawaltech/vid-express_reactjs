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

const router = Router();

router.post('/signup', userSignUpValidator, registerUser);
router.post('/signin', userSignInValidator, loginUser);
router.post('/signout', logoutUser);
router.post(
    '/change-password',
    protectedRoute,
    userPasswordValidator,
    changeUserPassword
);
router.post('/clear-watch-history', protectedRoute, clearWatchHistory);
router.post(
    '/edit-profile',
    protectedRoute,
    editProfileValidator,
    editUserProfile
);

router.get('/', protectedRoute, getUserProfile);
router.get('/watch-history', protectedRoute, getWatchHistory);
router.get('/videos', protectedRoute, getUserVideos);
router.get('/subs', protectedRoute, getSubscriptions);
router.get('/:id', getUserProfileByUserId);

export default router;
