import React, { useEffect, useState } from 'react'
import { FaCheck, FaTrash } from 'react-icons/fa';
import { IoIosNotifications, IoMdCloseCircleOutline } from 'react-icons/io'
import Axios from '../assets/constants/axios/axios';
import { useStateContext } from '../context/StateContext';
import { OrderM }from './';
import Pusher from "pusher-js";
// import './../pusher/echo'

const Notification = () => {

    const {user, Orders, setOrders, setFilteredOrders} = useStateContext()

    const [ShowNotificationsMenu, setShowNotificationsMenu] = useState(false);
    const [ShowModalShow, setShowModalShow] = useState(false);
    const [Notifications, setNotifications] = useState([])
    const [OrderInfo, setOrderInfo] = useState({})
    const [reload, setreload] = useState(true);
    const [ShowNewNTFS, setShowNewNTFS] = useState(false);

    const [ShowReceive, setShowReceive] = useState(user.role === 'costumer')
    const [ShowSent, setShowSent] = useState(user.role === 'seller')

    const [getData, setgetData] = useState(false)

    useEffect(() => {

        (async()=>{

            try {
                
                // if (getData) {

                    const res = await Axios.get('/order-confirmation')
                    if (res.status === 200) {

                        setNotifications(res.data.data)
                        // setShowNotificationsMenu(true)
                        // setShowNewNTFS(true)
        
                    }

                // }

                // setgetData(false)

            } catch (error) {
                console.log(error);
            }

        })()

    }, [reload])

    useEffect(() => {
        const pusher = new Pusher(import.meta.env.VITE_APP_PUSHER_APP_KEY, {
            cluster: import.meta.env.VITE_APP_PUSHER_APP_CLUSTER,
            encrypted: true,
        });
    
        const channel = pusher.subscribe("notifications");
    
        channel.bind("send-new-notification", (data) => {
            
            if (data?.notification?.email === user?.email || user?.role === 'seller') {
    
                let new_notification_array = [...Notifications];
                const notification_is_exists = new_notification_array.some(item => item.id === data?.notification?.id);
    
                if (notification_is_exists) {
                    new_notification_array = new_notification_array.map(item =>
                        item.id === data?.notification?.id ? data.notification : item
                    );
                } else {
                    new_notification_array.unshift(data.notification);
                }
    
                setNotifications(new_notification_array);
            }
        });
    
        // Ping the Pusher connection every 5 seconds
        const interval = setInterval(() => {
            pusher.connection.send_event('pusher:ping', {});
        }, 50000);
    
        return () => {
            clearInterval(interval);
            pusher.unsubscribe("notifications");
        };
    }, []);
    
    const confirmation = async(resp, id) => {

        try {
            
            const res = await Axios.post('/order-confirmation/' + id , 
            { 
                confirmated : resp,
                _method : 'PUT'
            }, 
            {
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
                    
                    if (item.ref === res.data.order.ref) {
                        return {
                            ...item,
                            received: res.data.order.received
                        }
                    }

                    return item

                })

                setOrders(newArrayOrders)
                setNotifications(newArray)

            }

        } catch (error) {
            console.log(error);
        }

    }

    const Resend = async (id) => {

        try {
            
            const res = await Axios.post('/order-confirmation/resend/' + id, 
            {
                _method : 'PUT'
            })
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
            
            const res = await Axios.post('/order-confirmation/remove/' + id + '/' + delete_from)
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

    const hundelClickForShowNotifications = () => {
        setgetData(true)
        setreload(!reload)
    }

  return (
    <>
        <div onClick={()=> !ShowNotificationsMenu && setShowNotificationsMenu(true)}  className='relative cursor-pointer'>
                <IoIosNotifications color='#324D67' fontSize={35}/>

                {Notifications.length > 0 && (
                <span className="absolute top-1 w-[10px] h-[10px] rounded-[50%] text-center right-2 text-[12px] text-slate-100 bg-second "></span>
                )}
                {
                    ShowNotificationsMenu && (
                        <div className={`flex-col flex absolute z-40 top-14 ${window.location.pathname.includes('/dashboard') ? '-right-1' : '-right-[140%]'} sm:right-0 bg-gray-100 w-[300px] text-gray-500 rounded-lg px-2 pt-2 pb-3`}>
                            
                            <div className='flex items-center justify-between'>
                                <h4 className='text-[18px] font-bold text-primary_text'>Notification </h4>
                                <button onClick={()=> setShowNotificationsMenu(false)} className='self-end text-end'><IoMdCloseCircleOutline fontSize={23}/></button>
                            </div>
        
                            <div className='flex border-b border-gray-600'>
                                <button className={` ${ShowReceive ? 'border-b-2 border-gray-600 font-bold' : 'font-semibold'} w-1/2 py-2  text-primary_text`} onClick={() => { setShowReceive(true); setShowSent(false) }}>Recu</button>
                                { user.role === 'seller' && <button className={` ${ShowSent ? 'border-b-2 border-gray-600 font-bold' : 'font-semibold'} w-1/2 py-2  text-primary_text`} onClick={() => { setShowReceive(false); setShowSent(true) }}>Send</button> }
                            </div>
                            <div>
        
                                {
                                    ShowReceive && 
                                    <div className={`py-1 overflow-y-scroll hide-scrollbar ${Notifications.length > 3 ? 'h-[49vh]' : ''}`}>
                                        {
                                            Notifications?.map((item) => (
                                                (!item?.deleted_from_receive && user.email == item?.email) &&
                
                                                <div key={item.id} className='flex items-center justify-between py-1 border-b border-gray-300'>
                                                    <div className='w-full'>
                                                        <div className='flex items-center justify-between'>
                                                            <h6 className='text-second font-semibold' onClick={() => (user.role === 'seller' && item?.order) && prepareToUpdateOrShow(item.order.id)}>{item.subject}<span className='text-primary_text font-normal ml-1 text-[12px]'>{item.created_at}</span></h6>
                                                            {item.response !== 'pending' && <FaTrash onClick={() => deleteNotification(item.id, 'receive')} />}
                                                        </div>
                                                        <p className='text-primary_text py-1'>{item.content}</p>
                                                        <div className='w-full flex items-center'>
                                                            {
                                                                item?.response != '' && (
                                                                    
                                                                    item.response === 'pending' ?
                                                                    <>
                                                                        <button onClick={() => confirmation(true, item.id)} className='w-1/2 p-1 border-r flex items-center justify-center border-gray-400'><span><FaCheck className='mr-1' /></span>Received It</button>
                                                                        <button onClick={() => confirmation(false, item.id)} className='w-1/2 p-1'> <span className="font-bold">X</span> Not Received</button>
                                                                    </>
                                                                    :
                                                                    <p className='text-primary_text p-1 text-center'><span className='font-semibold'>Your Response : </span> {item.response} </p>

                                                                )
                                                            }
                                                        </div>
                                                    </div>
                        
                                                </div>
                                            ))
                                        }
                                        {
                                            Notifications.length === 0 && <p className='text-primary_text text-center'>You Don't Have Notifications</p>
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
                                                            <h6 className='text-second font-semibold'  onClick={() => user.role === 'seller' && prepareToUpdateOrShow(item.order.id)}>{item.subject}<span className='text-primary_text font-normal ml-1 text-[12px]'>{item.created_at}</span></h6>
                                                            {item.order.received ? <FaTrash className='' onClick={() => deleteNotification(item.id, 'send')} /> : ''}
                                                        </div>
                                                        <p className='text-primary_text py-1'>To : {item.email}</p>
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
                                            Notifications.length === 0 && <p className='text-primary_text text-center'>You Don't Have Notifications</p>
                                        }
                                    </div>
                                }
        
                            </div>
                        </div>
                    )
                }
        </div>
        
        {ShowModalShow && <OrderM action="show" header="Show Order" closeModal={setShowModalShow} order={OrderInfo} />}

    </>
  )
}

export default Notification