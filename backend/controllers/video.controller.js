import { statusCodes } from '../constants.js';
import { asyncHandler } from '../handlers/asyncHandler.js';
import { User } from '../models/user.model.js';
import { Video } from '../models/video.model.js';
import { ApiError } from '../utils/ApiError.js';
import cloudinary, { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

export const uploadVideo = asyncHandler(async (req, res, next) => {
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

    const videoObj = await Video.insertOne({
        title,
        description,
        thumbnail: thumbnailResponse.secure_url,
        url: videoResponse.secure_url,
        owner: req.user._id,
        video_public_id: videoResponse.public_id,
        thumbnail_public_id: thumbnailResponse.public_id,
    });

    req.user.videos.push(videoObj._id);
    await req.user.save();

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, 'video uploaded successfully', {
            video: videoObj,
        })
    );
});

export const getVideos = asyncHandler(async (req, res, next) => {
    const { key } = req.query;

    const videos = key
        ? await Video.find({
              title: {
                  $regex: `^${decodeURIComponent(key).replace(/"/g, '')}`,
                  $options: 'i',
              }, // 'i' for case-insensitive search
          })
        : await Video.find().populate('owner');

    if (!videos)
        return next(
            new ApiError(statusCodes.BAD_REQUEST, 'no videos are available')
        );

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, 'videos fetched successfully', {
            videos,
        })
    );
});

export const getVideo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(new ApiError(statusCodes.BAD_REQUEST, 'video not found'));
    }

    const video = await Video.findById(id).populate('owner');
    if (!video)
        return next(new ApiError(statusCodes.BAD_REQUEST, 'video not found'));

    video.views = video.views + 1;
    await video.save();

    if (req.user && req.user._id) {
        const idIndex = req.user.watchHistory.indexOf(video._id);

        if (idIndex !== -1) {
            // ID exists, remove it
            req.user.watchHistory.splice(idIndex, 1);
        }

        req.user.watchHistory.push(video._id);
        await req.user.save();
    }

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, 'video fetched successfully', {
            video,
        })
    );
});

export const searchVideosByQuery = asyncHandler(async (req, res, next) => {
    const { key } = req.query;

    if (!key) {
        return res.status(statusCodes.OK).json(
            new ApiResponse(
                statusCodes.OK,
                'search results fetched successfully',
                {
                    results: [],
                }
            )
        );
    }

    const results = await Video.find({
        title: {
            $regex: `^${decodeURIComponent(key).replace(/"/g, '')}`,
            $options: 'i',
        }, // 'i' for case-insensitive search
    }).select('title _id');

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, 'search results fetched successfully', {
            results,
        })
    );
});

export const deleteVideo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return next(new ApiError(statusCodes.BAD_REQUEST, 'video not found'));
    }

    const video = await Video.findById(id);
    if (!video)
        return next(new ApiError(statusCodes.BAD_REQUEST, 'video not found'));

    if (video.owner.toString() !== req.user._id.toString()) {
        return next(
            new ApiError(statusCodes.BAD_REQUEST, 'unauthorized action')
        );
    }

    await video.deleteOne();

    await User.findByIdAndUpdate(req.user._id, {
        $pull: { videos: video._id },
    });

    await cloudinary.uploader.destroy(video.video_public_id);
    await cloudinary.uploader.destroy(video.thumbnail_public_id);

    return res
        .status(statusCodes.OK)
        .json(new ApiResponse(statusCodes.OK, 'video deleted successfully'));
});

export const getSignature = asyncHandler(async (req, res, next) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = req.body.folder || 'uploads';

    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET
    );

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, 'video saved successfully', {
            data: {
                timestamp,
                signature,
                folder,
                apiKey: process.env.CLOUDINARY_API_KEY,
                cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            },
        })
    );
});

export const saveVideo = asyncHandler(async (req, res, next) => {
    const {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        videoPublicId,
        thumbnailPublicId,
    } = req.body;

    const videoObj = await Video.insertOne({
        title,
        description,
        thumbnail: thumbnailUrl,
        url: videoUrl,
        owner: req.user._id,
        video_public_id: videoPublicId,
        thumbnail_public_id: thumbnailPublicId,
    });

    req.user.videos.push(videoObj._id);
    await req.user.save();

    return res.status(statusCodes.OK).json(
        new ApiResponse(statusCodes.OK, 'video saved successfully', {
            video: videoObj,
        })
    );
});
