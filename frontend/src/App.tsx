import {
    createBrowserRouter,
    RouteObject,
    RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { ProtectedRouteProvider } from './components/ProtectedRouteProvider';
import Post from './pages/Post';
import VideoPage from './pages/Video';
import WatchHistory from './pages/WatchHistory';
import Studio from './pages/Studio';
import { LRUCacheProvider } from './context/LRUCacheProvider';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <Home />,
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRouteProvider>
                        <Profile />
                    </ProtectedRouteProvider>
                ),
            },
            {
                path: 'post',
                element: (
                    <ProtectedRouteProvider>
                        <Post />
                    </ProtectedRouteProvider>
                ),
            },
            {
                path: 'video/:id',
                element: <VideoPage />,
            },
            {
                path: 'watch-history',
                element: (
                    <ProtectedRouteProvider>
                        <WatchHistory />
                    </ProtectedRouteProvider>
                ),
            },
            {
                path: 'studio',
                element: (
                    <ProtectedRouteProvider>
                        <Studio />
                    </ProtectedRouteProvider>
                ),
            },
        ],
    },
    {
        path: '/sign-in',
        element: <Signin />,
    },
    {
        path: '/sign-up',
        element: <Signup />,
    },
];

const router = createBrowserRouter(routes);

const App = () => {
    return (
        <>
            <LRUCacheProvider>
                <RouterProvider router={router} />
            </LRUCacheProvider>
        </>
    );
};

export default App;
