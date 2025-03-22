import useFetch from '../hooks/useFetch';
import { WatchHistoryResponse } from '../utils/types';
import { NoVideoCard, VideoCardSide } from '../components/VideoCard';

const WatchHistory = () => {
    const { data, error, loading } = useFetch<WatchHistoryResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/watch-history`
    );

    return (
        <div className="grid grid-cols-9 p-4 gap-4">
            <h1 className="text-2xl md:text-6xl col-span-9 font-bold mb-4">
                Watch History
            </h1>
            <div className="history flex flex-col gap-2 col-span-9 lg:col-span-6 w-full">
                {loading ? (
                    <div className=" w-full h-full object-contain aspect-video flex items-center justify-center">
                        <div className="skeleton h-full w-full"></div>
                    </div>
                ) : null}
                {!error &&
                !loading &&
                data &&
                data.data &&
                data.data.watchHistory ? (
                    data.data.watchHistory.map((v) => {
                        return (
                            <VideoCardSide
                                key={v._id}
                                videoDetails={{ ...v }}
                            />
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center w-full h-full col-span-3">
                        <NoVideoCard />
                    </div>
                )}
            </div>
            <div className="options hidden lg:col-span-3 lg:flex flex-col gap-4">
                options
            </div>
        </div>
    );
};

export default WatchHistory;
