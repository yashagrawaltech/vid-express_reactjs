import { Router } from 'express';
import { asyncHandler } from '../handlers/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { statusCodes } from '../constants.js';

const router = Router();

router.get(
    '/',
    asyncHandler(async (req, res) => {
        return res
            .status(statusCodes.OK)
            .json(new ApiResponse(statusCodes.OK, 'healthcheck ok'));
    })
);

export default router;
