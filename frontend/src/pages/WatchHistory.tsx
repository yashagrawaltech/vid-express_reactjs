import useFetch from '../hooks/useFetch';
import { Video, WatchHistoryResponse } from '../utils/types';
import { NoVideoCard, VideoCardSide } from '../components/VideoCard';
import { useEffect, useState } from 'react';
import { ErrorComponent } from '../components/Error';

const WatchHistory = () => {
    const [videoArr, setVideoArr] = useState<Video[] | []>([]);

    const {
        data: videoData,
        error,
        loading,
    } = useFetch<WatchHistoryResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/watch-history`
    );

    useEffect(() => {
        if (videoData && videoData.data && videoData.data.watchHistory) {
            setVideoArr(videoData.data.watchHistory);
        } else {
            setVideoArr([]);
        }
    }, [videoData]);

    return (
        <div className="grid grid-cols-9 p-4 gap-4">
            <h1 className="text-2xl md:text-6xl col-span-9 font-bold mb-4">
                Watch History
            </h1>
            <div className="history flex flex-col gap-2 col-span-9 lg:col-span-6 w-full">
                {loading ? (
                    <span className="loading loading-dots loading-md"></span>
                ) : videoArr && videoArr.length ? (
                    videoArr.map((v) => {
                        return <VideoCardSide key={v._id} videoDetails={v} />;
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
            <div className="options hidden lg:col-span-3 lg:flex flex-col gap-4">
                <button className="btn btn-outline hover:btn-primary">
                    Clear all watch history
                </button>
            </div>
        </div>
    );
};

export default WatchHistory;
