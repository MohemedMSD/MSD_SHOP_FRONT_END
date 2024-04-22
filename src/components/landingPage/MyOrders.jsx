import React from 'react'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { NavLink } from 'react-router-dom'

const MyOrders = ({hundleClick, orders}) => {
    
  return (
    <div className="fixed top-0 h-screen right-0 w-full flex justify-center items-center z-50">

        <div className='fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60' />

        <div className="bg-white w-[98%] sm:w-[70%] lg:w-[55%] z-50 rounded-lg">

            <div className="flex items-center justify-between text-[#324D67] p-3">
                <h1 className="text-[30px] font-bold">My Orders</h1>
                <button onClick={() => hundleClick(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
            </div>

            <hr className="border-gray-600" />

            <div className="flex flex-col gap-4 p-2 sm:p-5 h-[87vh] hide-scrollbar overflow-y-scroll">

                {
                    orders.length > 0 ?
                        orders?.map((item) => (
                            <div key={item.id} className='text-[#324D67] p-2 border border-gray-400 rounded-xl'>

                                <h6 className='text-center text-[18px] text-second border-b border-gray-400 font-bold'>Order Information</h6>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <p className='font-semibold text-center'>Number</p>
                                        <p className='text-center'>{item.id}</p>
                                    </div>
                                    
                                    <div>
                                        <p className='font-semibold text-center'>Price</p>
                                        <p className='text-center'>{item.total_price}</p>
                                    </div>
                                    
                                    <div>
                                        <p className='font-semibold text-center'>Quantity</p>
                                        <p className='text-center'>{item.quantity}</p>
                                    </div>

                                    <div>
                                        <p className='font-semibold text-center'>Status</p>
                                        {
                                            item.received ? 
                                            <p className='text-center'>{item.status} <span className=' text-green-500'>Confirmed</span></p>
                                            :
                                            <p className='text-center'>{item.status} {item.part === 4 ? <span className=' text-red-500'>Not Confirmed</span> : ''} </p>
                                        }
                                    </div>

                                    <div>
                                        <p className='font-semibold text-center'>Date</p>
                                        <p className='text-center'>{item.created_at.slice(0, 10)}</p>
                                    </div>

                                </div>
                                <h6 className='text-center text-[18px] border-y border-gray-400 mt-2 font-bold'>Order's Products</h6>
                                <table className='w-full'>
                                        <thead>
                                            <tr>
                                                <th className='py-2 px-3 text-center border-b border-gray-400'>Name</th>
                                                <th className='py-2 px-3 text-center border-b border-gray-400'>Quantity</th>
                                                <th className='py-2 px-3 text-center border-b border-gray-400'>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                JSON.parse(item.products)?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className='py-2 font-semibold px-3 text-center border-b border-gray-400'>
                                                            {item.id !== 'null' ? <NavLink to={`/products/${item.id}`}>{item.name}</NavLink> : <p>{item.name}</p>}
                                                        </td>
                                                        <td className='py-2 px-3 text-center border-b border-gray-400'>{item.pivot.quantity}</td>
                                                        <td className='py-2 px-3 text-center border-b border-gray-400'>{item.pivot.price}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                </table>

                            </div>
                        ))
                    :
                    <p className='text-center text-second font-bold text-[22px]'>You Dont have Any Orders</p>
                }
            </div>
        </div>

    </div>
  )
}

export default MyOrders