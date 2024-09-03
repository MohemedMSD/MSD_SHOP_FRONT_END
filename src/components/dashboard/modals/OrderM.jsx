import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import Axios from '../../../assets/constants/axios/axios'
import { useStateContext } from '../../../context/StateContext'

const OrderM = ({closeModal, header, order, action}) => {

    const {Orders, setOrders, user} = useStateContext()
    const [Number, setNumber] = useState('')
    const [Quantity, setQuantity] = useState(0)
    const [Price, setPrice] = useState(0)
    const [Expenses, setExpenses] = useState(0)
    const [Profit, setProfit] = useState(0)
    const [Date, setDate] = useState('')
    const [StatusID, setStatusID] = useState(0)
    const [ErrStatusID, setErrStatusID] = useState('')
    const [Status, setStatus] = useState()
    const [Received, setReceived] = useState()
    const [CostumerEmail, setCostumerEmail] = useState('')
    const [Adress, setAdress] = useState({})
    const [OrderProducts, setOrderProducts] = useState([])


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

            setNumber(order?.ref)
            setDate(order?.created_at.slice(0, 10))
            setQuantity(order?.quantity)
            setPrice(order?.total_price)
            setStatusID(order?.part)
            setReceived(order?.received)
            setOrderProducts(typeof(order?.products) !== 'object' ? JSON.parse(order?.products) : order?.products)
            setCostumerEmail(order?.email)
            setAdress(order?.adress)

            if (order?.products != '') {

              JSON.parse(order?.products)?.map(item => {
                setProfit(pre => pre + item?.profit)
                setExpenses(pre => pre + (item?.price - item?.profit) )
              })

            }

      }

    }, [action, order])

    const updateOrder = async(e, id, order_id) => {
      
        e.preventDefault()

        try {
          
          toast.loading('processing...')

          // this put method but is not work on that host so i change it to post
          const res = await Axios.post(`/update-orders/${order_id}`, {
            status : StatusID,
            _method : 'put'
          }, {
            headers : {
              'Content-Type' : 'text/json'
            }
          })

          if (res.status === 200) {
              
            const UpdatedOrders = Orders.map((item) => {

              if (item.id == id) {
                return {
                        ...item,
                        status : res.data.order.status
                      }
              }
    
              return item
    
            })
            
            // if (res?.data?.notification.id !== undefined) {
              
            //   let change = false;
            //   const NewNotifications = Notifications.map((item) => {

            //     if (res?.data?.notification?.id === item.id) {
            //       change = true
            //       return res.data.notification
            //     }
            //     return item

            //   })

            //   if (!change) {
            
            //     setNotifications([...Notifications, res?.data?.notification])

            //   }else{

            //     setNotifications(NewNotifications)

            //   }

            // }
    
            setOrders(UpdatedOrders)
            toast.dismiss()
            toast.success('Order Updated Successfully')
            closeModal(false)

          }

        } catch (rej) {
          
          toast.dismiss()
          if (rej.response.status === 422) {
            
            const messages = rej.response.data;
            
            setErrStatusID(messages?.status)
  
          }else{
            toast.error('Sometimes wrong, please try again')
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

        <div className="flex flex-col h-[88vh] overflow-x-scroll hide-scrollbar gap-3 p-2 sm:p-5">

          <div className="border border-gray-400 p-2  rounded-lg">
            <h1 className="text-[26px] text-primary_text text-nowrap font-bold">
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
                    <p>${Math.round(Price * 100) / 100}</p>
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
                    <p>{CostumerEmail || "-"}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">Line</label>
                    <p>{Adress?.line || "-"}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">City</label>
                    <p>{Adress?.city || "-"}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">State</label>
                    <p>{Adress?.state || "-"}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">Postal code</label>
                    <p>{Adress?.postal_code || "-"}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className="font-semibold w-1/4">Country</label>
                    <p>{Adress?.country || "-"}</p>
                </div>
              </div>

              <div className="flex flex-col">

                <div className="flex gap-3 items-center">
                    <label className="font-semibold w-1/4">Status</label>
                    <select disabled={action === 'show'} onChange={(e) => setStatusID(e.target.value)} 
                        className={` ${ErrStatusID ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`} name="category">
                        <option disabled defaultValue={true}>Select Status</option>
                        {
                            Status?.map((item) => (
                                <option key={item.id} value={item.id} selected={StatusID === item.id} >{item.statut} <span>{Received && item.id === 4 ? 'Confirmed' : ''}</span></option>
                            ))
                        }
                    </select>
                </div>

                { ErrStatusID && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrStatusID}</p>}

              </div>

              <div className='flex flex-col mt-3 items-center'>
                <label className='w-full sm:w-1/4 text-center mb-2 text-xl text-primary_text text-nowrap font-semibold'>Order Products</label>
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
                            OrderProducts?.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-2 text-nowrap px-3 text-center border-b border-gray-400'>{item.name}</td>
                                    <td className='py-2 px-3 text-center border-b border-gray-400'>{item.quantity}</td>
                                    <td className='py-2 px-3 text-center border-b border-gray-400'>{Math.round(item.price * 100) / 100}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
              </div>

              {

                user.role == 'seller' && (
                  <div className='py-4'>
          
                    <h3 className='w-full text-center mb-4 text-xl text-primary_text text-nowrap font-semibold'>Expenses and profits</h3>
                  
                    <div className='flex flex-wrap gap-x-10 gap-y-2 text-md justify-center w-full sm:flex-row'>
                      
                      <div className="flex flex-col">
                        <div className="flex  gap-3 items-center">
                            <label className="font-bold">Price</label>
                            <p className='font-semibold'>${Math.round(Price * 100) / 100}</p>
                        </div>
                      </div>
    
                      <div className="flex flex-col">
                        <div className="flex  gap-3 items-center">
                            <label className="font-bold">Expenses</label>
                            <p className='font-semibold'>${Math.round(Expenses * 100) / 100}</p>
                        </div>
                      </div>
    
                      <div className="flex flex-col">
                        <div className="flex  gap-3 items-center">
                            <label className="font-bold">Profit</label>
                            <p className='font-semibold'>${Math.round(Profit * 100) / 100}</p>
                        </div>
                      </div>
    
                    </div>
    
                  </div>
                )

              }

              {
                action === 'update' && <button onClick={(e) => updateOrder(e, order.id, order.order_id)} className="p-2 mx-auto w-full sm:w-fit font-semibold bg-second text-white rounded-md">Save</button>
              }
              {
                action === 'show' && 
                <button onClick={(e) => closeModal(false)} className="p-2 mx-auto w-full sm:w-fit font-semibold bg-gray-500 text-white rounded-md">Close</button>
              }

            </form>

          </div>

        </div>

      </div>
    </div>
  )
}

export default OrderM