import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
        });
    }

    // Handle other types of errors
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' && err.stack,
    });
};
