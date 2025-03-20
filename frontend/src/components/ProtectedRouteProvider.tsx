import { FC, ReactNode, useLayoutEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export const ProtectedRouteProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { _id, loading } = useUser();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (!loading && !_id) {
            navigate('/sign-in');
        }
    }, [_id, navigate, loading]);

    return <>{children}</>;
};
