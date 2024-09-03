import React, { useEffect, lazy } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { AiOutlineShopping } from "react-icons/ai";
import { useStateContext } from '../../context/StateContext';
import {Notification, Profile, SearchBar, Card} from './../../components';

const NavBar = () => {

  const { totalQuantity, showCart, setshowCart, getCardItems, user } = useStateContext();
  const {query} = useParams()

  return (
    // <div className='fixed top-0 left-0 w-full bg-gray-100'>
    
      <div className="relative flex my-[6px] py-2  justify-between w-full lg:max-w-[1024px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto">
        <Link className='flex items-center' href="/">
          <p className="text-gray-500 cursor-pointer text-[20px] sm:text-[25px]"><span className='text-second font-bold'>MSD</span> Shop</p>
        </Link>
        
        <div className='hidden sm:flex w-[40%] border-b border-primary_text'>
          <SearchBar query={query || ''}/>
        </div>

        <div className='flex gap-4 items-center'>
          {
            user ? 
            <>
              <Profile/>
              <Notification/>
              <button
                type="button"
                className="text-[35px] text-primary_text cursor-pointer relative transition-transform duration-[.4s] border-none bg-transparent"
                onClick={() => setshowCart(true)}
              >
                <AiOutlineShopping />
                {totalQuantity > 0 && (
                  <span className="absolute top-0 w-[18px] h-[18px] rounded-[50%] text-center -right-1 text-[12px] text-slate-100 bg-second ">{totalQuantity}</span>
                )}
              </button>
            </>
            :
            <>
              <NavLink to='/auth/login'>Login</NavLink>
              <NavLink to='/auth/register'>Register</NavLink>
            </>
          }
        </div>

        <div className={`${showCart ? 'block' : 'hidden'} w-[100vw] bg-[#00000080] fixed right-0 h-screen top-0 z-40`} ></div>
        
        <Card/>
      </div>

    // </div>
  )
}

export default NavBar