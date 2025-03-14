import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    changeUserPassword,
    getUserProfile,
    getUserProfileByUserId,
    clearWatchHistory,
} from '../controllers/user.controller.js';
import {
    userSignInValidator,
    userSignUpValidator,
    userPasswordValidator,
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

router.get('/', protectedRoute, getUserProfile);
router.get('/:id', getUserProfileByUserId);

export default router;
