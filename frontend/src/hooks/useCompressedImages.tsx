import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';

// Custom hook for image loading and compression
export const useCompressedImage = (thumbnail: string) => {
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadImage = async () => {
            if (!thumbnail) {
                setCompressedImage(null);
                setIsLoading(false);
                return;
            } else {
                const controller = new AbortController();
                const signal = controller.signal;

                try {
                    setIsLoading(true);
                    setError(null);

                    const response = await fetch(thumbnail, { signal });
                    if (!response.ok) {
                        throw new Error('Failed to fetch image');
                    }

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
                    if (error instanceof Error && error.name !== 'AbortError') {
                        console.error('Error compressing image:', error);
                        setError('Error compressing image');
                    }
                } finally {
                    setIsLoading(false);
                }

                return () => {
                    controller.abort();
                    if (compressedImage) {
                        URL.revokeObjectURL(compressedImage);
                    }
                };
            }
        };

        loadImage();
    }, [thumbnail]);

    return { compressedImage, isLoading, error };
};

export const useCompressedImages = (thumbnails: string[]) => {
    const [compressedImages, setCompressedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const compressImages = async () => {
            setIsLoading(true);
            setError(null);
            const newCompressedImages: string[] = [];

            try {
                for (const thumbnail of thumbnails) {
                    const response = await fetch(thumbnail);
                    if (!response.ok) {
                        throw new Error('Failed to fetch image');
                    }
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
                    newCompressedImages.push(compressedUrl);
                }
            } catch (error) {
                console.error('Error compressing images:', error);
                setError('Error compressing images');
            } finally {
                setIsLoading(false);
                setCompressedImages(newCompressedImages);
            }
        };

        if (thumbnails.length > 0) {
            compressImages();
        }
    }, [thumbnails]);

    return { compressedImages, isLoading, error };
};
