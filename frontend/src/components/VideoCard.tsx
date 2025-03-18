import { cn } from '../utils/cn';
import { timeAgo } from '../utils/time-ago';
import { Video } from '../utils/types';

interface Props {
    className?: string;
    videoDetails: Video;
}

const VideoCard = ({ className, videoDetails }: Props) => {
    const defaultClass = 'card bg-base-100 w-96 shadow-sm';
    const timeAgoValue = timeAgo(videoDetails.createdAt);
    return (
        <>
            <div className={cn(defaultClass, className)}>
                <figure className="aspect-video">
                    <img src={videoDetails.thumbnail} alt="Shoes" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title">{videoDetails.title}</h2>
                    <p>{videoDetails.owner.username}</p>
                    <p className="-mt-2 opacity-70">
                        {videoDetails.views} | {timeAgoValue}
                    </p>
                </div>
            </div>
        </>
    );
};

export default VideoCard;
