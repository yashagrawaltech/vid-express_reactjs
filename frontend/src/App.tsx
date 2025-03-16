import {
    createBrowserRouter,
    RouteObject,
    RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            // { path: '', element: <Home /> }
        ],
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
