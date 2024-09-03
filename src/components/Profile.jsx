import React, { useState } from 'react'
import { BiLogOut, BiPurchaseTag, BiUser } from 'react-icons/bi';
import { MdDashboard } from 'react-icons/md';
import { FaShop } from 'react-icons/fa6';
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { Navigate, NavLink } from 'react-router-dom';
import Axios from '../assets/constants/axios/axios';
import { useStateContext } from '../context/StateContext';
import { ProfileM, MyOrders } from './';
import { useEffect } from 'react';

const Profile = () => {
    const {setUser, user} = useStateContext()
    const [ShowProfileMenu, setShowProfileMenu] = useState(false);
    const [ProfilModal, setProfilModal] = useState(false);
    const [OrdersModal, setOrdersModal] = useState(false);
    const [UserOrders, setUserOrders] = useState([]);

    useEffect(()=>{

        if(OrdersModal || ProfilModal){
            document.body.style.overflowY = 'hidden'
        }else{
            document.body.style.overflowY = 'scroll'
        }

    }, [OrdersModal, ProfilModal])

    const getUserOrders = async() => {

        try {
            
            const res = await Axios.get('/user-orders')
            if (res.status === 200) {
                
                setUserOrders(res.data.data)
                setOrdersModal(true)

            }

        } catch (error) {
            console.log(error);
        }

    }

    const logout = async() => {

        try {
            
            const res = await Axios.post('/logout')
            if (res.status === 200) {
                setUser();
                <Navigate to='/'/>
            }

        } catch (error) {
            console.log(error);
        }

    }

  return (
    <div onClick={()=> !ShowProfileMenu && setShowProfileMenu(true)} className='relative cursor-pointer rounded-full bg-gray-600 w-8 h-8 flex justify-center items-center text-white'>
            
            {
                user.profile ?
                <img className="h-full w-full rounded-full" src={ user.profile && user.profile} alt="profile" />
                : 
                <p className="font-bold uppercase">{user.name.slice(0,1)}</p>
            }
            
            <div className={`${ShowProfileMenu ? 'flex-col items-center' : 'hidden'} flex absolute z-20 ${user.role === 'seller' ? '-bottom-[18rem]' : '-bottom-[15rem]' }  ${window.location.pathname.includes('/dashboard') ? '-right-14' : '-right-[6.5rem]' } sm:right-0 bg-gray-50 w-[850%] sm:w-[200px] text-gray-500 rounded-lg px-2 pt-2 pb-4`}>
                
                <button onClick={()=> setShowProfileMenu(false)} className='self-end text-end'><IoMdCloseCircleOutline fontSize={23}/></button>
                
                <div className='rounded-full border bg-gray-600 w-9 h-9 flex justify-center items-center text-white'>
                    
                    {
                        user.profile ?
                        <img className="h-full w-full rounded-full" src={ user.profile && user.profile } alt="profile" />
                        : 
                        <p className="font-bold uppercase">{user.name.slice(0,1)}</p>
                    }

                </div>
                
                <h4 className='py-2 font-semibold text-[18px]'>{user.name}</h4>
                
                <hr className='border-black w-full'/>
                
                <ul className='flex text-[17px] w-full flex-col justify-center items-center'>

                    <li className=' cursor-pointer hover:text-primary_text border-b py-1 w-full text-center'>
                        <button onClick={()=> setProfilModal(true)} className='flex w-full items-center justify-center gap-1' ><BiUser fontSize={20}/> Profile</button>
                    </li>

                    {
                        user.role === 'seller' && window.location.pathname.includes('/dashboard') && 
                        <li className='cursor-pointer hover:text-primary_text border-b w-full text-center py-1'>
                            <NavLink className='flex items-center justify-center gap-1' to='/'>
                                <FaShop/> Market
                            </NavLink>
                        </li>
                    }

{
                        user.role === 'seller' && !window.location.pathname.includes('/dashboard') && 
                        <li className='cursor-pointer hover:text-primary_text border-b w-full text-center py-1'>
                            <NavLink className='flex items-center justify-center gap-1' to='/dashboard'>
                                <MdDashboard/>Dashboard
                            </NavLink>
                        </li>

                    }

                    <li className='cursor-pointer hover:text-primary_text border-b w-full text-center py-1'>
                        <button className='flex w-full items-center justify-center gap-1' onClick={()=> getUserOrders()}>
                            <BiPurchaseTag fontSize={20}/> My Orders
                        </button>
                    </li>

                    <li className='cursor-pointer hover:text-primary_text pt-1'>
                        <button className='flex w-full items-center justify-center gap-1' onClick={() => logout()}>
                            <BiLogOut fontSize={20}/> Logout
                        </button>
                    </li>

                </ul>

            </div>
            
        {ProfilModal && <ProfileM ProfilModal={ProfilModal} hundleClick={setProfilModal} />}
        {OrdersModal && <MyOrders orders={UserOrders} hundleClick={setOrdersModal} />}
    
    </div>
    
  )
}

export default Profile