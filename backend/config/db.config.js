import mongoose from 'mongoose';
import { devlog } from '../index.js';

export const connectToMongoDB = async (URI) => {
    try {
        await mongoose.connect(URI);
        devlog(
            `MongoDB connected successfully at host ${mongoose.connection.host}`
        );
    } catch (error) {
        throw new Error(`MongoDb Connection Error: ${error}`);
    }
};
