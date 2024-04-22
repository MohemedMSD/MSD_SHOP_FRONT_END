import { createBrowserRouter, Navigate } from "react-router-dom";

import './App.css'
import {
	ProductsManagement,
	CategoriesManagement,
	OrdersManagement,
	TrashedProducts,
	Search,
	GuestLayout,
	Auth,
	Dashboard,
	LandingPage,
	Login,
	Register,
	HomeDashboard
} from "./pages";

import { SuccessCom, CancelCom, ProductDetails } from "./components";

const router = createBrowserRouter([
	{
		path: '/auth',
		element: <GuestLayout />,
		children: [
			{
				path: '/auth/login',
				element: <Login />,
			},
			{
				path: '/auth/register',
				element: <Register />,
			},
		],
	},
	{
		path: '/',
		element: <Auth />,
		children: [
			{
				path: '/success/:CHECKOUT_SESSION_ID',
				element: <SuccessCom />,
			},
			{
				path: '/cancel/:CHECKOUT_SESSION_ID',
				element: <CancelCom />,
			},
			{
				path: '/',
				element: <LandingPage />,
			},
			{
				path: '/products/:id',
				element: <ProductDetails />,
			},
			{
				path: '/products/search/:query',
				element: <Search />,
			},
		],
	},
    {
        path: '/dashboard',
		element: <Dashboard />,
        children : [
			{
				path : '/dashboard',
				element : <HomeDashboard />	
			},
			{
				path : '/dashboard/products',
				element : <ProductsManagement />
			},
			{
				path : '/dashboard/categories',
				element : <CategoriesManagement />
			},
			{
				path : '/dashboard/orders',
				element : <OrdersManagement />
			},
			{
				path : '/dashboard/trashed-products',
				element : <TrashedProducts />
			},
        ]
    },
    {
        path : '*',
        element : <Navigate to='/'/>
    }
]);

export default router;