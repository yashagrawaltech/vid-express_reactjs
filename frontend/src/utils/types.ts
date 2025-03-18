export interface Video {
    createdAt: Date;
    owner: {
        username: string;
    };
    thumbnail: string;
    _id: string;
    views: number;
    title: string;
}

export interface VideoResponse {
    statusCode: number;
    success: boolean;
    data: {
        videos: Video[];
    };
    message: string;
}
