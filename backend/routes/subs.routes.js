import { Router } from 'express';
import { protectedRoute } from '../middlewares/user.middleware.js';
import {
    addSubscription,
    checkSubscription,
    deleteSubscription,
    deleteSubscriptionByChannelId,
} from '../controllers/subs.controller.js';

const router = Router();

router.get('/status/:id', protectedRoute, checkSubscription);
router.delete(
    '/unsubscribe/:id',
    protectedRoute,
    deleteSubscriptionByChannelId
);
router.delete('/:id', protectedRoute, deleteSubscription);
router.post('/:id', protectedRoute, addSubscription);

export default router;
