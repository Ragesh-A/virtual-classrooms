import { Suspense, lazy } from 'react';
import Shimmer from '../components/common/Shimmer';

const  AdminLayout = lazy(()=> import ('../components/layouts/AdminLayout'));
const Dashboard = lazy(()=> import('../pages/admin/Dashboard'));
const UserManagement = lazy(()=> import('../components/Admin/UserManagement'));
const ClassManagement = lazy(()=> import('../pages/admin/ClassManagement'));

const adminRoute = {
  path: '/admin',
  element: <Suspense fallback={<Shimmer />}><AdminLayout /></Suspense>,
  children: [
    { path: '', element: <Dashboard /> },
    { path: 'users', element: <UserManagement /> },
    { path: 'classes', element: <ClassManagement /> },
  ],
};

export default adminRoute;
