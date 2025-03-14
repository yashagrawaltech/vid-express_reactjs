import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import { ApiError } from './ApiError.js';
import { statusCodes } from '../constants.js';
import { Readable } from 'stream';
config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (file) => {
    try {
        if (!file) return null;

        const stream = new Readable();
        stream.push(file.buffer);
        stream.push(null);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        return reject(
                            new ApiError(
                                statusCodes.INTERNAL_SERVER_ERROR,
                                'upload failed',
                                error
                            )
                        );
                    }
                    resolve(result);
                }
            );

            stream.pipe(uploadStream);
        });
    } catch (error) {
        throw new ApiError(
            statusCodes.INTERNAL_SERVER_ERROR,
            'upload failed',
            error
        );
    }
};

export default cloudinary;
