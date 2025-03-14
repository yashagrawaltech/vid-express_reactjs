import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            index: true,
        },
        video_public_id: {
            type: String,
            required: true,
            index: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        thumbnail_public_id: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Video = mongoose.model('Video', videoSchema);
