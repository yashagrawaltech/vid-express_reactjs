import { FC } from 'react';

const Error: FC<{ error: string }> = ({ error }) => {
    return <p className="text-red-400">{error}</p>;
};

export default Error;
