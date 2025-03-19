import {
    createBrowserRouter,
    RouteObject,
    RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Signin from './pages/Signin';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [{ path: '', element: <Home /> }],
    },
    {
        path: '/sign-in',
        element: <Signin />,
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
