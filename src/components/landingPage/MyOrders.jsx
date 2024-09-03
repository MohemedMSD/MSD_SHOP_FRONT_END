import React from 'react'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { NavLink } from 'react-router-dom'

const MyOrders = ({hundleClick, orders}) => {

  return (
    <div className="fixed top-0 h-screen right-0 w-full flex justify-center items-center z-50">

        <div className='fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60' />

        <div className="bg-white w-[98%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[55%] z-50 rounded-lg">

            <div className="flex items-center justify-between text-primary_text p-3">
                <h1 className="text-[23px] sm:text-[24px] md:text-[26px] lg:text-[30px] font-bold">My Orders</h1>
                <button onClick={() => hundleClick(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
            </div>

            <hr className="border-gray-600" />

            <div className="flex flex-col gap-4 p-2 sm:p-5 h-[87vh] hide-scrollbar overflow-y-scroll">

                {
                    orders.length > 0 ?
                        orders?.map((item) => (
                            <div key={item.ref} className='text-primary_text p-2 border border-gray-400 rounded-xl'>

                                <div className='flex flex-col sm:flex-row items-center gap-x-0 gap-y-0 sm:gap-x-2'>
                                    <h6 className='text-start text-[19px] text-second font-bold text-nowrap'>Order Reference : {item.ref} </h6>
                                    <p className='text-gray-500 text-[15px] font-semibold text-nowrap'><i>{item.created_at.slice(0, 10)}</i></p>
                                </div>
                      
                                <div className='flex p-2 items-center gap-y-2 sm:gap-y-0 justify-between flex-wrap'>
                                    
                                    <div className='flex items-center gap-2 text-nowrap'>
                                        <p className='font-semibold text-center'>Price :</p>
                                        <p className='text-center'>{Math.round(item.total_price * 100) / 100}</p>
                                    </div>
                                    
                                    <div className='flex items-center gap-2 text-nowrap'>
                                        <p className='font-semibold text-center'>Quantity :</p>
                                        <p className='text-center'>{item.quantity}</p>
                                    </div>

                                    <div className='flex items-center gap-2 text-nowrap'>
                                        <p className='font-semibold text-center'>Status :</p>
                                        {
                                            item.received ? 
                                            <p className='text-center'>{item.status} <span className=' text-green-500'>Confirmed</span></p>
                                            :
                                            <p className='text-center'>{item.status} {item.part === 4 ? <span className=' text-red-500'>Not Confirmed</span> : ''} </p>
                                        }
                                    </div>

                                </div>

                                <div className='flex p-2 items-center gap-y-2 sm:gap-y-0 gap-x-2 justify-between flex-wrap'>
                                    
                                    <div className='flex items-center gap-2 text-nowrap'>
                                        <p className='font-semibold text-center'>Line :</p>
                                        <p className='text-center'>{item.adress?.line}</p>
                                    </div>
                                    
                                    <div className='flex items-center gap-2 text-nowrap'>
                                        <p className='font-semibold text-center'>City :</p>
                                        <p className='text-center capitalize'>{item.adress?.city}</p>
                                    </div>

                                    <div className='flex items-center gap-2 text-nowrap'>
                                        <p className='font-semibold text-center'>Country :</p>
                                        <p className='text-center capitalize'>{item.adress?.country}</p>
                                    </div>

                                </div>

                                <h6 className='text-center text-second text-[18px] pb-2 border-gray-400 mt-2 font-bold'>Order's Products</h6>
                                
                                <table className='w-full hidden sm:inline-table'>

                                    <thead className='border-b border-gray-300'>
                                        <th className='py-2 px-3 text-center'>Name</th>
                                        <th className='py-2 px-3 text-center'>Quantity</th>
                                        <th className='py-2 px-3 text-center'>Price</th>
                                    </thead>
                                    <tbody>
                                    {
                                                JSON.parse(item.products)?.map((product, index) => (
                                                    <tr className={index != JSON.parse(item.products)?.length - 1 && 'border-b border-gray-400'} key={index}>
                                                        <td className={`py-2 font-semibold text-nowrap px-3 text-center`}>
                                                            {product.id !== 'null' ? <NavLink to={`/products/${product.id}`}>{product.name}</NavLink> : <p>{product.name}</p>}
                                                        </td>
                                                        <td className='py-2 px-3 text-center'>{product.quantity}</td>
                                                        <td className='py-2 px-3 text-center'>{Math.round(product.price * 100) / 100}</td>
                                                    </tr>
                                                ))
                                            }
                                    </tbody>
                                </table>

                                <table className='w-full sm:hidden inline-table'>
                                        <tbody className=''>
                                            {
                                                JSON.parse(item.products)?.map((product, index) => (
                                                    <div key={index}>
                                                        <tr className={index != JSON.parse(item.products)?.length - 1 && 'border-b border-gray-400'} key={index}>
                                                            <td className='py-2 font-semibold px-3 text-center'>Name</td>
                                                            <td className={`py-2 font-semibold px-3 text-nowrap text-center`}>
                                                                {product.id !== 'null' ? <NavLink to={`/products/${product.id}`}>{product.name}</NavLink> : <p>{product.name}</p>}
                                                            </td>
                                                        
                                                        </tr>

                                                        <tr className={index != JSON.parse(item.products)?.length - 1 && 'border-b border-gray-400'}>
                                                            <td className='py-2 font-semibold px-3 text-center'>Quantity</td>
                                                            <td className='py-2 px-3 text-center'>{product.quantity}</td>
                                                        </tr>

                                                        <tr className={index != JSON.parse(item.products)?.length - 1 && 'border-b border-gray-400'}>
                                                            <td className='py-2 font-semibold px-3 text-center'>Price</td>
                                                            <td className='py-2 px-3 text-center'>{product.price}</td>
                                                        </tr>
                                                    </div>
                                                ))
                                            }
                                        </tbody>
                                </table>

                            </div>
                        ))
                    :
                    <p className='text-center text-second font-bold text-[17px] sm:text-[19px]'>You Dont have Any Orders</p>
                }
            </div>
        </div>

    </div>
  )
}

export default MyOrders