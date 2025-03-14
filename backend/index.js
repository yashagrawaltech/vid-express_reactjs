import { config } from 'dotenv';
config();
import express from 'express';
import { connectToMongoDB } from './config/db.config.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from './handlers/errorHandler.js';
import debug from 'debug';

// Routers
import healthcheckRoutes from './routes/healthcheck.routes.js';
import userRoutes from './routes/user.routes.js';
import videoRoutes from './routes/video.routes.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

// Debugger
// console.log(process.env.NODE_ENV, process.env.DEBUG)
export const devlog =
    process.env.NODE_ENV === 'development'
        ? debug('development:app')
        : () => {};

// DB Config
connectToMongoDB(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

// Common Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);

// Routes
app.use('/api/healthcheck', healthcheckRoutes);
app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    devlog(`Server is listening on port: ${PORT}`);
});
