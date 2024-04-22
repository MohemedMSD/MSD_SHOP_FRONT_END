import React, { useEffect, useState } from 'react'
import { BiPurchaseTag } from 'react-icons/bi'
import { FaArrowRight, FaMoneyBill, FaProductHunt } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import Axios from '../assets/constants/axios/axios'

const HomeDashboard = () => {
  const [products, setproducts] = useState(0);
  const [orders, setorders] = useState(0);
  const [categories, setcategories] = useState(0);

  useEffect(()=>{
    Axios.get('/details')
    .then((res) => {
      if (res.status === 200) {
        setcategories(res.data.categories)
        setproducts(res.data.products)
        setorders(res.data.orders)
      }
    })
    .catch((rej) => console.log(rej))
  }, [])

  return (
    <div>
      <h1 className="text-primary_text mb-5 font-bold text-[19px] sm:text-[25px] ">
        Home
      </h1>

      <div className="flex flex-wrap h-[49vh] justify-start gap-x-[5%] gap-y-[5%] rounded-xl">
        <div className='p-3 relative shadow-lg w-[100%] sm:w-[30%] bg-gradient-to-br from-second to-[#ff8b8f] rounded-lg justify-between flex h-[150px] flex-col'>
            <h2 className='text-start text-[25px] font-bold text-white z-10'>Products</h2>
            <FaProductHunt fontSize={90} className=' absolute hover:scale-110 transition-transform  text-white top-7 right-5 opacity-60'/>
            <p className='text-white font-bold text-[45px]'>{products}</p>
            <NavLink className="flex gap-1 items-center font-semibold text-white justify-center" to='/dashboard/products'>
                Show more <FaArrowRight className='mt-[3px]' fontSize={12}/>
            </NavLink>
        </div>

        <div className='p-3 relative shadow-lg w-[100%] sm:w-[30%] bg-gradient-to-br from-primary_text to-[#4b6f91] rounded-lg justify-between flex  h-[150px] flex-col'>
            <h2 className='text-start text-[25px] font-bold text-white z-10'>Orders This Month</h2>
            <BiPurchaseTag  fontSize={90} className=' absolute hover:scale-110 transition-transform  text-white top-7 right-5 opacity-60'/>
            <p className='text-white font-bold text-[45px]'>{orders}</p>
            <NavLink className="flex gap-1 items-center font-semibold text-white justify-center" to='/dashboard/orders'>
                Show more <FaArrowRight className='mt-[3px]' fontSize={12}/>
            </NavLink>
        </div>

        <div className='p-3 relative shadow-lg w-[100%] sm:w-[30%] bg-gradient-to-br from-gray-400 to-gray-300 rounded-lg justify-between flex  h-[150px] flex-col'>
            <h2 className='text-start text-[25px] font-bold text-white z-10'>Categories</h2>
            <FaMoneyBill fontSize={90} className=' absolute hover:scale-110 transition-transform  text-white top-7 right-5 opacity-60'/>
            <p className='text-white font-bold text-[45px]'>{categories}</p>
            <NavLink className="flex gap-1 items-center font-semibold text-white justify-center" to='/dashboard/categories'>
                Show more <FaArrowRight className='mt-[3px]' fontSize={12}/>
            </NavLink>
        </div>

      </div>

    </div>
  )
}

export default HomeDashboard