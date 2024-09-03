import React, { useEffect, useState } from 'react'
import { FaEdit, FaEye } from 'react-icons/fa';
import Axios from '../assets/constants/axios/axios';
import { Loading } from '../components';
import { IoMdCloseCircleOutline } from 'react-icons/io'
import OrderM from '../components/dashboard/modals/OrderM';
import { useStateContext } from '../context/StateContext';

const ArchiveOrders = () => {

  const [RunOneTime, setRunOneTime] = useState(true);

  const [Orders, setOrders] = useState([]);
  const [FilteredOrders, setFilteredOrders] = useState([]);

  const [IsLoading, setIsLoading] = useState(true);
  const [errorMessage, seterrorMessage] = useState("");
  
  const [currentOrders, setcurrentOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState();

  const [SearchQuery, setSearchQuery] = useState('');
  const [SearchDate, setSearchDate] = useState('');

  const [OrderInfo, setOrderInfo] = useState({})

  const [ShowModalShow, setShowModalShow] = useState(false);

  useEffect(() => {

    // run just in reload page
    if (RunOneTime) {

      setIsLoading(true);

      Axios.get("/archive-orders")
        .then((res) => {
          setIsLoading(false);

          if (res.status === 200) {
            if (res.data.length > 0) {
              setOrders(res.data);
              setFilteredOrders(res.data);
            } else {
              seterrorMessage("No Orders Exists");
            }
          }
        })
        .catch((rej) => {
          setIsLoading(false);
          seterrorMessage("Something Wrong! Try Again");
        });

      setRunOneTime(false);

    }

    const itemsPerPage = 5; // Adjust this value based on your requirements

    // Calculate the total number of pages
    const total_pages = Math.ceil(FilteredOrders.length / itemsPerPage);

    settotalPages(total_pages);

    // Slice the list of products to display only the items for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // set Products do listed in One page
    setcurrentOrders(FilteredOrders.slice(startIndex, endIndex));
  }, [currentPage, Orders, RunOneTime, FilteredOrders]);
  
  const goToPreviousPage = () => {
      setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
      setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const goToPage = (page) => {

      if(page > currentPage){

          setCurrentPage(prevPage => Math.min(prevPage + page - currentPage, totalPages));

      }else if (page < currentPage) {

          let pageNumber = currentPage - page
          setCurrentPage(prevPage => Math.min(prevPage - pageNumber, totalPages));

      }

  };

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

  const prepareToShow = (OrderID, action) => {

    Axios.get('/archive-orders/' + OrderID)
    .then((res) => {
        
      if (res.status === 200) {
            
        setOrderInfo(res.data);
        
        setShowModalShow(true)
            
      }

    })
    .catch((rej) => console.log(rej))

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
      <h1 className="text-primary_text mb-5 font-bold text-[19px] sm:text-[25px] ">
        Archive Orders
      </h1>

      <div className="border rounded-xl border-gray-200 shadow-lg">
        <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
          <h2 className="text-primary_text font-semibold text-[22px]">
            Orders
          </h2>
        </div>

        <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 justify-between">
          
          <div className='flex items-center gap-2'>
            <label>Filter By Date : </label>
            <input
              type="date"
              value={SearchDate}
              onChange={(e) => dataFilterByDate(e)}
              className="p-1 rounded-md border border-gray-300 focus:border-primary_text outline-none"
            />
            <button onClick={() => resetDateInput()}><IoMdCloseCircleOutline/></button>
          </div>

          <div>
            <label>Search : </label>
            <input
              type="text"
              value={SearchQuery}
              onChange={(e) => dataFilter(e)}
              className="p-1 rounded-md border border-gray-300 focus:border-primary_text outline-none"
            />
          </div>

        </div>

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
              <p className="absolute text-[21px] text-red-500 font-bold -translate-y-[50%] text-center w-full left-0 top-[50%]">
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
                      onClick={() => prepareToShow(item.id, "show")}
                    >
                      <FaEye className="hover:text-second" fontSize={22} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

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

export default ArchiveOrders