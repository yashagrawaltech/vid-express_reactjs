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

export default Error;
