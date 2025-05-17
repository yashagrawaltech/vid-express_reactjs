import { FC, ReactNode } from 'react';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRouteProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { _id, loading } = useUser();

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    return _id ? children : <Navigate to={'/sign-in'} replace />;
};
