import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdOutlineRestore } from "react-icons/md";
import Swal from "sweetalert2";
import Axios from "../assets/constants/axios/axios";
import Loading from "../components/Loading";
import { useFunctionsContext } from "../context/FunctionsContext";

const TrashedProducts = () => {

    const {goToPreviousPage, goToNextPage, setitemsPerPage, goToPage, PrepareArrayItems, setCurrentPage, currentPage, totalPages, itemsPerPage} = useFunctionsContext()
    const [IsLoading, setIsLoading] = useState(true)
    const [errorMessage, seterrorMessage] = useState('')

    const [RunOneTime, setRunOneTime] = useState(true)

    const [Products, setProducts] = useState([])
    const [FilteredProducts, setFilteredProducts] = useState([])
    const [currentProducts, setcurrentProducts] = useState([]);

    const [SearchQuery, setSearchQuery] = useState('');

    useEffect(()=>{

        (async()=>{

          // run just in reload page
          if (RunOneTime) {

            setIsLoading(true)

            try {

              const res =  await Axios.get('/trashed-products')
              if (res.status === 200) {
                    
                if (res.data.data.length > 0) {

                  setProducts(res.data.data)
                  setFilteredProducts(res.data.data)
                  setCurrentPage(1)
                  setitemsPerPage(5)
                }else{

                  seterrorMessage('No Products Exists')

                }
  
              }

            } catch (error) {
              seterrorMessage('Something Wrong! Try Again')
            }
            
            setIsLoading(false)
            setRunOneTime(false)
        
          }

        })()
        
        PrepareArrayItems(FilteredProducts, setcurrentProducts)

    }, [currentPage, Products, RunOneTime, FilteredProducts])

    const dataFilter = (e) => {

        setSearchQuery(e.target.value)
        
        const filteredData = Products.filter(item =>
          item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.category_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          parseInt(item.quantity) === parseInt(e.target.value)
        );
        
        // when the search input empty return all product 
        if (e.target.value ==='') {
          
          setFilteredProducts(Products)

        }else{

          setFilteredProducts(filteredData)
          goToPage(1)

        }

    }

    const restore = async (id) => {

      try {
        
        const res = await Axios.post('/trashed-products/restore/' + id)

        if (res.status === 200) {
                
          const updatedProducts = Products.filter((item) => 
              item.id !== id
          )
          
          if (updatedProducts.length === 0) {
              seterrorMessage('No Products Exists')
          }

          setProducts(updatedProducts)
          setFilteredProducts(updatedProducts)
          toast.success('Product Restored Successfully')

          if (currentPage === totalPages && currentProducts.length === 1) {
              
              goToPreviousPage()

          }

        }

      } catch (error) {
        console.log(error);
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

          try {
            
            const res = await Axios.delete('/trashed-products/delete/' + id)

            if (res.status === 200) {
                  
              const updatedProducts = Products.filter((item) => 
                  item.id !== id
              )
              
              if (updatedProducts.length === 0) {
                  seterrorMessage('No Products Exists')
              }

              setProducts(updatedProducts)
              setFilteredProducts(updatedProducts)
              toast.success('Product Deleted Successfully')

              if (currentPage === totalPages && currentProducts.length === 1) {
                  
                  goToPreviousPage()

              }

            }

          } catch (error) {
            console.log(error);
          }

        }
      })

    } 

  return (
    <div>
      <h1 className="text-[#324d67] mb-5 font-bold text-[19px] sm:text-[25px] ">
        Trashed Products
      </h1>

      <div className="border rounded-xl border-gray-200 shadow-lg">
        <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
          <h2 className="text-[#324D67] font-semibold text-[22px]">Products</h2>
        </div>

        <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 justify-end">
          <label>Search : </label>
          <input
            type="text"
            value={SearchQuery}
            onChange={(e) => dataFilter(e)}
            className="p-1 rounded-md border border-gray-300 focus:border-[#324D67] outline-none"
          />
        </div>

        <div className="overflow-x-scroll hide-scrollbar relative">
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
                  IsLoading && <Loading />
                }
                {
                  !IsLoading && errorMessage && <p className="absolute text-[21px] text-second font-bold -translate-y-[50%] text-center w-full left-0 top-[50%]">{errorMessage}</p>
                }
                {
                    !IsLoading && currentProducts.length > 0 && currentProducts?.map((item) => (
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

            {
                Array.from({length: totalPages}, (_, index) => index + 1)
                .map(item => (
                    <li key={item}>
                      <button
                        onClick={() => goToPage(item)}
                        href="#"
                        className={`block ${currentPage === item ? 'border-second bg-second text-white' : 'border-gray-100 bg-white text-gray-900'} size-8 rounded border text-center leading-8 `}
                      >
                        {item}
                      </button>
                    </li>
        
                ))
            }
            <li>
              <button
                onClick={()=>goToNextPage()}
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
    </div>
  )
}

export default TrashedProducts