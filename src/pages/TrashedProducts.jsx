import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import {TbZoomReset} from 'react-icons/tb'
import { MdDelete, MdOutlineRestore } from "react-icons/md";
import Swal from 'sweetalert2';
import Axios from "../assets/constants/axios/axios";
import Loading from "../components/Loading";
import { useFunctionsContext } from "../context/FunctionsContext";

const TrashedProducts = () => {

    const {goToPreviousPage, goToNextPage, totalPages, settotalPages, itemsPerPage, renderPages} = useFunctionsContext()

    const [IsLoading, setIsLoading] = useState(true)
    const [errorMessage, seterrorMessage] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const [RunOneTime, setRunOneTime] = useState(true)

    const [Products, setProducts] = useState([])

    // this state fill when change input's value and second state fill with 
    // first state in click on search
    const [StockSearchQuery, setStockSearchQuery] = useState('');
    const [SearchQuery, setSearchQuery] = useState('');

    const [Reload, setReload] = useState(false);
    const [SearchAction, setSearchAction] = useState(false);

    useEffect(()=>{

      (async()=>{

        setIsLoading(true)
  
        try {
          
          let res;

          if (SearchAction) {
            
            res = await Axios.get(`/trashed-products/search/${SearchQuery}/${currentPage}`);

          }else{
            
            res = await Axios.get('/trashed-products/' + currentPage);
            
          }
          setIsLoading(false)

            if (res.status == 200) {
              
              if (res.data.products.length > 0) {

                setProducts(res.data.products)
                settotalPages(res.data.total_pages)
                seterrorMessage('')

              }else{

                setProducts([])
                settotalPages(0)
                seterrorMessage('No Products Exists')

              }

            }

        } catch (error) {
          
          setIsLoading(false)
          setProducts([])
          settotalPages(0)
          seterrorMessage('Something Wrong! Try Again')

        }


      })()

    }, [currentPage, Reload])

    const restore = async (id) => {

      toast.loading('processing...')
      try {
        
        const res = await Axios.post('/trashed-products/restore/' + id)

        if (res.status === 200) {
                
          const updatedProducts = Products.filter((item) => 
              item.id !== id
          )
          
          if (updatedProducts.length == 0 && currentPage != 1) {

            goToPreviousPage(setCurrentPage)

          }else{

            setReload(!Reload)

          }

          toast.dismiss()
          toast.success('Product Restored Successfully')

        }

      } catch (error) {
        
        toast.dismiss()
        toast.error('Somethings wrong! please try again')

      }
        
    } 

    const deleteProduct = (id) => {
      Swal.fire({
        title : 'Are you sure to delete this item ?',
        showCancelButton : true,
        showConfirmButton : true,
        confirmButtonText : 'Yes',
        icon : 'warning'
      })
      .then(async (resS) => {

        if (resS.isConfirmed) {

          toast.loading('processing...')

          try {
            
            const res = await Axios.post('/trashed-products/delete/' + id,
            {
              _method : 'DELETE'
            })

            if (res.status === 200) {
              
              const updatedProducts = Products.filter((item) => 
                item.id !== id
              )

              if (updatedProducts.length == 0 && currentPage != 1) {

                goToPreviousPage(setCurrentPage)

              }else{

                setReload(!Reload)

              }

              toast.dismiss()
              toast.success('Product Deleted Successfully')

            }

          } catch (error) {
            
            toast.dismiss()
            toast.error('Somethings wrong! please try again')
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

    const ProductSearch = () => {

      setSearchAction(StockSearchQuery != '' ? true : false)
      setSearchQuery(StockSearchQuery != '' ? StockSearchQuery : '')
      setCurrentPage(1)
      setReload(!Reload)

    }

    const resetSearch = () => {
      setSearchAction(false)
      setSearchQuery('')
      setStockSearchQuery('')
      setCurrentPage(1)
      setReload(!Reload)
    }

  return (
    <div>
      <h1 className="text-primary_text mb-5 font-bold text-[19px] sm:text-[25px] ">
        Trashed Products
      </h1>

      <div className="border rounded-xl border-gray-200 shadow-lg">
        <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
          <h2 className="text-primary_text font-semibold text-[22px]">Products</h2>
        </div>

        <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 justify-end">
          <label>Search</label>
          <input
            type="text"
            value={StockSearchQuery}
            onChange={(e) => runUseEffectForSearch(e)}
            className="p-1 rounded-md border border-gray-300 focus:border-primary_text outline-none"
          />

          <div className="flex items-center gap-1">
            <button 
              onClick={() => ProductSearch()}
              className=" bg-second hover:opacity-90 transition-opacity border border-second text-white rounded-md p-2"
            ><FaSearch/>
            </button>

            <button 
              onClick={() => resetSearch()}
              className=" bg-white text-second border hover:text-white hover:bg-second transition-colors border-second rounded-md p-2"
            ><TbZoomReset/>
            </button>
          </div>

        </div>

        <div className="overflow-x-scroll hide-scrollbar relative">
          {
            IsLoading && <Loading />
          }
          <table className="text-left w-full border-collapse">
              <thead>
                <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Name
                  </th>
                  <th className="py-4 text-center px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Category
                  </th>
                  <th className="py-4 text-center px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Quantity
                  </th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Price
                  </th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className={`relative ${IsLoading || errorMessage ? 'h-[34vh]' : ''}`}>
        
                {
                  !IsLoading && errorMessage && 
                  <tr className="absolute text-[21px] text-red-500 font-bold -translate-y-[50%] text-center w-full left-0 top-[50%]">
                    <td className="text-center w-[1440px]">{errorMessage}</td>
                  </tr>
                }
                {
                    !IsLoading && Products.length > 0 && Products?.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-200">
                          <td className="py-4 px-6 border-b border-grey-light">{item.name}</td>
                          <td className="py-4 px-6 border-b border-grey-light text-center">{item.category_name}</td>
                          <td className="py-4 px-6 border-b border-grey-light text-center">{item.quantity}</td>
                          <td className="py-4 px-6 border-b border-grey-light">{item.price}</td>
                          <td className="py-4 border-b border-grey-light">
                            <button onClick={() => restore(item.id)} className="ml-4 mr-3"><MdOutlineRestore className="hover:text-second" fontSize={22}/></button>
                            <button onClick={() => deleteProduct(item.id)} ><MdDelete className="hover:text-second" fontSize={22}/></button>
                          </td>
                        </tr>
                    ))
                }
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

                {
                    renderPages(currentPage, totalPages, setCurrentPage)
                }
                <li>
                  <button
                    onClick={()=>goToNextPage(setCurrentPage)}
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
    </div>
  )
}

export default TrashedProducts