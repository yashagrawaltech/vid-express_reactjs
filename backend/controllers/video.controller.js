import { validationResult } from 'express-validator';
import { statusCodes } from '../constants.js';
import { asyncHandler } from '../handlers/asyncHandler.js';
import { User } from '../models/user.model.js';
import { Video } from '../models/video.model.js';
import { ApiError } from '../utils/ApiError.js';
import cloudinary, { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const uploadVideo = asyncHandler(async (req, res, next) => {
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

    const { title, description } = req.body;
    const { video, thumbnail } = req.files;

    const videoResponse = await uploadOnCloudinary(video[0]);
    if (!videoResponse || videoResponse === null) {
        return next(
            new ApiError(
                statusCodes.INTERNAL_SERVER_ERROR,
                'error uploading video'
            )
        );
    }

    const thumbnailResponse = await uploadOnCloudinary(thumbnail[0]);
    if (!thumbnailResponse || thumbnailResponse === null) {
        return next(
            new ApiError(
                statusCodes.INTERNAL_SERVER_ERROR,
                'error uploading thumbnail'
            )
        );
    }

    const user = await User.findById(req.user._id);

    const videoObj = await Video.insertOne({
        title,
        description,
        thumbnail: thumbnailResponse.secure_url,
        url: videoResponse.secure_url,
        owner: user._id,
        video_public_id: videoResponse.public_id,
        thumbnail_public_id: thumbnailResponse.public_id,
    });

    user.videos.push(videoObj._id);
    await user.save();

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            videoObj,
        })
    );
});

export const getAllVideo = asyncHandler(async (req, res, next) => {
    const videos = await Video.find({}).populate('owner');
    if (!videos)
        return next(
            new ApiError(statusCodes.BAD_REQUEST, 'no videos are available')
        );

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            videos,
        })
    );
});

export const getWatchHistory = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({
        path: 'watchHistory',
        populate: {
            path: 'owner',
        },
    });
    const watchHistory = user.watchHistory;

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            watchHistory,
        })
    );
});

export const getUserVideos = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({
        path: 'videos',
        populate: {
            path: 'owner',
        },
    });
    const videos = user.videos;

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            videos,
        })
    );
});

export const getVideo = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const video = await Video.findById(id);
    if (!video)
        return next(
            new ApiError(statusCodes.BAD_REQUEST, 'video is not available')
        );

    if (req.user && req.user._id) {
        const user = await User.findById(req.user._id);

        const idIndex = user.watchHistory.indexOf(video._id);

        if (idIndex !== -1) {
            // ID exists, remove it
            user.watchHistory.splice(idIndex, 1);
        }

        user.watchHistory.push(video._id);
        await user.save();
    }

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, '', {
            video,
        })
    );
});

export const deleteVideo = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const video = await Video.findByIdAndDelete(id);
    if (!video)
        return next(
            new ApiError(statusCodes.BAD_REQUEST, 'video is not available')
        );

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { videos: video._id },
    });

    await cloudinary.v2.uploader.destroy(video.video_public_id);
    await cloudinary.v2.uploader.destroy(video.thumbnail_public_id);

    return res
        .status(statusCodes.OK)
        .json(new ApiResponse(statusCodes.OK, 'video deleted successfully'));
});
