import React, { useEffect } from 'react'
import { useState } from 'react';
import { useFunctionsContext } from '../context/FunctionsContext';
import { Loading, DiscountM } from '../components';
import { FaEdit, FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import Axios from '../assets/constants/axios/axios';
import Swal from 'sweetalert2';
import { TbZoomReset } from 'react-icons/tb';
import toast from 'react-hot-toast';

const DiscountsManagements = () => {

    const {
      goToPreviousPage, 
      goToNextPage, 
      goToPage, 
      settotalPages, 
      totalPages, 
      renderPages
    } = useFunctionsContext()
    
    const [Discounts, setDiscounts] = useState([])

    const [Reload, setReload] = useState(true);

    const [IsLoading, setIsLoading] = useState(true);
    const [errorMessage, seterrorMessage] = useState("");

    const [StockSearchQuery, setStockSearchQuery] = useState('');
    const [StockSearchDate, setStockSearchDate] = useState('');
    const [StockSelectedStatus, setStockSelectedStatus] = useState('null')

    const [SearchQuery, setSearchQuery] = useState('');
    const [SearchDate, setSearchDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('null')

    const [currentPage, setCurrentPage] = useState(1)

    const [SearchAction, setSearchAction] = useState(0)

    const [DiscountInfo, setDiscountInfo] = useState({})

    const [ShowModalUpdate, setShowModalUpdate] = useState(false);
    const [ShowModalCreate, setShowModalCreate] = useState(false);
    const [ShowModalShow, setShowModalShow] = useState(false);

    useEffect(()=>{
      
      (async()=>{

        setIsLoading(true);
        
        let res;

        try {

          if (SearchAction) {
            
            res = await Axios.get(`/discount/search/${SearchQuery || 'null'}/${SearchDate || 'null'}/${selectedStatus || 'null'}/${currentPage}`);

          }else{
            
            res = await Axios.get("/discount/" + currentPage);
            
          }
          
          if (res.status === 200) {

              if (res.data.discounts.length > 0) {

                setDiscounts(res.data.discounts);
                settotalPages(res.data.total_pages)
                seterrorMessage('')

              } else {

                seterrorMessage("No Discounts Exists");
                setDiscounts([]);
                settotalPages(0)

              }

          }

        } catch (error) {
          setDiscounts([]);
          settotalPages(0)
          seterrorMessage("Something Wrong! Try Again");
        }

        setIsLoading(false)

      })()

    }, [Reload, currentPage])

    const prepareToUpdateOrShow = async (DiscountID, action) => {

        try {
        
        const res = await Axios.get('/discount/show/' + DiscountID)

        if (res.status === 200) {
            
            if (action === 'update') {
              setShowModalUpdate(true)
              setDiscountInfo({
                ...res.data.discount,
                id : DiscountID
              });
            }else if(action === 'show'){
              setDiscountInfo(res.data.discount);
              setShowModalShow(true)
            }
                
        }

        } catch (error) {
        console.log(rej);
        }

    }

    const deleteDiscount = (DiscountID) => {

      Swal.fire({
        title : 'Are you sure to delete this item ?',
        showCancelButton : true,
        showConfirmButton : true,
        confirmButtonText : 'Yes',
        text : 'if you delete this discount, it will be removing it from all products',
        icon : 'warning'
      })
      .then(async(response) => {

        if (response.isConfirmed) {
          toast.loading('Processing...')

          try {

            const res = await Axios.post('/discount/' + DiscountID,
            {
              _method : 'DELETE'
            })
            if (res.status === 200) {
              
              const updatedDiscounts = Discounts.filter((item) => 
                item.id !== DiscountID
              )

              if (updatedDiscounts.length == 0) {
                
                goToPreviousPage(setCurrentPage)

              }else{

                setReload(!Reload)

              }

              toast.dismiss()
              toast.success('Discount Deleted Successfully')

            }

          } catch (rej) {
            
            toast.dismiss()
            toast.error('Something wrong, please try again')

          }

        }

      })

    }

    const runUseEffectForSearch = (e) => {

      const regex = /^[\w\s\-\_\=\+]+$/
      if (regex.test(e.target.value) || e.target.value == '') {
        
        setStockSearchQuery(e.target.value)

      }

    }

    const search = () => {

      if (
        StockSearchQuery != '' || 
        StockSearchDate != '' || 
        StockSelectedStatus != 'null'
      ) {
        
        setSearchQuery(StockSearchQuery)
        setSearchDate(StockSearchDate)
        setSelectedStatus(StockSelectedStatus)
        setSearchAction(true)

      }else{
        setSearchAction(false)
      }
  
      setCurrentPage(1)
      setReload(!Reload)

    }

    const resetSearch = () => {

      setSearchAction(false)
      setSearchDate('')
      setSearchQuery('')
      setSelectedStatus('null')
      setStockSearchDate('')
      setStockSearchQuery('')
      setStockSelectedStatus('null')
      setCurrentPage(1)
      setReload(!Reload)
  
    }

    return (
        <div>
          <h1 className="text-primary_text mb-5 font-bold text-[19px] sm:text-[25px] ">
            Discounts Management
          </h1>
    
          <div className="border rounded-xl border-gray-200 shadow-lg">
            <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
              <h2 className="text-primary_text font-semibold text-[22px]">
                Discounts
              </h2>
                <button
                    onClick={() => setShowModalCreate(true)}
                    className="bg-second rounded-lg text-white font-semibold p-2"
                >
                    Add Discount
                </button>
            </div>
    
            <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 flex-wrap">
          
              <div className=''>
                <label className='mr-2 font-semibold'>Filter By Date</label>
                <input
                  type="date"
                  value={StockSearchDate}
                  onChange={(e) => setStockSearchDate(e.target.value)}
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
                  className="p-1 mr-2 rounded-md focus:shadow-md focus:rounded-md border border-gray-300 focus:border-primary_text outline-none"
                  defaultValue={StockSelectedStatus}
                  onChange={(e) => setStockSelectedStatus(e?.target.value)}
                >
                  <option 
                    value='null'
                    disabled
                  >select a status</option>
                  <option value={0}>Disable</option>
                  <option value={1}>Enable</option>
                </select>
              </div>

              <div className='flex items-center gap-2'>

                <button onClick={(e) => search(e)} className='text-white bg-second border border-second hover:opacity-90 font-semibold py-2 px-2 rounded-lg'><FaSearch/></button>
                <button onClick={(e) => resetSearch(e)} className='text-second  hover:bg-second hover:text-white font-semibold border border-second py-2 px-2 rounded-lg'><TbZoomReset /></button>
                
              </div>

            </div>
    
            <div className='overflow-x-scroll hide-scrollbar relative'>
              
            {IsLoading && <Loading />}
              <table className="text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 text-center px-2 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                      Title
                    </th>
                    <th className="py-4 text-center px-2 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                      Start date
                    </th>
                    <th className="py-4 text-center px-2 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                      End Date
                    </th>
                    <th className="py-4 text-center px-2 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                      Status
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={` ${
                    IsLoading || errorMessage ? "h-[34vh]" : ""
                  }`}
                >
                  {!IsLoading && errorMessage && (
                    <tr className="absolute text-[21px] text-red-500 font-bold -translate-y-[50%] text-center w-full left-0 top-[50%]">
                      <td className="text-center w-[1440px]">{errorMessage}</td>
                    </tr>
                  )}
                  {!IsLoading &&
                    Discounts.length > 0 &&
                    Discounts?.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-200">
                        <td className="py-4 text-center px-2 border-b border-grey-light">
                          {item.title}  
                        </td>
                        <td className="py-4 text-center px-2 border-b border-grey-light">
                          {item.start_date}
                        </td>
                        <td className="py-4 text-center px-2 border-b border-grey-light">
                          {item.end_date}
                        </td>
                        {
                          item.active ? 
                          <td className="py-4 text-center text-green-500 px-2 border-b border-grey-light">
                            enable
                          </td>
                          :
                          <td className="py-4 text-center text-red-500 px-2 border-b border-grey-light">
                            disable
                          </td>
                        }
                        <td className="py-4 border-b border-grey-light">
                          <button
                            onClick={() => prepareToUpdateOrShow(item.id, "show")}
                          >
                            <FaEye className="hover:text-second" fontSize={22} />
                          </button>
                          <button
                            onClick={() => prepareToUpdateOrShow(item.id, "update")}
                            className="ml-4 mr-3"
                          >
                            <FaEdit className="hover:text-second" fontSize={22} />
                          </button>
                          <button
                            onClick={() => deleteDiscount(item.id)}
                            className=""
                          >
                            <FaTrash className="hover:text-second" fontSize={22} />
                          </button>
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
                    onClick={() => goToPreviousPage(setCurrentPage)}
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
    
                {renderPages(currentPage, totalPages, setCurrentPage)}
                <li>
                  <button
                    onClick={() => goToNextPage(setCurrentPage)}
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

          {ShowModalCreate && (
            <DiscountM
              closeModal={setShowModalCreate}
              header="Create Discount"
              action="create" 
              discount={DiscountInfo}
              setReload={setReload}
              setCurrentPage={setCurrentPage}
              setDiscounts={setDiscounts}
              Discounts={Discounts}
            />
          )}
          {ShowModalUpdate && (
            <DiscountM
              closeModal={setShowModalUpdate}
              header="Update Order"
              action="update"
              discount={DiscountInfo}
              setReload={setReload}
              setDiscounts={setDiscounts}
              setCurrentPage={setCurrentPage}
              Discounts={Discounts}
            />
          )}
          {ShowModalShow && (
            <DiscountM
              closeModal={setShowModalShow}
              header="Show Order"
              action="show"
              discount={DiscountInfo}
            />
          )} 
        </div>
      )
}

export default DiscountsManagements