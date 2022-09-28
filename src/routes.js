import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

// layouts
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'
//
import StoreLogin from './pages/StoreLogin'
import StoreRegistration from './pages/StoreRegistration'
import StoreOnboard from './pages/StoreOnboard'
import Login from './pages/Login'
import Onboard from './pages/Onboard'
import StoreReports from './pages/StoreReports'
import StoreDashboard from './pages/StoreDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import Products from './pages/Products'
import Blog from './pages/Blog'
import User from './pages/User'
import UserArchive from './pages/UserArchive'
import TimeAdjustment from './pages/TimeAdjustment'
import Admin from './pages/Admin'
import Store from './pages/Store'
import StoreDetails from './pages/StoreDetails'
import NotFound from './pages/Page404'
import StoreMissing from './pages/StoreMissing'
import StoreQR from 'pages/StoreQR'
import StoreProfile from 'pages/StoreProfile'
import StoreBranches from 'pages/StoreBranches'

import EmployeeRegistration from './pages/EmployeeRegistration.js'

// ----------------------------------------------------------------------
const AppRoute = () => {
  return useRoutes([
    { // signed in as employee
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: '/app', element: <EmployeeDashboard /> },
        { path: '/employee/app', element: <EmployeeDashboard /> },
      ],
    },
    { // signed in as store
      path: 'stores',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/stores/app" replace /> },
        { path: 'app', element: <StoreDashboard /> },
        { path: 'user', element: <User /> },
        { path: 'archive', element: <UserArchive /> },
        { path: 'adjustment', element: <TimeAdjustment /> },
        { path: 'admin', element: <Admin /> },
        { path: 'qr', element: <StoreQR /> },
        { path: 'reports', element: <StoreReports /> },
        { path: 'branches', element: <StoreBranches /> },
        { path: 'store', element: <Store /> },
        { path: 'store/view/:id', element: <StoreDetails /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'profile', element: <StoreProfile /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" replace /> },
        { path: '/login', element: <Login /> },
        { path: '/store', element: <StoreLogin /> },
        { path: '/store/create', element: <StoreRegistration /> },
        { path: '/store/onboard', element: <StoreOnboard /> },
        { path: '/:store/register', element: <EmployeeRegistration /> }, // employee
        { path: '/:store/onboard', element: <Onboard /> }, // employee
        { path: '404', element: <NotFound /> },
        { path: 'undefined', element: <StoreMissing /> },
      ],
    },
    {
      path: 'undefined',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/login', element: <Navigate to="/undefined" replace /> },
      ],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}
export default AppRoute