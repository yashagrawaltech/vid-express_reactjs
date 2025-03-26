import { createContext, useContext } from 'react';
import { LRUCache } from '../hooks/useLRUCache';

interface Cache<T> {
    data: LRUCache<string, T> | null;
}

export const LRUCacheContext = createContext<Cache<unknown>>({
    data: null,
});

export const useLRUCacheContext = <T,>() => {
    const context = useContext(LRUCacheContext);
    if (!context) {
        throw new Error('useLRUCache must be used within a LRUCacheProvider');
    }
    return context as Cache<T>;
};
