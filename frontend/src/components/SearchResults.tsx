import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface Props {
    className?: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
    sResults: SearchResult[];
}

interface SearchResult {
    _id: string;
    title: string;
}

const SearchResults = ({ className, containerRef, sResults }: Props) => {
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        if (sResults) {
            const uniqueTitles = new Set<string>();
            const uniqueResults = sResults.filter((result) => {
                if (!uniqueTitles.has(result.title)) {
                    uniqueTitles.add(result.title);
                    return true;
                }
                return false;
            });

            setResults(uniqueResults);
        }
    }, [sResults]);

    return (
        <div
            ref={containerRef}
            className={twMerge(
                'w-32 shadow-xl border rounded-box border-base-200 bg-base-100/95 h-fit cursor-pointer',
                className
            )}
        >
            <ul className="list rounded-box border-none overflow-hidden min-h-24">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                    suggestions
                </li>

                {results && results.length
                    ? results.map((r, idx) => {
                          return (
                              <Link
                                  key={`search-result-${idx}`}
                                  to={`/search?key=${r.title}`}
                              >
                                  <li className="list-row items-center overflow-hidden">
                                      <button className="btn btn-square btn-ghost">
                                          <svg
                                              className="h-6 w-6"
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24"
                                              fill="currentColor"
                                          >
                                              <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                                          </svg>
                                      </button>

                                      <div className="w-full line-clamp-1 overflow-hidden text-wrap">
                                          {r.title}
                                      </div>
                                  </li>
                              </Link>
                          );
                      })
                    : null}
            </ul>
        </div>
    );
};

export default SearchResults;
