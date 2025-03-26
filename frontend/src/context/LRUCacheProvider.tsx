import { ReactNode } from 'react';
import { LRUCacheContext } from './LRUCacheContext';
import { useLRUCache } from '../hooks/useLRUCache';

interface LRUCacheProviderProps {
    children: ReactNode;
}

export const LRUCacheProvider = <T,>({ children }: LRUCacheProviderProps) => {
    const cache = useLRUCache<string, T>(3);

    return (
        <LRUCacheContext.Provider value={{ data: cache }}>
            {children}
        </LRUCacheContext.Provider>
    );
};
