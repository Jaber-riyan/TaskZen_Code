import { createBrowserRouter } from 'react-router-dom';
import ErrorForRoot from '../Error/ErrorForRoot';
import Login from '../Pages/Shared/AuthComponents/Login';
import Register from '../Pages/Shared/AuthComponents/Register';
import MainLayout from '../Layout/MainLayout/MainLayout';
import Home from '../Pages/Home/Home';
import PrivateRoutes from './PrivateRoutes/PrivateRoutes';
import AddTask from '../Pages/AddTask/AddTask';
import Activity from '../Pages/Activity/Activity';
import UpdateTask from '../Pages/UpdateTask/UpdateTask';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout></MainLayout>,
        errorElement: <ErrorForRoot></ErrorForRoot>,
        children: [
            {
                path: '/',
                element: <PrivateRoutes><Home></Home></PrivateRoutes>
            },
            {
                path: 'login',
                element: <Login></Login>
            },
            {
                path: 'register',
                element: <Register></Register>
            },
            {
                path: 'add-task',
                element: <PrivateRoutes><AddTask></AddTask></PrivateRoutes>
            },
            {
                path: 'activity',
                element: <PrivateRoutes><Activity></Activity></PrivateRoutes>
            },
            {
                path: 'task/:id',
                element: <UpdateTask></UpdateTask>
            }
        ]
    },
])

export default router;