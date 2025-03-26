import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface ErrorResponse {
    message?: string;
}

const useFetch = <T,>(url: string | null): FetchState<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (url) {
                setLoading(true);
                setError(null);

                try {
                    const response = await axios.get<T>(url, {
                        withCredentials: true,
                    });
                    setData(response.data);
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        const axiosError = err as AxiosError<ErrorResponse>;
                        setError(
                            axiosError.response?.data?.message ||
                                axiosError.message
                        );
                    } else {
                        setError('An unknown error occurred');
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setError(null);
                setData(null);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;
