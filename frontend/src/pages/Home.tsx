import { useCallback, useEffect, useState } from 'react';
import VideoCard, { NoVideoCard } from '../components/VideoCard';
import useFetch from '../hooks/useFetch';
import { Video, VideoResponse } from '../utils/types';
import { ErrorComponent } from '../components/Error';
import { useLRUCacheContext } from '../context/LRUCacheContext';

const Home = () => {
    const [videoArr, setVideoArr] = useState<Video[]>([]);
    const { data: cachedData } = useLRUCacheContext<VideoResponse>();

    const {
        data: videoData,
        error,
        loading,
    } = useFetch<VideoResponse>(
        !cachedData || !cachedData.get('homeVideoCache')
            ? `${import.meta.env.VITE_BACKEND_DOMAIN}/api/video`
            : null
    );

    const setVideos = useCallback(() => {
        if (cachedData) {
            const homeVideoCache = cachedData.get('homeVideoCache');
            if (homeVideoCache) {
                // console.log('cachedData: ', homeVideoCache);
                const videos = homeVideoCache.data.videos ?? [];
                setVideoArr(videos);
            }
        }
    }, [cachedData]);

    useEffect(() => {
        if (videoData) {
            // console.log('apiData: ', videoData);
            if (cachedData) {
                cachedData.put('homeVideoCache', videoData);
                setVideos();
            }
        }
    }, [videoData, cachedData, setVideos]);

    useEffect(() => {
        if (cachedData) {
            setVideos();
        }
    }, [cachedData, setVideos]);

    if (error) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <ErrorComponent error={error} />
            </div>
        );
    }

    return (
        <>
            {loading ? (
                <div className="w-full min-h-full grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4 p-4">
                    {[...Array(30)].map((_, idx) => (
                        <div
                            key={idx}
                            className="flex w-full flex-col gap-4 mb-12"
                        >
                            <div className="skeleton h-32 w-full"></div>
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                    ))}
                </div>
            ) : videoArr.length > 0 ? (
                <div className="w-full min-h-full grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4 p-4">
                    {videoArr.map((v) => (
                        <VideoCard
                            key={v._id}
                            videoDetails={v}
                            className="w-full"
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center w-full h-full col-span-3">
                    <NoVideoCard />
                </div>
            )}
        </>
    );
};

export default Home;
