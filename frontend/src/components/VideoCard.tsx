import { useEffect, useState } from 'react';
import { cn } from '../utils/cn';
import { timeAgo } from '../utils/time-ago';
import { Video } from '../utils/types';
import imageCompression from 'browser-image-compression';
import { Link } from 'react-router-dom';

interface Props {
    className?: string;
    videoDetails: Video;
    edit?: boolean;
}

// Custom hook for image loading and compression
const useCompressedImage = (thumbnail: string) => {
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadImage = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(thumbnail);
                const blob = await response.blob();
                const file = new File([blob], 'thumbnail.jpg', {
                    type: blob.type,
                });

                const compressedBlob = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 800,
                    useWebWorker: true,
                });

                const compressedUrl = URL.createObjectURL(compressedBlob);
                setCompressedImage(compressedUrl);
            } catch (error) {
                console.error('Error compressing image:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [thumbnail]);

    return { compressedImage, isLoading };
};

const VideoCard = ({ className, videoDetails, edit = false }: Props) => {
    const defaultClass =
        'card bg-base-100 w-96 shadow-sm border border-base-100';
    const timeAgoValue = timeAgo(videoDetails.createdAt);
    const { compressedImage, isLoading } = useCompressedImage(
        videoDetails.thumbnail
    );

    return (
        <>
            <Link to={`/video/${videoDetails._id}`}>
                <div className={cn(defaultClass, className)}>
                    <figure className="aspect-video">
                        <div
                            className="h-full w-full object-center object-cover"
                            style={{
                                backgroundImage: compressedImage
                                    ? `url(${compressedImage})`
                                    : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {isLoading ? (
                                <div className="skeleton h-full w-full rounded-none"></div>
                            ) : null}
                        </div>
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{videoDetails.title}</h2>
                        <p>{videoDetails.owner.username}</p>
                        <p className="-mt-2 opacity-70">
                            {videoDetails.views} | {timeAgoValue}
                        </p>
                        {edit ? (
                            <div className="card-actions justify-end">
                                <button className="btn btn-outline hover:btn-primary">
                                    Edit
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </Link>
        </>
    );
};

export const VideoCardSide = ({ className, videoDetails }: Props) => {
    const defaultClass =
        'flex justify-start items-start gap-4 rounded-sm overflow-hidden border border-base-200';
    const { compressedImage, isLoading } = useCompressedImage(
        videoDetails.thumbnail
    );

    return (
        <>
            <Link
                className="w-full overflow-hidden"
                to={`/video/${videoDetails._id}`}
            >
                <div className={cn(defaultClass, className)}>
                    <figure className="aspect-video w-40 h-fit shrink-0">
                        <div
                            className="h-full w-full object-center object-cover"
                            style={{
                                backgroundImage: compressedImage
                                    ? `url(${compressedImage})`
                                    : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {isLoading ? (
                                <div className="skeleton h-full w-full rounded-none"></div>
                            ) : null}
                        </div>
                    </figure>
                    <div className="py-1 w-full overflow-hidden">
                        <h2 className="text-base w-full line-clamp-2">
                            {videoDetails.title}
                        </h2>
                        <p className="text-sm w-full line-clamp-1">
                            {videoDetails.owner.username}
                        </p>
                    </div>
                </div>
            </Link>
        </>
    );
};

export const NoVideoCard = () => {
    return (
        <div>
            <div className="flex flex-col items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mb-4"
                    viewBox="0 0 64 64"
                >
                    <circle cx="32" cy="32" r="30" fill="#FFCC4D" />{' '}
                    {/* Face Color */}
                    <circle cx="20" cy="24" r="4" fill="#000" />{' '}
                    {/* Left Eye */}
                    <circle cx="44" cy="24" r="4" fill="#000" />{' '}
                    {/* Right Eye */}
                    <path
                        d="M20 40c4 4 12 4 16 0"
                        stroke="#000"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                    />{' '}
                    {/* Sad Mouth */}
                </svg>
                <h2 className="text-xl font-semibold text-white">
                    No Video Available
                </h2>
                <p className="text-gray-300 mt-2">
                    It seems there are no videos available at the moment. Please
                    check back later.
                </p>
                <button
                    className="btn btn-primary mt-4"
                    onClick={() => window.location.reload()}
                >
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default VideoCard;
