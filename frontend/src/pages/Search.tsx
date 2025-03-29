import { useEffect, useState } from 'react';
import VideoCard, { NoVideoCard } from '../components/VideoCard';
import useFetch from '../hooks/useFetch';
import { Video, VideoResponse } from '../utils/types';
import { ErrorComponent } from '../components/Error';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
    const [videoArr, setVideoArr] = useState<Video[]>([]);
    const [searchParams] = useSearchParams();
    const key = searchParams.get('key');

    const {
        data: videoData,
        error,
        loading,
    } = useFetch<VideoResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/video/search-videos/${key}`
    );

    useEffect(() => {
        if (videoData && videoData.data) {
            setVideoArr(videoData.data.videos);
        }
    }, [videoData]);

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

export default Search;
