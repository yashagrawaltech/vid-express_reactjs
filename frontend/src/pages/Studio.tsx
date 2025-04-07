import useFetch from '../hooks/useFetch';
import { Video, VideoResponse } from '../utils/types';
import VideoCard, { NoVideoCard } from '../components/VideoCard';
import { useCallback, useEffect, useState } from 'react';
import { ErrorComponent } from '../components/Error';
import { useLRUCacheContext } from '../context/LRUCacheContext';

const Studio = () => {
    const [videoArr, setVideoArr] = useState<Video[] | []>([]);

    const { data: cachedData } = useLRUCacheContext<VideoResponse>();
    // console.log(cachedData);

    const {
        data: videoData,
        error,
        loading,
    } = useFetch<VideoResponse>(
        !cachedData || !cachedData.get('studioVideoCache')
            ? `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/videos`
            : null
    );

    const setVideos = useCallback(() => {
        if (cachedData) {
            const studioVideoCache = cachedData.get('studioVideoCache');
            if (studioVideoCache) {
                // console.log('cachedData: ', studioVideoCache);
                const videos = studioVideoCache.data.videos ?? [];
                setVideoArr(videos);
            }
        }
    }, [cachedData]);

    useEffect(() => {
        if (videoData) {
            // console.log('apiData: ', videoData);
            if (cachedData) {
                cachedData.put('studioVideoCache', videoData);
                setVideos();
            }
        }
    }, [videoData, cachedData, setVideos]);

    useEffect(() => {
        if (cachedData) {
            setVideos();
        }
    }, [cachedData, setVideos]);

    return (
        <div className="flex flex-col p-4 gap-4">
            <h1 className="text-2xl md:text-6xl col-span-9 font-bold mb-4">
                My Studio
            </h1>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
                {loading ? (
                    <span className="loading loading-dots loading-md"></span>
                ) : videoArr && videoArr.length ? (
                    videoArr.map((v) => {
                        return (
                            <VideoCard
                                key={v._id}
                                videoDetails={v}
                                className="w-full"
                                edit={true}
                            />
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center w-full h-full col-span-3">
                        <NoVideoCard />
                    </div>
                )}

                {!loading && error ? (
                    <div className="flex w-full h-full items-center justify-center">
                        <ErrorComponent error={error} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Studio;
