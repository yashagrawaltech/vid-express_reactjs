import { statusCodes } from '../constants.js';
import { asyncHandler } from '../handlers/asyncHandler.js';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
    saveUser,
    checkIsUserValidForLogin,
} from '../services/user.service.js';
import { User } from '../models/user.model.js';

export const registerUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ApiError(
                statusCodes.CONFLICT,
                `${errors.array()[0].msg}`,
                errors.array()
            )
        );
    }

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ApiError(
                statusCodes.CONFLICT,
                `${errors.array()[0].msg}`,
                errors.array()
            )
        );
    }

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ApiError(
                statusCodes.CONFLICT,
                `${errors.array()[0].msg}`,
                errors.array()
            )
        );
    }

    const { username: usernameQuery, fullName: fullNamequery } = req.query;

    if (!usernameQuery && !fullNamequery) {
        return next(
            new ApiError(
                statusCodes.CONFLICT,
                `query parameters are required for profile update`
            )
        );
    }

    const user = await User.findById(req.user._id);

    if (usernameQuery) {
        const { username } = req.body;
        user.username = username;
        await user.save();
    }

    if (fullNamequery) {
        const { fullName } = req.body;
        user.fullName = fullName;
        await user.save();
    }

    return res.json(
        new ApiResponse(statusCodes.OK, 'profile updated successfuly', {
            user,
        })
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ApiError(
                statusCodes.CONFLICT,
                `${errors.array()[0].msg}`,
                errors.array()
            )
        );
    }

    const { oldPassword, password } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isValidPassword = await user.isPasswordCorrect(oldPassword);

    if (!isValidPassword)
        throw new ApiError(
            statusCodes.UNAUTHORIZED,
            'Old password is incorect'
        );

    user.password = password;
    await user.save();

    return res
        .status(statusCodes.OK)
        .json(new ApiResponse(statusCodes.OK, 'password changed successfully'));
});

export const clearWatchHistory = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    user.watchHistory = [];
    await user.save();

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
    const user = req.user;
    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            user,
        })
    );
});

export const getUserProfileByUserId = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user)
        return next(new ApiError(statusCodes.BAD_REQUEST, 'user not found'));

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            user,
        })
    );
});
