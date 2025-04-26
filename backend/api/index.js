import { config } from 'dotenv';
config();
import express from 'express';
import { connectToMongoDB } from '../config/db.config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from '../handlers/errorHandler.js';
import debug from 'debug';

// Routers
import healthcheckRoutes from '../routes/healthcheck.routes.js';
import userRoutes from '../routes/user.routes.js';
import videoRoutes from '../routes/video.routes.js';
import subsRoutes from '../routes/subs.routes.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

// Debugger
export const devlog =
    process.env.NODE_ENV === 'development'
        ? debug('development:app')
        : () => {};

// DB Config
connectToMongoDB();

// Common Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'testing'
) {
    app.use(
        cors({
            origin: ['http://localhost:5173'],
            credentials: true,
        })
    );
} else {
    app.use(
        cors({
            origin: 'https://vid-express-reactjs.vercel.app',
            credentials: true,
        })
    );
}

// Routes
app.use('/api/healthcheck', healthcheckRoutes);
app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/subs', subsRoutes);

// Error Handler
app.use(errorHandler);

if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'testing'
) {
    app.listen(PORT, () => {
        devlog(`Server is listening on port: ${PORT}`);
    });
}

export default app;
