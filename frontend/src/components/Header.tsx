import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useEffect, useRef, useState } from 'react';
import SearchResults from './SearchResults';
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

const Header = ({
    setShowSideBar,
}: {
    setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { username, fullName } = useUser();

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
        <div className="flex">
            {showOverlay && (
                <div className="overlay w-dvw h-dvh fixed top-0 left-0 bg-transparent z-0"></div>
            )}
            <div className="navbar bg-base-100 shadow-sm md:px-2">
                <div className="navbar-start w-fit lg:w-full mr-2">
                    <div
                        role="button"
                        className="btn btn-ghost btn-circle"
                        onClick={() => setShowSideBar((p) => !p)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {' '}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h7"
                            />{' '}
                        </svg>
                    </div>
                </div>
                <div className="navbar-center">
                    <Link
                        to={'/'}
                        className="text-xl md:text-2xl font-semibold lg:mr-8"
                    >
                        Vid-Express
                    </Link>
                </div>
                <div className="navbar-end w-full ml-2">
                    <label className="input hidden md:flex relative">
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
                                    ? navigate(
                                          `/search?key=${e.currentTarget.value}`
                                      )
                                    : null;
                            }}
                            onBlur={() => setShowOverlay(false)}
                            id="search-box"
                        />
                        {showSearchResults && (
                            <SearchResults
                                containerRef={suggestionContainerRef}
                                className="absolute w-[70dvw] mt-2 right-0 top-full z-50"
                                sResults={searchResults}
                            />
                        )}
                    </label>
                    <Link to={'/search-suggestion'}>
                        <button className="btn btn-ghost btn-circle md:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {' '}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />{' '}
                            </svg>
                        </button>
                    </Link>

                    <Link to={'/post'}>
                        <button className="btn btn-ghost btn-circle ml-2">
                            <svg
                                className="w-6 h-6 text-neutral-content"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round" // Use camelCase for SVG properties
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
                    </Link>

                    <div className="buttons md:flex gap-4 justify-end ml-4 hidden">
                        {!username ? (
                            <>
                                <Link to={'/sign-in'}>
                                    <button className="btn btn-outline">
                                        Signin
                                    </button>
                                </Link>
                                <Link to={'/sign-up'}>
                                    <button className="btn btn-primary">
                                        Signup
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to={'/profile'}>
                                    <div className="avatar avatar-placeholder">
                                        <div className="bg-primary text-neutral-content w-8 rounded-full">
                                            <span className="text-xl">
                                                {fullName.toString()[0]}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
