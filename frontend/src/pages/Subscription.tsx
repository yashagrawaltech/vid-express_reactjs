import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { Subs, SubsResponse } from '../utils/types';
import Error from '../components/Error';
import axios from 'axios';

const Subscription = () => {
    const [isSubscribed, setIsSubscribed] = useState<
        | {
              id: string;
              status: boolean;
          }[]
        | null
    >(null);

    const [subsArray, setSubsArray] = useState<Subs[]>([]);

    const {
        data: subsData,
        error: subsError,
        loading: subsLoading,
    } = useFetch<SubsResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user/subs`
    );

    useEffect(() => {
        if (subsData && subsData.data && subsData.data.subs) {
            setSubsArray(subsData.data.subs);
        }
    }, [subsData]);

    useEffect(() => {
        const subsData = subsArray.map((s) => ({
            id: s.channel._id,
            status: true,
        }));
        setIsSubscribed(subsData);
    }, [subsArray]);

    const updateSubscriptionStatus = (id: string, status: boolean) => {
        setIsSubscribed((prev) => {
            if (!prev) {
                const newState = [{ id, status }];
                return newState;
            }

            const existing = prev.find((sub) => {
                return sub.id === id;
            });

            if (existing) {
                const updatedState = prev.map((sub) =>
                    sub.id === id ? { ...sub, status } : sub
                );

                return updatedState;
            }

            const newEntry = { id, status };
            const newState = [...prev, newEntry];

            return newState;
        });
    };

    const unSubscribe = async (subs: Subs) => {
        // Optimistically update the UI

        updateSubscriptionStatus(subs.channel._id, false);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/subs/unsubscribe/${subs.channel._id}`,
                { withCredentials: true }
            );
            if (response && response.status !== 200) {
                // If the response is not 200, revert the optimistic update
                updateSubscriptionStatus(subs.channel._id, true);
            }
        } catch (error) {
            console.log(error);
            // Revert the optimistic update on error
            updateSubscriptionStatus(subs.channel._id, true);
        }
    };

    const subscribe = async (subs: Subs) => {
        // Optimistically update the UI
        updateSubscriptionStatus(subs.channel._id, true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/api/subs/${subs.channel._id}`,
                {}, // Send an empty object or any required data in the body
                { withCredentials: true } // Pass the config object here
            );

            // Check for successful response status
            if (response.status !== 200 && response.status !== 201) {
                // If the response is not 200 or 201, revert the optimistic update
                updateSubscriptionStatus(subs.channel._id, false);
            }
        } catch (error) {
            console.error('Subscription error:', error); // Log the error with context
            // Revert the optimistic update on error
            updateSubscriptionStatus(subs.channel._id, false);
        }
    };

    const objectMap = isSubscribed
        ? new Map(isSubscribed.map((obj) => [obj.id, obj]))
        : new Map();

    if (subsError) {
        return (
            <div className="p-4 flex items-center justify-center w-full h-full">
                <div className="w-full h-full object-contain aspect-video flex items-center justify-center">
                    <Error
                        error={subsError ? subsError : 'Something went wrong'}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl md:text-6xl col-span-9 font-bold mb-4">
                Subscriptions
            </h1>
            {subsLoading ? (
                <span className="loading loading-dots loading-sm"></span>
            ) : (
                <ul className="list bg-base-100 rounded-box shadow-md">
                    <li className="p-4 pb-6 text-xs opacity-60 tracking-wide">
                        All Subscriptions
                    </li>
                    {subsArray.map((s) => {
                        const subscription = objectMap.get(s.channel._id);
                        return (
                            <li key={s._id} className="list-row items-center">
                                <div
                                    className={`avatar avatar-placeholder w-full flex justify-center`}
                                >
                                    <div className="bg-primary text-neutral-content w-12 h-12 rounded-full border-2 shadow-md">
                                        {s.channel.avatar ? (
                                            <img
                                                loading="lazy"
                                                className="size-10 rounded-box"
                                                src={s.channel.avatar}
                                                alt={s.channel.fullName}
                                            />
                                        ) : (
                                            <span className="text-3xl">
                                                {
                                                    s.channel.fullName.toString()[0]
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div>{s.channel.fullName}</div>
                                    <div className="text-xs lowercase font-semibold opacity-60">
                                        {s.channel.username}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (subscription) {
                                            return subscription.status
                                                ? unSubscribe(s)
                                                : subscribe(s);
                                        }
                                    }}
                                    className={`btn ${subscription ? (subscription.status ? 'btn-soft' : 'btn-primary') : 'btn-primary'}`}
                                >
                                    {subscription
                                        ? subscription.status
                                            ? 'Unsubscribe'
                                            : 'Subscribe'
                                        : 'Subscribe'}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Subscription;
