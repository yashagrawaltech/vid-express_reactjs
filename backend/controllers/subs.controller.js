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

    const channel = await User.findById(id);

    if (!channel)
        return next(new ApiError(statusCodes.CONFLICT, `invalid client id`));

    const isAlreadyExists = await Subscription.findOne({
        channel: channel._id,
    });

    if (isAlreadyExists) {
        return next(new ApiError(statusCodes.CONFLICT, `already a subscriber`));
    }

    const subs = await Subscription.create({
        subscriber: req.user._id,
        channel: channel._id,
    });

    if (!subs)
        return next(
            new ApiError(
                statusCodes.INTERNAL_SERVER_ERROR,
                `subscription request failed`
            )
        );

    return res.json(
        new ApiResponse(statusCodes.OK, 'subscription added successfully', {
            subs,
        })
    );
});

export const deleteSubscription = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const channel = await User.findById(id);

    if (!channel)
        return next(new ApiError(statusCodes.CONFLICT, `invalid client id`));

    const subs = await Subscription.deleteOne({
        subscriber: req.user._id,
        channel: channel._id,
    });

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
