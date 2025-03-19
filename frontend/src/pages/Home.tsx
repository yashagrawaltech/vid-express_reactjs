import { useLayoutEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import useFetch from '../hooks/useFetch';
import { Video, VideoResponse } from '../utils/types';
import Error from '../components/Error';

const Home = () => {
    const [videoArr, setVideoArr] = useState<Video[] | []>([]);

    const {
        data: videoData,
        error,
        loading,
    } = useFetch<VideoResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/video`
    );

    useLayoutEffect(() => {
        if (videoData) {
            setVideoArr(videoData.data.videos);
        }
    }, [videoData]);

    if (error)
        return (
            <div className="flex w-full h-full items-center justify-center">
                <Error error={error} />
            </div>
        );

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4 p-4">
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
    );
};

const NoVideoCard = () => {
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

export default Home;
