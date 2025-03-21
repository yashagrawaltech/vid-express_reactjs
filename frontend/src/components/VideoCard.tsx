import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import { timeAgo } from '../utils/time-ago';
import { Video } from '../utils/types';
import imageCompression from 'browser-image-compression';

interface Props {
    className?: string;
    videoDetails: Video;
}

const VideoCard = ({ className, videoDetails }: Props) => {
    const defaultClass = 'card bg-base-100 w-96 shadow-sm border border-base-100';
    const timeAgoValue = timeAgo(videoDetails.createdAt);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const imgRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadImage = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(videoDetails.thumbnail);
                const blob = await response.blob();

                // Create a File from the Blob
                const file = new File([blob], 'thumbnail.jpg', {
                    type: blob.type,
                });

                // Compress the image
                const compressedBlob = await imageCompression(file, {
                    maxSizeMB: 1, // Maximum size in MB
                    maxWidthOrHeight: 800, // Maximum width or height
                    useWebWorker: true, // Use web worker for better performance
                });

                // Create a URL for the compressed image
                const compressedUrl = URL.createObjectURL(compressedBlob);
                setCompressedImage(compressedUrl);
            } catch (error) {
                console.error('Error compressing image:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [videoDetails.thumbnail]);

    return (
        <>
            <div className={cn(defaultClass, className)}>
                <figure className="aspect-video">
                    <div
                        ref={imgRef}
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
                </div>
            </div>
        </>
    );
};

export default VideoCard;
