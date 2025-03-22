import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { SignleVideoResponse, VideoResponse } from '../utils/types';
import Error, { ErrorComponent } from '../components/Error';
import { useState } from 'react';
import { NoVideoCard, VideoCardSide } from '../components/VideoCard';

const VideoPage = () => {
    const { id } = useParams();

    const [showDesc, setShowDesc] = useState(false);

    const { data, error, loading } = useFetch<SignleVideoResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/video/${id}`
    );

    const {
        data: suggestionData,
        error: suggestionError,
        loading: suggestionLoading,
    } = useFetch<VideoResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/video`
    );

    return (
        <div className="grid grid-cols-9 p-4 gap-4">
            <div className="video-container flex flex-col gap-2 col-span-9 lg:col-span-6 w-full">
                <div className="w-full  aspect-video border border-base-200 rounded-md overflow-hidden">
                    {loading ? (
                        <div className=" w-full h-full object-contain aspect-video flex items-center justify-center">
                            <div className="skeleton h-full w-full rounded-none"></div>
                        </div>
                    ) : data && data.data && data.data.video ? (
                        <video
                            className="w-full h-full object-cover aspect-video"
                            src={data.data.video.url}
                            controls
                            poster={data.data.video.thumbnail}
                        />
                    ) : (
                        <div className=" w-full h-full object-contain aspect-video flex items-center justify-center">
                            <Error
                                error={error ? error : 'Something went wrong'}
                            />
                        </div>
                    )}

                    {!loading && error ? (
                        <div className=" w-full h-full object-contain aspect-video flex items-center justify-center">
                            <Error error={error} />
                        </div>
                    ) : null}
                </div>
                <h2 className="text-2xl font-semibold">
                    {loading ? (
                        <span className="loading loading-dots loading-sm"></span>
                    ) : data && data.data && data.data.video.title ? (
                        data.data.video.title
                    ) : (
                        'title not available'
                    )}
                </h2>
                <div className="buttons flex items-center justify-between">
                    <div className="left flex items-center">
                        <button className="btn btn-ghost btn-circle">
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M14.5998 8.00033H21C22.1046 8.00033 23 8.89576 23 10.0003V12.1047C23 12.3659 22.9488 12.6246 22.8494 12.8662L19.755 20.3811C19.6007 20.7558 19.2355 21.0003 18.8303 21.0003H2C1.44772 21.0003 1 20.5526 1 20.0003V10.0003C1 9.44804 1.44772 9.00033 2 9.00033H5.48184C5.80677 9.00033 6.11143 8.84246 6.29881 8.57701L11.7522 0.851355C11.8947 0.649486 12.1633 0.581978 12.3843 0.692483L14.1984 1.59951C15.25 2.12534 15.7931 3.31292 15.5031 4.45235L14.5998 8.00033ZM7 10.5878V19.0003H18.1606L21 12.1047V10.0003H14.5998C13.2951 10.0003 12.3398 8.77128 12.6616 7.50691L13.5649 3.95894C13.6229 3.73105 13.5143 3.49353 13.3039 3.38837L12.6428 3.0578L7.93275 9.73038C7.68285 10.0844 7.36341 10.3746 7 10.5878ZM5 11.0003H3V19.0003H5V11.0003Z"></path>
                            </svg>
                        </button>
                        <button className="btn btn-ghost btn-circle">
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path>
                            </svg>
                        </button>
                        <button className="btn btn-ghost btn-circle">
                            <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M13.1202 17.0228L8.92129 14.7324C8.19135 15.5125 7.15261 16 6 16C3.79086 16 2 14.2091 2 12C2 9.79086 3.79086 8 6 8C7.15255 8 8.19125 8.48746 8.92118 9.26746L13.1202 6.97713C13.0417 6.66441 13 6.33707 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6C21 8.20914 19.2091 10 17 10C15.8474 10 14.8087 9.51251 14.0787 8.73246L9.87977 11.0228C9.9583 11.3355 10 11.6629 10 12C10 12.3371 9.95831 12.6644 9.87981 12.9771L14.0788 15.2675C14.8087 14.4875 15.8474 14 17 14C19.2091 14 21 15.7909 21 18C21 20.2091 19.2091 22 17 22C14.7909 22 13 20.2091 13 18C13 17.6629 13.0417 17.3355 13.1202 17.0228ZM6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14ZM17 8C18.1046 8 19 7.10457 19 6C19 4.89543 18.1046 4 17 4C15.8954 4 15 4.89543 15 6C15 7.10457 15.8954 8 17 8ZM17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="right">
                        <button className="btn btn-outline btn-primary text-neutral-content">
                            <svg
                                className="w-4 h-4 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add to playlists
                        </button>
                    </div>
                </div>
                <div
                    className={`desc ${showDesc ? '' : 'truncate'}`}
                    onClick={() => setShowDesc((p) => !p)}
                >
                    {loading ? (
                        <span className="loading loading-dots loading-sm"></span>
                    ) : data && data.data && data.data.video.title ? (
                        data.data.video.title
                    ) : (
                        'description not available'
                    )}
                </div>
            </div>

            <div className="suggestions col-span-9 lg:col-span-3 flex flex-col gap-4">
                {suggestionLoading ? (
                    <span className="loading loading-dots loading-sm"></span>
                ) : suggestionData &&
                  suggestionData.data &&
                  suggestionData.data.videos ? (
                    suggestionData.data.videos.map((v) => {
                        return <VideoCardSide key={v._id} videoDetails={v} />;
                    })
                ) : (
                    <div className="flex items-center justify-center w-full h-full col-span-3">
                        <NoVideoCard />
                    </div>
                )}

                {!suggestionLoading && suggestionError ? (
                    <div className="flex w-full h-full items-center justify-center">
                        <ErrorComponent error={suggestionError} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default VideoPage;
