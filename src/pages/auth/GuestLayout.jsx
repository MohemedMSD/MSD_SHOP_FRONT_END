import React, { useEffect } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useStateContext } from '../../context/StateContext';

export default function GuestLayout() {
	const { user } = useStateContext();
	const {token} = useParams();
	
    // if user is logged in, redirect to landing page
	if (user) {
		
		if (
			user.verified_at || 
			window.location.pathname !== '/auth/send-verification-code' && token && window.location.pathname !== `/auth/email-verification/${token}`
		) {
			return <Navigate to="/" />;
		}
			
	}

	return (
		<>
			<Outlet />
		</>
	);
}