import {React, useState} from 'react'
import { IoMdClose } from 'react-icons/io';
import { MdOutlineMenu } from 'react-icons/md';
import { Link, NavLink } from 'react-router-dom';
import { links } from '../assets/constants/links';

const NavLinks = ({ hundelClick }) => (
  <div className="mt-7">
    {links.map((link, i) => (
      <NavLink
        key={i}
        className="flex flex-row justify-start items-center
          my-8 text-base font-medium text-gray-200 hover:text-second"
        to={link.to}
        onClick={hundelClick && (() => hundelClick())}
      >
        <span>{link.icon}</span><p className='text-[18px]'>{link.name}</p>
      </NavLink>
    ))}
  </div>
); 

const SideBar = () => {

  const [mobileMenuOpen, setmobileMenuOpen] = useState(false);

  const hundelClickIN = () => {
    setmobileMenuOpen(false);
  };

  return (
    <div>
      <div className="lg:flex hidden flex-col h-screen items-center py-7 px-4 w-[250px] bg-gradient-to-tl from-[#324D67] to-[#060606] ">
        <Link
          className="flex items-center ml-[-12px]"
          to="/dashboard"
        >
          <p className="font-semibold text-center tracking-md text-2xl ml-[-4px] text-gray-100">
            MSD SHOP
          </p>
        </Link>

        <NavLinks hundelClick={() => hundelClickIN()} />
      </div>

      <div className="absolute top-[1.1rem] left-2 lg:hidden block z-1">
        {!mobileMenuOpen && (
          <button
            onClick={() => setmobileMenuOpen(true)}
            className="h-6 w-6 text-black mr-2 cursor-pointer z-10"
          ><MdOutlineMenu fontSize={25}/></button>
        ) }
      </div>

      <div
        className={`absolute top-0 h-screen w-3/4 sm:w-2/4 bg-gradient-to-tl from-[#324D67] to-[#060606]
        z-50 backdrop-blur-lg p-6 lg:hidden smooth-transition ${
          mobileMenuOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className='flex justify-between'>

          <Link to="/dashboard">
            <p className="font-bold text-center tracking-md text-2xl ml-2 mt-[-4px] text-gray-100">
              MSD SHOP
            </p>
          </Link>
          {
            mobileMenuOpen && (
              <button
                onClick={() => setmobileMenuOpen(false)}
                className="h-6 w-6 text-[24px] text-gray-200 mr-2 cursor-pointer z-10"
              ><IoMdClose/></button>
            )
          }
        </div>
          
        <hr className='border-gray-200 mt-5 w-[130%] -ml-[30px]'/>

        <NavLinks hundelClick={() => hundelClickIN()} />
      </div>

    </div>
  )
}

export default SideBar