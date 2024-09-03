import React from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
const Footer = () => {
  return (
    <div className="w-full text-primary_text font-[700] text-center text-[20px] px-[10px] py-[30px] flex flex-col items-center gap-[8px]">
      
        <h1>2024 MSD SHOP All right reserved</h1>
        <div className='flex justify-center gap-2'>
          <NavLink to='https://www.linkedin.com/in/mohamed-messoud'>
            <FaLinkedin className='text-primary_text' fontSize={25}/>
          </NavLink>
          <NavLink to='https://github.com/MohemedMSD/MohemedMSD' >
            <FaGithub className='text-primary_text' fontSize={25} />
          </NavLink>
        </div>
      
    </div>
  )
}

export default Footer