import { FC } from 'react';
import { cn } from '../utils/cn';

const Error: FC<{
    error: string;
    type?: 'normal' | 'soft-style';
    className?: string;
}> = ({ error, type = 'normal', className }) => {
    if (type === 'normal') {
        return <p className="text-red-400">{error}</p>;
    }

    if (type === 'soft-style') {
        return (
            <div
                role="alert"
                className={cn('alert alert-error alert-soft', className)}
            >
                <span>{error}</span>
            </div>
        );
    }
};

export const ErrorComponent: FC<{
    error: string;
}> = ({ error }) => {
    return (
        <div>
            <div className="flex flex-col items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mb-4"
                    viewBox="0 0 64 64"
                >
                    <circle cx="32" cy="32" r="30" fill="#FF6F61" />{' '}
                    {/* Face Color */}
                    <circle cx="20" cy="24" r="4" fill="#000" />{' '}
                    {/* Left Eye */}
                    <circle cx="44" cy="24" r="4" fill="#000" />{' '}
                    {/* Right Eye */}
                    <path
                        d="M20 40c4 -4 12 -4 16 0"
                        stroke="#000"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                    />{' '}
                    {/* Frustrated Mouth */}
                </svg>
                <h2 className="text-xl font-semibold text-white text-center">
                    Something Went Wrong
                </h2>
                <p className="text-gray-300 mt-2 text-center">
                    {error
                        ? error
                        : 'We encountered an error while trying to process your request. Please try again later.'}
                </p>
                <button
                    className="btn btn-primary mt-4"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        </div>
    );
};

export default Error;
