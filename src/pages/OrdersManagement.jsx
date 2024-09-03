import React, { useEffect, useState } from 'react'
import Axios from '../assets/constants/axios/axios';
import { Loading, OrderM } from '../components';
import { FaEdit, FaEye, FaSearch } from 'react-icons/fa';
import {TbZoomReset} from 'react-icons/tb'
import { useStateContext } from '../context/StateContext';
import { useFunctionsContext } from '../context/FunctionsContext';
import toast from 'react-hot-toast';

const OrdersManagement = () => {

  const {
    goToPreviousPage,
    goToNextPage, 
    goToPage, 
    totalPages, 
    settotalPages, 
    renderPages
  } = useFunctionsContext()

  const {Orders, setOrders} = useStateContext()
  const [currentPage, setCurrentPage] = useState(1)

  const [IsLoading, setIsLoading] = useState(true);
  const [errorMessage, seterrorMessage] = useState("");
  
  const [Status, setStatus] = useState([]);

  const [StockSearchQuery, setStockSearchQuery] = useState('');
  const [StockStartDate, setStockStartDate] = useState('');
  const [StockEndDate, setStockEndDate] = useState('');
  const [StockSelectedStatus, setStockSelectedStatus] = useState('null')

  const [SearchQuery, setSearchQuery] = useState('');
  const [StartDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [ErrMsgDate, setErrMsgDate] = useState('');

  const [SearchAction, setSearchAction] = useState(false)
  const [Reload, setReload] = useState(false)

  const [OrderInfo, setOrderInfo] = useState({})

  const [ShowModalUpdate, setShowModalUpdate] = useState(false);
  const [ShowModalShow, setShowModalShow] = useState(false);

  useEffect(() => {

    (async()=>{

      try {
        
        const res = await Axios.get("/status")

        if (res.status === 200) {

            setStatus(res.data.data);
          
        }

      } catch (error) {
        toast.error("Something Wrong in get status data! Try Again");
      }

    })()

  }, [])

  useEffect(() => {

    (async()=>{
      
      setIsLoading(true);

      try {
        
        let res;

        if (SearchAction) {

          res = await Axios.get(`/archive-orders/search/${SearchQuery || 'null'}/${StartDate || 'null'}/${EndDate || 'null'}/${selectedStatus || 'null'}/${currentPage}`)

        }else{

          res = await Axios.get("/archive-orders/" + currentPage)
          
        }

        if (res.status === 200) {

          if (res.data.orders.length > 0) {

            setOrders(res.data.orders);
            settotalPages(res.data.total_pages)
            seterrorMessage('')

          } else {

            setOrders([]);
            settotalPages(0)
            seterrorMessage("No Orders Exists");

          }

        }

      } catch (error) {
        setOrders([]);
        settotalPages(0)
        seterrorMessage("Something Wrong! Try Again");
      }

      setIsLoading(false)
    })()

  }, [currentPage, Reload])

  const prepareToUpdateOrShow = async (OrderID, action) => {

    try {
      
      const res = await Axios.get('/archive-orders/show/' + OrderID)

      if (res.status === 200) {
            
        setOrderInfo({
          ...res.data,
          id : OrderID
        });
        
        if (action === 'update') {
          setShowModalUpdate(true)
        }else if(action === 'show'){
          setShowModalShow(true)
        }
            
      }

    } catch (error) {
      console.log(rej);
    }

  }

  const runUseEffectForSearch = (e) => {

    const regex = /^[\w\s\-\_\=\+]+$/
    if (regex.test(e.target.value) || e.target.value == '') {
      
      setStockSearchQuery(e.target.value)

    }

  }

  const search = () => {

    if (
      StockStartDate != '' && StockEndDate == '' ||
      StockStartDate == '' && StockEndDate != ''
    ) {
      
      setErrMsgDate('The two date fields are required')

    }else {

      if (
        StockSearchQuery != '' || 
        StockStartDate != '' && StockEndDate != '' || 
        StockSelectedStatus != 'null'
      ) {
        
        setSearchQuery(StockSearchQuery)
        setStartDate(StockStartDate)
        setEndDate(StockEndDate)
        setSelectedStatus(StockSelectedStatus)
        setSearchAction(true)
  
      }else{
        setSearchAction(false)
      }
  
      setErrMsgDate('')
      setCurrentPage(1)
      setReload(!Reload)

    }

  }

  const resetSearch = () => {

    setSearchAction(false)
    setStartDate('')
    setEndDate('')
    setSearchQuery('')
    setSelectedStatus('null')
    setStockStartDate('')
    setStockEndDate('')
    setStockSearchQuery('')
    setStockSelectedStatus('null')
    setCurrentPage(1)
    setReload(!Reload)

  }

  return (
    <div>
      <h1 className="text-primary_text mb-5 font-bold text-[19px] sm:text-[25px] ">
        Orders Management
      </h1>

      <div className="border rounded-xl border-gray-200 shadow-lg">
        <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
          <h2 className="text-primary_text font-semibold text-[22px]">
            Orders
          </h2>
        </div>

        <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 flex-wrap">
          
          <div className=''>
            <label className='mr-2 font-semibold'>Start Date</label>
            <input
              type="date"
              value={StockStartDate}
              onChange={(e) => setStockStartDate(e.target.value)}
              className="p-1 mr-2 rounded-md border border-gray-300 focus:border-primary_text outline-none"
            />
          </div>

          <div className=''>
            <label className='mr-2 font-semibold'>End Date</label>
            <input
              type="date"
              value={StockEndDate}
              onChange={(e) => setStockEndDate(e.target.value)}
              className="p-1 mr-2 rounded-md border border-gray-300 focus:border-primary_text outline-none"
            />
          </div>

          <div>
            <label className='mr-2 font-semibold'>Search</label>
            <input
              type="text"
              value={StockSearchQuery}
              onChange={(e) => runUseEffectForSearch(e)}
              className="p-1 rounded-md border border-gray-300 focus:border-primary_text outline-none"
            />
          </div>

          <div className=''>
            <label className='font-semibold mr-2'>Status</label>
            <select
              defaultValue={StockSelectedStatus}
              className="p-1 mr-2 rounded-md focus:shadow-md focus:rounded-md border border-gray-300 focus:border-primary_text outline-none"
              onChange={(e) => setStockSelectedStatus(e?.target.value)}
            >
              <option 
                value='null'
                disabled
              >select a status</option>
              {
                Status?.map((item, index) => (
                  <option key={index} value={item.statut}>{item.statut}</option>
                ))
              }
            </select>
          </div>

          <div>
          
            <div className='flex items-center gap-2'>

              <button onClick={(e) => search(e)} className='text-white bg-second border border-second hover:opacity-90 font-semibold py-2 px-2 rounded-lg'><FaSearch/></button>
              <button onClick={(e) => resetSearch(e)} className='text-second  hover:bg-second hover:text-white font-semibold border border-second py-2 px-2 rounded-lg'><TbZoomReset /></button>
              
            </div>

            {
              ErrMsgDate && <p className='text-red-500 mt-3 font-semibold'>{ErrMsgDate}</p>
            }
            

          </div>

        </div>

        <div className='overflow-x-scroll hide-scrollbar relative'>
          
          {IsLoading && <Loading />}
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 text-center px-2 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Number
                </th>
                <th className="py-4 text-center px-2 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Price
                </th>
                <th className="py-4 text-center px-2 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Quantity
                </th>
                <th className="py-4 text-center px-2 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Status
                </th>
                <th className="py-4 text-center px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Date
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Action
                </th>
              </tr>
            </thead>
            <tbody
              className={`relative ${
                IsLoading || errorMessage ? "h-[34vh]" : ""
              }`}
            >
              {!IsLoading && errorMessage && (
                <tr className="absolute text-[21px] text-red-500 font-bold -translate-y-[50%] text-center w-full left-0 top-[50%]">
                  <td className="text-center w-[1440px]">{errorMessage}</td>
                </tr>
              )}
              {!IsLoading &&
                Orders.length > 0 &&
                Orders?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-200">
                    <td className="py-4 text-center px-2 border-b border-grey-light">
                      {item.ref}
                    </td>
                    <td className="py-4 text-center px-2 border-b border-grey-light">
                      {Math.round(item.total_price * 100) / 100}
                    </td>
                    <td className="py-4 text-center px-2 border-b border-grey-light">
                      {item.quantity}
                    </td>
                    {
                      item.received ? 
                      <td className="py-4 text-center px-2 border-b border-grey-light">
                        {item.status} <span className=' text-green-500'>Confirmed</span>
                      </td>
                      :
                      <td className="py-4 text-center px-2 border-b border-grey-light">
                        {item.status} {!item.received && item.part === 4 ? <span className=' text-red-500'>Not Confirmed</span> : ''} 
                      </td>
                    }
                    <td className="py-4 text-nowrap text-center px-2 border-b border-grey-light">
                      {item.created_at.slice(0, 10)}
                    </td>
                    <td className="py-4 border-b border-grey-light">
                      <button
                        onClick={() => prepareToUpdateOrShow(item.id, "show")}
                      >
                        <FaEye className="hover:text-second" fontSize={22} />
                      </button>
                      {
                        !item.received &&
                        <button
                          onClick={() => prepareToUpdateOrShow(item.id, "update")}
                          className="ml-4 mr-3"
                        >
                          <FaEdit className="hover:text-second" fontSize={22} />
                        </button>
                      }
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

        </div>
        {
          (!IsLoading && totalPages > 0) && (
            <div className="border-b p-5 border-gray-300 px-3 flex items-center gap-4 justify-center">
          <ol className="flex justify-center gap-1 text-[16px] font-medium">
            <li>
              <button
                onClick={() => goToPreviousPage()}
                className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
              >
                <span className="sr-only">Prev Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>

            {renderPages(currentPage, totalPages)}
            <li>
              <button
                onClick={() => goToNextPage()}
                className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
              >
                <span className="sr-only">Next Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ol>
            </div>
          )
        }
      </div>

      {ShowModalUpdate && (
        <OrderM
          closeModal={setShowModalUpdate}
          header="Update Order"
          action="update"
          order={OrderInfo}
          setOrders={setOrders}
        />
      )}
      {ShowModalShow && (
        <OrderM
          closeModal={setShowModalShow}
          header="Show Order"
          action="show"
          order={OrderInfo}
        />
      )} 
    </div>
  )
}

export default OrdersManagement