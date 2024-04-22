import React from 'react'
import {Outlet} from 'react-router-dom'
import { NavBar } from '../../components'

const Auth = () => {

  return (
    <div className='p-3'>
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