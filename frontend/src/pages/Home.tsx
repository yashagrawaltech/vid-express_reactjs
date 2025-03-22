import { useEffect, useState } from 'react';
import VideoCard, { NoVideoCard } from '../components/VideoCard';
import useFetch from '../hooks/useFetch';
import { Video, VideoResponse } from '../utils/types';
import { ErrorComponent } from '../components/Error';

const Home = () => {
    const [videoArr, setVideoArr] = useState<Video[] | []>([]);

    const {
        data: videoData,
        error,
        loading,
    } = useFetch<VideoResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/video`
    );

    useEffect(() => {
        if (videoData && videoData.data && videoData.data.videos) {
            setVideoArr(videoData.data.videos);
        } else {
            setVideoArr([]);
        }
    }, [videoData]);

    if (error)
        return (
            <div className="flex w-full h-full items-center justify-center">
                <ErrorComponent error={error} />
            </div>
        );

    return (
        <div className="w-full min-h-full grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4 p-4">
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
                            videoDetails={v}
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
    );
};

export default Home;
