import { body } from 'express-validator';

export const videoPostValidator = [
    body('title', 'Title does not Empty').not().isEmpty(),
    body('description', 'Description does not Empty').not().isEmpty(),
    body('video').custom((value, { req }) => {
        if (!req.files['video']) {
            throw new Error('No video uploaded');
        }
        return true;
    }),
    body('thumbnail').custom((value, { req }) => {
        if (!req.files['thumbnail']) {
            throw new Error('No thumbnail uploaded');
        }
        return true;
    }),
];
