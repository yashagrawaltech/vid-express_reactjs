import { statusCodes } from '../constants.js';
import { asyncHandler } from '../handlers/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

export const protectedRoute = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.authToken || req.headers['authToken']?.split(' ')[1];

    if (!token)
        return next(
            new ApiError(statusCodes.UNAUTHORIZED, 'unauthorized access')
        );

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    if (!userId)
        return next(
            new ApiError(statusCodes.UNAUTHORIZED, 'unauthorized access')
        );

    const user = await User.findById(userId);

    if (!user)
        return next(
            new ApiError(statusCodes.UNAUTHORIZED, 'unauthorized access')
        );

    req.user = user;

    next();
});
