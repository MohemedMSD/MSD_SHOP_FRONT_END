import React from 'react'
import { FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import {Notification, Profile} from '../';

function Header() {

  return (
    <header className='flex p-3 items-center gap-5 justify-end bg-gray-100'>
      

        <Profile/>

        <Notification/>

    </header>
  )
}

export default Header