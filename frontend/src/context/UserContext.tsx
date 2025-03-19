import { createContext, useContext } from 'react';
import { User } from '../utils/types';

export const UserContext = createContext<User>({
    _id: '',
    fullName: '',
    createdAt: new Date(),
    username: '',
    email: '',
    loading: true,
    error: '',
});

export const useUser = () => {
    const context = useContext(UserContext);
    return context;
};
