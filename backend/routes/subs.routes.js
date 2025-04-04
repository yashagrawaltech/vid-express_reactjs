import { Router } from 'express';
import { protectedRoute } from '../middlewares/user.middleware.js';
import {
    addSubscription,
    deleteSubscription,
} from '../controllers/subs.controller.js';

const router = Router();

router.delete('/:id', protectedRoute, deleteSubscription);
router.post('/:id/subscribe', protectedRoute, addSubscription);

export default router;
