import React from 'react'
import {Outlet} from 'react-router-dom'
import { NavBar } from '../../components'
import { useStateContext } from '../../context/StateContext';

const Auth = () => {
	const { user } = useStateContext();

  if (user && !user.verified_at) {
    window.location.href = "/auth/send-verification-code"
  }

  return (
    <div className='px-2 sm:px-4'>
      <header>
        <NavBar />
      </header>
      <main className='max-w-[1543px] m-auto w-full'>
        <Outlet />
      </main>
    </div>
  )
}

export default Auth