import useFetch from '../hooks/useFetch';
import { Video, VideoResponse } from '../utils/types';
import VideoCard, { NoVideoCard } from '../components/VideoCard';
import { useLayoutEffect, useState } from 'react';

const Studio = () => {
    const [videoArr, setVideoArr] = useState<Video[] | []>([]);

    const {
        data: videoData,
        error,
        loading,
    } = useFetch<VideoResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/videos`
    );

    useLayoutEffect(() => {
        if (videoData) {
            setVideoArr(videoData.data.videos);
        }
    }, [videoData]);

    return (
        <div className="flex flex-col p-4 gap-4">
            <h1 className="text-2xl md:text-6xl col-span-9 font-bold mb-4">
                My Studio
            </h1>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
                {loading ? (
                    <>
                        {[...Array(30)].map((_, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className="flex w-full flex-col gap-4 mb-12"
                                >
                                    <div className="skeleton h-32 w-full"></div>
                                    <div className="skeleton h-4 w-28"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                    <div className="skeleton h-4 w-full"></div>
                                </div>
                            );
                        })}
                    </>
                ) : videoArr && videoArr.length ? (
                    videoArr.map((v) => {
                        return (
                            <VideoCard
                                key={v._id}
                                videoDetails={{ ...v }}
                                className="w-full"
                            />
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center w-full h-full col-span-3">
                        <NoVideoCard />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Studio;
