import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            index: true,
        },
        username: {
            type: String,
            unique: true,
            lowercase: true,
            default: () => uuidv4(),
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            match: emailRegex,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            select: false,
        },
        avatar: {
            type: String,
        },
        coverImage: {
            type: String,
        },
        bio: {
            type: String,
        },
        videos: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Video',
            default: [],
        },
        watchHistory: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Video',
            default: [],
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const encryptedPass = await bcrypt.hash(this.password, 10);
    this.password = encryptedPass;
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
};

userSchema.methods.verifyAuthToken = function (token) {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken.userId === this._id.toString();
    } catch (error) {
        return false;
    }
};

export const User = mongoose.model('User', userSchema);
