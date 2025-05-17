import { statusCodes } from '../constants.js';
import { asyncHandler } from '../handlers/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
    saveUser,
    checkIsUserValidForLogin,
} from '../services/user.service.js';
import { User } from '../models/user.model.js';
import { Subscription } from '../models/subscription.model.js';
import mongoose from 'mongoose';

export const registerUser = asyncHandler(async (req, res, next) => {
    const { email, fullName, password } = req.body;

    const { user, token } = await saveUser({ email, fullName, password });

    return res
        .status(statusCodes.CREATED)
        .cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : null,
            maxAge: 3600000,
        })
        .json(
            new ApiResponse(
                statusCodes.CREATED,
                'user registered successfully',
                {
                    user,
                    token,
                }
            )
        );
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const { user, token } = await checkIsUserValidForLogin({ email, password });
    return res
        .status(statusCodes.OK)
        .cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : null,
            maxAge: 3600000,
        })
        .json(
            new ApiResponse(statusCodes.OK, 'user loggedin successfully', {
                user,
                token,
            })
        );
});

export const editUserProfile = asyncHandler(async (req, res, next) => {
    if (Object.keys(req?.query).length < 1) {
        return res.json(
            new ApiResponse(statusCodes.OK, 'profile updated successfuly', {
                user: req.user,
            })
        );
    }

    const {
        username: usernameQuery,
        fullName: fullNameQuery,
        bio: bioQuery,
    } = req.query;

    if (usernameQuery) {
        const { username } = req.body;
        req.user.username = username;
    }

    if (fullNameQuery) {
        const { fullName } = req.body;
        req.user.fullName = fullName;
    }

    if (bioQuery) {
        const { bio } = req.body;
        req.user.bio = bio;
    }

    await req.user.save();

    return res.json(
        new ApiResponse(statusCodes.OK, 'profile updated successfuly')
    );
});

export const logoutUser = asyncHandler(async (req, res, next) => {
    return res
        .clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : null,
        })
        .status(statusCodes.OK)
        .json(new ApiResponse(statusCodes.OK, 'user loggedout successfully'));
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isValidPassword = await user.isPasswordCorrect(oldPassword);

    if (!isValidPassword)
        throw new ApiError(
            statusCodes.UNAUTHORIZED,
            'old password is incorect'
        );

    user.password = newPassword;
    await user.save();

    return res
        .status(statusCodes.OK)
        .json(new ApiResponse(statusCodes.OK, 'password changed successfully'));
});

export const clearWatchHistory = asyncHandler(async (req, res, next) => {
    req.user.watchHistory = [];
    await req.user.save();

    return res
        .status(statusCodes.OK)
        .json(
            new ApiResponse(
                statusCodes.OK,
                'watch history cleared successfully'
            )
        );
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            user: req.user,
        })
    );
});

export const getSubscriptions = asyncHandler(async (req, res, next) => {
    const subs = await Subscription.find({
        subscriber: req.user._id,
    }).populate('channel');

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            subs,
        })
    );
});

export const getWatchHistory = asyncHandler(async (req, res, next) => {
    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            watchHistory: req.user.watchHistory,
        })
    );
});

export const getUserVideos = asyncHandler(async (req, res, next) => {
    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            videos: req.user.videos,
        })
    );
});

export const getUserProfileByUserId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(new ApiError(statusCodes.BAD_REQUEST, 'user not found'));
    }

    const user = await User.findById(id);
    if (!user)
        return next(new ApiError(statusCodes.BAD_REQUEST, 'user not found'));

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            user,
        })
    );
});
