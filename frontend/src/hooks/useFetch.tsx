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

const useFetch = <T = unknown,>(url: string): FetchState<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get<T>(url);
                setData(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const axiosError = err as AxiosError<ErrorResponse>;
                    setError(
                        axiosError.response?.data?.message || axiosError.message
                    );
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetch;
