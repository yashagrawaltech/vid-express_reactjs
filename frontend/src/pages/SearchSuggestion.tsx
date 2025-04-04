import { useEffect, useRef, useState } from 'react';
import SearchResults from '../components/SearchResults';
import { ErrorResponse, useNavigate } from 'react-router-dom';

import axios, { AxiosError } from 'axios';

interface SearchResult {
    _id: string;
    title: string;
}

interface SearchResponse {
    statusCode: number;
    message: string;
    data: {
        results: SearchResult[];
    };
    success: boolean;
}

const SearchSuggestion = () => {
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const suggestionContainerRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        try {
            if (e.currentTarget.value) {
                const response = await axios.get<SearchResponse>(
                    `${import.meta.env.VITE_BACKEND_DOMAIN}/api/video/search/${e.currentTarget.value}`,
                    {
                        withCredentials: true,
                    }
                );

                if (response && response.data && response.data.data) {
                    setSearchResults(response.data.data.results);
                }
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>;
                throw new Error(axiosError.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    };

    useEffect(() => {
        if (showSearchResults) {
            setShowOverlay(true);
            window.onclick = (e) => {
                if (
                    e.target !== suggestionContainerRef.current &&
                    suggestionContainerRef.current &&
                    e.target !== document.getElementById('search-box')
                ) {
                    setShowSearchResults(false);
                    setShowOverlay(false);
                }
            };
        }
    }, [showSearchResults]);
    return (
        <div className="w-full p-4">
            {showOverlay && (
                <div className="overlay w-dvw h-dvh fixed top-0 left-0 bg-transparent z-0"></div>
            )}
            <label className="input w-full flex relative">
                <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                >
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input
                    type="search"
                    className="grow"
                    placeholder="Search"
                    onClick={() => setShowSearchResults(true)}
                    onChange={(e) => {
                        setShowSearchResults(true);
                        handleSearch(e);
                    }}
                    onKeyDown={(e) => {
                        setShowSearchResults(false);
                        return e.key === 'Enter'
                            ? navigate(`/search?key=${e.currentTarget.value}`)
                            : null;
                    }}
                    onBlur={() => setShowOverlay(false)}
                    id="search-box"
                />
                {showSearchResults && (
                    <SearchResults
                        containerRef={suggestionContainerRef}
                        className="absolute w-full mt-2 right-0 top-full z-50"
                        sResults={searchResults}
                    />
                )}
            </label>
        </div>
    );
};

export default SearchSuggestion;
