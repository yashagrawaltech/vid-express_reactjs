export interface Video {
    createdAt: Date;
    owner: {
        username: string;
    };
    thumbnail: string;
    _id: string;
    views: number;
    url: string;
    title: string;
    description: string;
}

export interface VideoResponse {
    statusCode: number;
    success: boolean;
    data: {
        videos: Video[];
    };
    message: string;
}

export interface SignleVideoResponse {
    statusCode: number;
    success: boolean;
    data: {
        video: Video;
    };
    message: string;
}

export interface User {
    _id: string;
    fullName: string;
    createdAt: Date;
    username: string;
    email: string;
    loading: boolean;
    error: string;
}

export interface UserResponse {
    statusCode: number;
    success: boolean;
    data: {
        user: User;
    };
    message: string;
}
