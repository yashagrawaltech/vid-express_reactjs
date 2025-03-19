import { FC, ReactNode, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { User, UserResponse } from '../utils/types';
import useFetch from '../hooks/useFetch';

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({
        _id: '',
        fullName: '',
        createdAt: new Date(),
        username: '',
        email: '',
        loading: true,
        error: '',
    });

    const {
        data: userData,
        error: fetchError,
        loading: fetchLoading,
    } = useFetch<UserResponse>(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/api/user`
    );

    useEffect(() => {
        if (userData) {
            const data = userData.data.user;
            setUser({ ...data });
        }
    }, [userData]);

    useEffect(() => {
        if (fetchError) {
            setUser((p) => ({ ...p, error: fetchError }));
        }
    }, [fetchError]);

    useEffect(() => {
        if (fetchLoading) {
            setUser((p) => ({ ...p, loading: fetchLoading }));
        }
    }, [fetchLoading]);

    return (
        <UserContext.Provider value={{ ...user }}>
            {children}
        </UserContext.Provider>
    );
};
