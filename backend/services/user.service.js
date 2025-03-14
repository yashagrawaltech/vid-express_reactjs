import { statusCodes } from '../constants.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const saveUser = async ({ email, password, fullName }) => {
    if (!email || !password || !fullName)
        throw new Error(
            'required field are not there for saving the user in the database'
        );

    const isUserAlreadyRegistered = await User.findOne({ email });
    if (isUserAlreadyRegistered)
        throw new ApiError(
            statusCodes.CONFLICT,
            'user is already registered with the provided email'
        );

    const user = await User.insertOne({ email, password, fullName });
    if (!user)
        throw new ApiError(
            statusCodes.INTERNAL_SERVER_ERROR,
            'error saving the user in the database'
        );

    const savedUser = await User.findById(user._id);
    if (!savedUser)
        throw new ApiError(
            statusCodes.INTERNAL_SERVER_ERROR,
            'error saving the user in the database'
        );

    const token = savedUser.generateAuthToken();
    if (!token)
        throw new ApiError(
            statusCodes.INTERNAL_SERVER_ERROR,
            'error generating auth token'
        );

    return { user: savedUser, token };
};

export const checkIsUserValidForLogin = async ({ email, password }) => {
    if (!email || !password)
        throw new Error(
            'required field are not there for validating the user for login'
        );

    const user = await User.findOne({ email }).select('+password');
    if (!user)
        throw new ApiError(
            statusCodes.BAD_REQUEST,
            'email or password is incorect'
        );

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect)
        throw new ApiError(
            statusCodes.BAD_REQUEST,
            'email or password is incorect'
        );

    const token = user.generateAuthToken();
    if (!token)
        throw new ApiError(
            statusCodes.INTERNAL_SERVER_ERROR,
            'error generating auth token'
        );

    user.password = undefined;

    return { user, token };
};
