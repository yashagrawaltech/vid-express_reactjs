import { FC, ReactNode, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export const ProtectedRouteProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { _id, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !_id) {
            navigate('/sign-in');
            window.location.reload();
        }
    }, [_id, navigate, loading]);

    return (
        <>
            {children}
        </>
    );
};
