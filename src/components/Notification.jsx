import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa';
import { IoIosNotifications, IoMdCloseCircleOutline } from 'react-icons/io'
import Axios from '../assets/constants/axios/axios';
import { useStateContext } from '../context/StateContext';
import { OrderM }from './';

const Notification = () => {

    const {user, Notifications, setNotifications, Orders, setOrders, setFilteredOrders} = useStateContext()

    const [ShowNotificationsMenu, setShowNotificationsMenu] = useState(false);
    const [ShowModalShow, setShowModalShow] = useState(false);
    const [OrderInfo, setOrderInfo] = useState({})
    const [reload, setreload] = useState(true);

    const [ShowReceive, setShowReceive] = useState(user.role === 'costumer')
    const [ShowSent, setShowSent] = useState(user.role === 'seller')

    useEffect(() => {

        (async()=>{

            try {
                
                const res = await Axios.get('/order-confirmation')
                if (res.status === 200) {

                    setNotifications(res.data.data)
    
                }

            } catch (error) {
                console.log(error);
            }

        })()

    }, [reload])
    
    const confirmation = async(resp, id) => {

        try {
            
            const res = await Axios.put('/order-confirmation/' + id , { confirmated : resp }, {
                headers : {
                    'Content-Type' : 'text/json'
                }
            })
        
            if (res.status === 200) {
                
                const newArray = Notifications.map((item) => {

                    if (item.id === id) {
                        return res.data.notification
                    }

                    return item

                })

                const newArrayOrders = Orders.map((item) => {
                    
                    if (item.order_id === res.data.notification.order.id) {
                        return res.data.order
                    }

                    return item

                })

                setOrders(newArrayOrders)
                setFilteredOrders(newArrayOrders)
                setNotifications(newArray)

            }

        } catch (error) {
            console.log(error);
        }

    }

    const Resend = async (id) => {

        try {
            
            const res = await Axios.put('/order-confirmation/resend/' + id)
            if (res.status === 200) {
                
                const newArray = Notifications.map((item) => {

                    if (item.id === id) {
                        return res.data.data
                    }

                    return item

                })

                setNotifications(newArray)

            }

        } catch (error) {
            console.log(error);
        }

    }

    const deleteNotification = async (id, delete_from) => {

        try {
            
            const res = await Axios.put('/order-confirmation/remove/' + id + '/' + delete_from)
            if (res.status === 200) {
                
                let newArray = []
                if (typeof(res.data.data) === 'string') {

                    newArray = Notifications.filter((item) => 
                        item.id !== id
                    )

                }else if(typeof(res.data.data) === 'object'){

                    newArray = Notifications.map((item) => {

                        if (item.id === id) {
                            return res.data.data
                        }
    
                        return item
    
                    })

                }

                let emptyNotificationSend = true;
                let emptyNotificationReceived = true;

                newArray.map((item) => {
                    if( item.deleted_from_send === 0 ){
                        emptyNotificationSend = false;
                    }
                    if( item.deleted_from_receive === 0 ){
                        emptyNotificationReceived = false;
                    }
                })

                if(emptyNotificationSend){
                    setShowNotificationsMenu(false)
                    setreload(!reload)
                }

                if(emptyNotificationReceived){
                    setShowNotificationsMenu(false)
                    setreload(!reload)
                }

                setNotifications(newArray)

            }

        } catch (error) {
            console.log(error);
        }

    }

    const prepareToUpdateOrShow = async (OrderID, action) => {

        try {
            
            const res = await Axios.get('/orders/' + OrderID)
            if (res.status === 200) {
                
                setOrderInfo(res.data);
                setShowModalShow(true)
                    
            }

        } catch (error) {
            console.log(error);
        }
    
    }

  return (
    <>
        <div onClick={()=> !ShowNotificationsMenu && setShowNotificationsMenu(true)}  className='relative cursor-pointer'>
                <IoIosNotifications color='#324D67' fontSize={35}/>
                {Notifications?.length > 0 && (
                <span className="absolute top-1 w-[10px] h-[10px] rounded-[50%] text-center right-2 text-[12px] text-slate-100 bg-second "></span>
                )}
                <div className={`${ShowNotificationsMenu ? 'flex-col' : 'hidden'} flex absolute z-40 top-14 -right-[200%] sm:right-0 bg-gray-100 w-[280px] sm:w-[300px] text-gray-500 rounded-lg px-2 pt-2 pb-3`}>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-[18px] font-bold text-[#324D67]'>Notification </h4>
                        <button onClick={()=> setShowNotificationsMenu(false)} className='self-end text-end'><IoMdCloseCircleOutline fontSize={23}/></button>
                    </div>

                    <div className='flex border-b border-gray-600'>
                        <button className={` ${ShowReceive ? 'border-b-2 border-gray-600 font-bold' : 'font-semibold'} w-1/2 py-2  text-[#324D67]`} onClick={() => { setShowReceive(true); setShowSent(false) }}>Recu</button>
                        { user.role === 'seller' && <button className={` ${ShowSent ? 'border-b-2 border-gray-600 font-bold' : 'font-semibold'} w-1/2 py-2  text-[#324D67]`} onClick={() => { setShowReceive(false); setShowSent(true) }}>Send</button> }
                    </div>
                    <div>

                        {
                            ShowReceive && 
                            <div className={`py-1 overflow-y-scroll hide-scrollbar ${Notifications.length > 3 ? 'h-[49vh]' : ''}`}>
                                {
                                    Notifications?.map((item) => (
                                        item.order.user_id === user.number && !item?.deleted_from_receive &&
        
                                        <div key={item.id} className='flex items-center justify-between py-1 border-b border-gray-300'>
                                            <div>
                                                <div className='flex items-center justify-between'>
                                                    <h6 className='text-second font-semibold' onClick={() => prepareToUpdateOrShow(item.order.id)}>{item.subject}<span className='text-[#324D67] font-normal ml-1 text-[12px]'>{item.created_at}</span></h6>
                                                    {item.response !== 'pending' && <IoMdCloseCircleOutline onClick={() => deleteNotification(item.id, 'receive')} />}
                                                </div>
                                                <p className='text-[#324D67] py-1'>{item.content}</p>
                                                <div className='w-full flex items-center'>
                                                    {
                                                        item.response === 'pending' ?
                                                        <>
                                                            <button onClick={() => confirmation(true, item.id)} className='w-1/2 p-1 border-r flex items-center justify-center border-gray-400'><span><FaCheck className='mr-1' /></span>Received It</button>
                                                            <button onClick={() => confirmation(false, item.id)} className='w-1/2 p-1'> <span className="font-bold">X</span> Not Received</button>
                                                        </>
                                                        :
                                                        <p className='text-[#324D67] p-1 text-center'><span className='font-semibold'>Your Response : </span> {item.response} </p>
                                                    }
                                                </div>
                                            </div>
                
                                        </div>
                                    ))
                                }
                                {
                                    Notifications.length === 0 && <p className='text-[#324D67] text-center'>You Don't Have Notifications</p>
                                }
                            </div>
                        }

                        {
                            ShowSent && 
                            <div className={`py-1 overflow-y-scroll hide-scrollbar ${Notifications.length > 3 ? 'h-[49vh]' : ''}`}>
                                {
                                    Notifications?.map((item) => (
                                        user.role === 'seller' && !item.deleted_from_send &&
        
                                        <div key={item.id} className='flex items-center justify-between py-1 border-b border-gray-300'>
                
                                            <div className='w-full flex flex-col'>
                                                <div className='flex items-center justify-between'>
                                                    <h6 className='text-second font-semibold'  onClick={() => prepareToUpdateOrShow(item.order.id)}>{item.subject}<span className='text-[#324D67] font-normal ml-1 text-[12px]'>{item.created_at}</span></h6>
                                                    {item.order.received ? <IoMdCloseCircleOutline onClick={() => deleteNotification(item.id, 'send')} /> : ''}
                                                </div>
                                                <p className='text-[#324D67] py-1'>To : {item.email}</p>
                                                <p><span className='font-semibold'>Response : </span>{item.response}</p>
                                                {
                                                    item.response !== 'pending' && !item.order.received && 
                                                    <button onClick={() => Resend(item.id)} className='bg-second rounded-md py-1 text-white mt-1 px-2'>Resend</button>
                                                }
                                            </div>
                
                                        </div>
                                    ))
                                }

                                {
                                    Notifications.length === 0 && <p className='text-[#324D67] text-center'>You Don't Have Notifications</p>
                                }
                            </div>
                        }

                    </div>
                </div>
        </div>
        
        {ShowModalShow && <OrderM action="show" header="Show Order" closeModal={setShowModalShow} order={OrderInfo} />}

    </>
  )
}

export default Notification