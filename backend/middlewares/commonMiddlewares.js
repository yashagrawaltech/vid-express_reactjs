import { validationResult } from 'express-validator';
import { asyncHandler } from '../handlers/asyncHandler.js';
import { statusCodes } from '../constants.js';
import { ApiError } from '../utils/ApiError.js';

export const handleValidationErrors = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new ApiError(
                statusCodes.CONFLICT,
                `${errors.array()[0].msg}`,
                errors.array()
            )
        );
    } else {
        next();
    }
});
