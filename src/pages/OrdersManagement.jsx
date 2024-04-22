import React, { useEffect, useState } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa';
import Axios from '../assets/constants/axios/axios';
import { Loading, OrderM } from '../components';
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { useStateContext } from '../context/StateContext';
import { useFunctionsContext } from '../context/FunctionsContext';

const OrdersManagement = () => {

  const {goToPreviousPage, goToNextPage, goToPage, PrepareArrayItems, setCurrentPage, currentPage, totalPages, setitemsPerPage} = useFunctionsContext()
  const {Orders, setOrders, FilteredOrders, setFilteredOrders} = useStateContext()

  const [RunOneTime, setRunOneTime] = useState(true);

  const [IsLoading, setIsLoading] = useState(true);
  const [errorMessage, seterrorMessage] = useState("");
  
  const [currentOrders, setcurrentOrders] = useState([]);

  const [SearchQuery, setSearchQuery] = useState('');
  const [SearchDate, setSearchDate] = useState('');

  const [OrderInfo, setOrderInfo] = useState({})

  const [ShowModalUpdate, setShowModalUpdate] = useState(false);
  const [ShowModalShow, setShowModalShow] = useState(false);

  useEffect(() => {

    (async()=>{

      // run just in reload page
      if (RunOneTime) {

        setIsLoading(true);

        try {
          
          const res = await Axios.get("/archive-orders")

          if (res.status === 200) {
            if (res.data.data.length > 0) {
              setOrders(res.data.data);
              setFilteredOrders(res.data.data);
              setCurrentPage(1)
              setitemsPerPage(5)
            } else {
              seterrorMessage("No Orders Exists");
            }
          }

        } catch (error) {
          seterrorMessage("Something Wrong! Try Again");
        }

        setIsLoading(false)
        setRunOneTime(false);

      }

    })()

    PrepareArrayItems(FilteredOrders, setcurrentOrders);

  }, [currentPage, Orders, RunOneTime, FilteredOrders]);

  const dataFilter = (e) => {

      setSearchQuery(e.target.value)
      
      let filteredData = [];
      
      if(SearchDate === '' || e.target?.dateValue === ''){
        
        filteredData = Orders.filter(item =>
          (item.id).toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.status.toLowerCase().includes(e.target.value.toLowerCase()) ||
          parseInt(item.price) === parseInt(e.target.value)||
          parseInt(item.quantity) === parseInt(e.target.value)
        );

      }else{
        
        filteredData = FilteredOrders.filter(item =>
          (item.id).toString().toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.status.toLowerCase().includes(e.target.value.toLowerCase()) ||
          parseInt(item.price) === parseInt(e.target.value)||
          parseInt(item.quantity) === parseInt(e.target.value)
        );

      }
      
      // when the search input empty return all product 
      if (e.target.value ==='') {

        if (SearchDate === '') {
          setFilteredOrders(Orders)
        }else{
          dataFilterByDate({target : {value : SearchDate, queryValue : ''}})
        }

      }else{

        setFilteredOrders(filteredData)
        goToPage(1)

      }

  }

  const dataFilterByDate = (e) => {

    setSearchDate(e.target.value)

    let filteredData = [];

    if (SearchQuery === '' || e.target?.queryValue === '') {
      
      filteredData = Orders.filter(item =>
        item.date === e.target.value
      );

    }else{

      filteredData = FilteredOrders.filter(item =>
        item.date === e.target.value
      );

    }
    
    // when the search input empty return all product 
    if (e.target.value ==='') {
        
      if (SearchQuery === '') {
        setFilteredOrders(Orders)
      }else{
        dataFilterByDate({target : {value : SearchQuery}})
      }

    }else{

      setFilteredOrders(filteredData)
      goToPage(1)

    }

  }

  const prepareToUpdateOrShow = async (OrderID, action) => {

    try {
      
      const res = await Axios.get('/archive-orders/' + OrderID)

      if (res.status === 200) {
            
        setOrderInfo(res.data);
        
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

  const resetDateInput = () => {

    setSearchDate('')

    if (SearchQuery === '') {

      setFilteredOrders(Orders)

    }else{
      
      dataFilter({target : {value : SearchQuery, dateValue : ''}})

    }

  }

  return (
    <div>
      <h1 className="text-[#324d67] mb-5 font-bold text-[19px] sm:text-[25px] ">
        Orders Management
      </h1>

      <div className="border rounded-xl border-gray-200 shadow-lg">
        <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
          <h2 className="text-[#324D67] font-semibold text-[22px]">
            Orders
          </h2>
        </div>

        <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 justify-between flex-wrap">
          
          <div className=''>
            <label className='mr-2'>Filter By Date : </label>
            <input
              type="date"
              value={SearchDate}
              onChange={(e) => dataFilterByDate(e)}
              className="p-1 mr-2 rounded-md border border-gray-300 focus:border-[#324D67] outline-none"
            />
            <button onClick={() => resetDateInput()}><IoMdCloseCircleOutline/></button>
          </div>

          <div>
            <label>Search : </label>
            <input
              type="text"
              value={SearchQuery}
              onChange={(e) => dataFilter(e)}
              className="p-1 rounded-md border border-gray-300 focus:border-[#324D67] outline-none"
            />
          </div>

        </div>

        <div className='overflow-x-scroll hide-scrollbar relative'>
          
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
              {IsLoading && <Loading />}
              {!IsLoading && errorMessage && (
                <p className="absolute text-[21px] text-second font-bold -translate-y-[50%] text-center w-full left-0 top-[50%]">
                  {errorMessage}
                </p>
              )}
              {!IsLoading &&
                currentOrders.length > 0 &&
                currentOrders?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-200">
                    <td className="py-4 text-center px-2 border-b border-grey-light">
                      {item.id}
                    </td>
                    <td className="py-4 text-center px-2 border-b border-grey-light">
                      {item.total_price}
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
                    <td className="py-4 text-center px-2 border-b border-grey-light">
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

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (item) => (
                <li key={item}>
                  <button
                    onClick={() => goToPage(item)}
                    href="#"
                    className={`block ${
                      currentPage === item
                        ? "border-second bg-second text-white"
                        : "border-gray-100 bg-white text-gray-900"
                    } size-8 rounded border text-center leading-8 `}
                  >
                    {item}
                  </button>
                </li>
              )
            )}
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
      </div>

      {ShowModalUpdate && (
        <OrderM
          closeModal={setShowModalUpdate}
          header="Update Order"
          action="update"
          order={OrderInfo}
          setFilteredOrders={setFilteredOrders}
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