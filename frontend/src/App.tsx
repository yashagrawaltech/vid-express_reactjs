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

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '', element: <Home /> },
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
            <RouterProvider router={router} />
        </>
    );
};

export default App;
