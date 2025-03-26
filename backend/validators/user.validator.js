import { body, query } from 'express-validator';

export const userSignUpValidator = [
    body('email', 'Email does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'The minimum password length is 6 characters').isLength({
        min: 6,
    }),
    body('fullName', 'Fullname is required').not().isEmpty(),
];

export const userSignInValidator = [
    body('email', 'Email does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'Email or password is wrong').isLength({
        min: 6,
    }),
];

export const userPasswordValidator = [
    body('oldPassword', 'Old password is wrong').isLength({
        min: 6,
    }),
    body('password', 'The minimum password length is 6 characters').isLength({
        min: 6,
    }),
];

export const editProfileValidator = [
    query('fullName').optional().equals('true'),
    body('fullName')
        .if(query('fullName').equals('true'))
        .notEmpty()
        .withMessage('Full Name is required'),
    query('username').optional().equals('true'),
    body('username')
        .if(query('username').equals('true'))
        .notEmpty()
        .withMessage('Username is required'),
    query('bio').optional().equals('true'),
    body('bio')
        .if(query('bio').equals('true'))
        .notEmpty()
        .withMessage('bio is required'),
];
