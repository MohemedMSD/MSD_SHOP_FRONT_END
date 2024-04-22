import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import Axios from '../../../assets/constants/axios/axios'
import { useStateContext } from '../../../context/StateContext'

const OrderM = ({closeModal, header, order, action}) => {

    const {setNotifications, Notifications, Orders, setOrders, setFilteredOrders} = useStateContext()
    const [Number, setNumber] = useState('')
    const [Quantity, setQuantity] = useState(0)
    const [Price, setPrice] = useState(0)
    const [Date, setDate] = useState()
    const [StatusID, setStatusID] = useState(0)
    const [ErrStatusID, setErrStatusID] = useState()
    const [Status, setStatus] = useState()
    const [Received, setReceived] = useState()
    const [CostumerEmail, setCostumerEmail] = useState()
    const [OrderProducts, setOrderProducts] = useState()

    useEffect(() => {

      (async ()=>{

        try {
          
          const res = await Axios.get('/status')
          if (res.status === 200) {
            setStatus(res.data.data)
          }

        } catch (error) {
          console.log(error);
        }

      })()

      if (action === 'update' || action === 'show' && order) {
            
            setNumber(order?.id)
            setDate(order?.created_at.slice(0, 10))
            setQuantity(order?.quantity)
            setPrice(order?.total_price)
            setStatusID(order?.part)
            setReceived(order?.received)
            setOrderProducts(typeof(order?.products) !== 'object' ? JSON.parse(order?.products) : order?.products)
            setCostumerEmail(order?.email)

      }

    }, [action, order])

    const updateOrder = async(e, id) => {
        e.preventDefault()

        try {
          
          const res = await Axios.put(`/orders/${id}`, {
            status : StatusID
          }, {
            headers : {
              'Content-Type' : 'text/json'
            }
          })

          if (res.status === 200) {
              
            const UpdatedOrders = Orders.map((item) => {
    
              if (item.id === id) {
                return {
                        ...item,
                        status : res.data.order.status
                      }
              }
    
              return item
    
            })
            
            if (res?.data?.notification.id !== undefined) {
              
              let change = false;
              const NewNotifications = Notifications.map((item) => {

                if (res?.data?.notification?.id === item.id) {
                  change = true
                  return res.data.notification
                }
                return item

              })

              if (!change) {
            
                setNotifications([...Notifications, res?.data?.notification])

              }else{

                setNotifications(NewNotifications)

              }

            }
    
            setOrders(UpdatedOrders)
            setFilteredOrders(UpdatedOrders)
            toast.success('Order Updated Successfully')
            closeModal(false)

          }

        } catch (rej) {
          
          if (rej.response.status === 422) {
            
            const messages = rej.response.data;
            
            setErrStatusID(messages?.status)
  
          }

        }
  
    }

  return (
    <div className="fixed top-0 h-screen z-50 right-0 w-full flex justify-center items-center">
      <div className="fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60" />

      <div className="bg-white w-[98%] sm:w-[70%] lg:w-[55%] z-50 rounded-lg  hide-scrollbar overflow-y-scroll">

        <div className="flex items-center justify-between p-3">
          <h1 className="text-[28px] font-bold">{header}</h1>
          <button onClick={() => closeModal(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
        </div>

        <hr className="border-gray-600" />

        <div className="flex flex-col gap-3 p-2 sm:p-5">

          <div className="border border-gray-400 p-2 rounded-lg">
            <h1 className="text-[26px] text-[#324d67] font-bold">
              Order Information :
            </h1>
            <form action="" className="relative flex flex-col gap-4 mt-3 p-2">

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">Number</label>
                    <p>{Number}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-3 items-center">
                    <label className="font-semibold w-1/4">quantity</label>
                    <p>{Quantity}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">Price</label>
                    <p>{Price}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">Date</label>
                    <p>{Date}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">Email</label>
                    <p>{CostumerEmail}</p>
                </div>
              </div>

              <div className="flex flex-col">

                <div className="flex gap-3 items-center">
                    <label className="font-semibold w-1/4">Status</label>
                    <select disabled={action === 'show'} onChange={(e) => setStatusID(e.target.value)} 
                        className={` ${ErrStatusID ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-[#324d67] outline-none`} name="category">
                        <option disabled defaultValue={true}>Select Status</option>
                        {
                            Status?.map((item) => (
                                <option key={item.id} value={item.id} selected={StatusID === item.id} >{item.statut} <span>{Received && item.id === 4 ? 'Confirmed' : ''}</span></option>
                            ))
                        }
                    </select>
                </div>

                { ErrStatusID && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrStatusID}</p>}

              </div>

              <div className='flex flex-col sm:flex-row items-start sm:items-center'>
                <label className='w-full sm:w-1/4 font-semibold'>Order Products : </label>
                <table className='w-full sm:w-3/4'>
                    <thead>
                        <tr>
                            <th className='py-2 px-3 text-center border-b border-gray-400'>Name</th>
                            <th className='py-2 px-3 text-center border-b border-gray-400'>Quantity</th>
                            <th className='py-2 px-3 text-center border-b border-gray-400'>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            OrderProducts?.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-2 px-3 text-center border-b border-gray-400'>{item.name}</td>
                                    <td className='py-2 px-3 text-center border-b border-gray-400'>{item.pivot.quantity}</td>
                                    <td className='py-2 px-3 text-center border-b border-gray-400'>{item.pivot.price}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
              </div>
              {
                action === 'update' && <button onClick={(e) => updateOrder(e, order.order_id)} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">Save</button>
              }
              {
                action === 'show' && 
                <button onClick={(e) => closeModal(false)} className="p-2 mx-auto w-[20%] font-semibold bg-gray-500 text-white rounded-md">Close</button>
              }

            </form>
          </div>

        </div>

      </div>
    </div>
  )
}

export default OrderM