import { devlog } from '../index.js';

export const asyncHandler = (reqHandler) => {
    return async (req, res, next) => {
        devlog(req.method, req?.url);
        try {
            await reqHandler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
