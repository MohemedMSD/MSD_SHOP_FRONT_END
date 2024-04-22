import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from '../../context/StateContext';

export default function GuestLayout() {
	const { user } = useStateContext();
    
	useEffect(()=>{
		
		// if user is logged in, redirect to landing page
		if (user) {
			return <Navigate to="/" />;
		}

	}, [])

	return (
		<>
			<Outlet />
		</>
	);
}