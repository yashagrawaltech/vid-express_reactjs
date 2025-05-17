import mongoose from 'mongoose';
import { devlog } from '../api/index.js';
import { statusCodes } from '../constants.js';
import { asyncHandler } from '../handlers/asyncHandler.js';
import { Subscription } from '../models/subscription.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const addSubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    devlog(id);

    if (!mongoose.isValidObjectId(id)) {
        return next(new ApiError(statusCodes.BAD_REQUEST, 'channel not found'));
    }

    if (id === req.user._id.toString()) {
        return next(
            new ApiError(
                statusCodes.BAD_REQUEST,
                'user cannot subscribe own channel'
            )
        );
    }

    const channel = await User.findById(id);

    if (!channel) {
        return next(new ApiError(statusCodes.CONFLICT, `invalid client id`));
    }

    const subscription = await Subscription.findOneAndUpdate(
        {
            subscriber: req.user._id,
            channel: channel._id,
        },
        {
            subscriber: req.user._id,
            channel: channel._id,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!subscription) {
        return next(
            new ApiError(
                statusCodes.INTERNAL_SERVER_ERROR,
                `subscription request failed`
            )
        );
    }

    return res.json(
        new ApiResponse(statusCodes.OK, 'subscription added successfully', {
            subscription,
        })
    );
});

export const deleteSubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(
            new ApiError(statusCodes.BAD_REQUEST, 'subscription not found')
        );
    }

    const subs = await Subscription.findByIdAndDelete(id);

    if (!subs)
        return next(
            new ApiError(
                statusCodes.INTERNAL_SERVER_ERROR,
                `subscription remove request failed`
            )
        );

    return res.json(
        new ApiResponse(statusCodes.OK, 'subscription removed successfully')
    );
});
