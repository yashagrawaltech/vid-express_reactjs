import mongoose from 'mongoose';
import { devlog } from '../api/index.js';

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5000 ms

class DBConnection {
    constructor(URI) {
        this.connectionString = URI;
        this.retryCount = 0;
        this.isConnected = false;

        mongoose.set('strictQuery', true);

        mongoose.connection.on('connected', () => {
            devlog(
                `MongoDB connected successfully at host ${mongoose.connection.host}`
            );
            this.isConnected = true;
        });

        mongoose.connection.on('error', (error) => {
            devlog(`MongoDB connection error occurred: ${error.message}`);
            this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            devlog(
                `MongoDB disconnected successfully at host ${mongoose.connection.host}`
            );
            this.handleDisconnection();
        });

        process.on('SIGTERM', this.handleTermination.bind(this));
    }

    async connect() {
        if (!this.connectionString)
            throw new Error(`MongoDB connection string is missing`);

        try {
            const connectionOptions = {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 5000,
                family: 4, // IPv4
            };

            if (process.env.NODE_ENV === 'development') {
                mongoose.set('debug', true);
            }

            await mongoose.connect(this.connectionString, connectionOptions);
            this.retryCount = 0;
        } catch (error) {
            devlog(`MongoDB Connection Error: ${error.message}`);
            await this.handleError(error);
        }
    }

    async handleError(lastError) {
        if (this.retryCount < MAX_RETRIES) {
            this.retryCount += 1;
            devlog(
                `Retrying MongoDB connection attempt ${this.retryCount} of ${MAX_RETRIES} due to error: ${lastError.message}`
            );
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, RETRY_INTERVAL);
            });
            return this.connect();
        } else {
            throw new Error(
                `Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${lastError.message}`
            );
        }
    }

    async handleDisconnection() {
        if (this.isConnected) {
            devlog(`Attempting to reconnect to MongoDB`);
            return this.connect();
        }
    }

    async handleTermination() {
        try {
            await mongoose.connection.close();
            devlog(`MongoDB connection closed`);
            process.exit(0);
        } catch (error) {
            devlog(`Error closing MongoDB connection: ${error.message}`);
            process.exit(1); // Exit with error code
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name,
        };
    }
}

const connection = new DBConnection(
    `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
);

export const connectToMongoDB = connection.connect.bind(connection);
export const getDbStatus = connection.getConnectionStatus.bind(connection);
