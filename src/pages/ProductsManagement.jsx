import React, { useEffect, useState } from "react";
import { lazy } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const Swal = lazy(()=> import("sweetalert2"));
import Axios from "../assets/constants/axios/axios";
import {Loading ,ProductM} from "../components";
import { useFunctionsContext } from "../context/FunctionsContext";

const ProductsManagement = () => {

    const {dataFilter, SearchQuery, goToPreviousPage, goToNextPage, goToPage, PrepareArrayItems, currentPage, setCurrentPage, totalPages, itemsPerPage, setitemsPerPage} = useFunctionsContext()

    const [IsLoading, setIsLoading] = useState(true)
    const [errorMessage, seterrorMessage] = useState('')

    const [RunOneTime, setRunOneTime] = useState(true)

    const [Products, setProducts] = useState([])
    const [FilteredProducts, setFilteredProducts] = useState([])
    const [currentProducts, setcurrentProducts] = useState([]);

    const [ShowModalCreate, setShowModalCreate] = useState(false);
    const [ShowModalUpdate, setShowModalUpdate] = useState(false);
    const [ShowModalShow, setShowModalShow] = useState(false);

    const [ProductInfo, setProductInfo] = useState()

    const [baseUrl, setbaseUrl] = useState('')

    useEffect(()=>{

        (async()=>{

          // run just in reload page
          if (RunOneTime) {
  
            setIsLoading(true)
  
            try {
              
              const res = await Axios.get('/products-management');
              setIsLoading(false)
  
                if (res.status === 200) {
                  
                  if (res.data.products.length > 0) {
  
                    setProducts(res.data.products)
                    setFilteredProducts(res.data.products)
                    setCurrentPage(1)
                    setitemsPerPage(5)
  
                  }else{
  
                    seterrorMessage('No Products Exists')
  
                  }
    
                }
  
            } catch (error) {
              
              setIsLoading(false)
              seterrorMessage('Something Wrong! Try Again')
  
            }
  
            setRunOneTime(false)
        
          }

        })()

        PrepareArrayItems(FilteredProducts, setcurrentProducts)
        
    }, [currentPage, Products, RunOneTime, FilteredProducts])

    const prepareToUpdateOrShow = async (ProductID, action) => {

      try {

        const res = await Axios.get('/products-management/' + ProductID);
        
        if (res.status === 200) {
              
          setProductInfo(res.data.product);
          setbaseUrl(res.data.baseUrl)
          
          if (action === 'update') {
            setShowModalUpdate(true)
          }else if(action === 'show'){
            setShowModalShow(true)
          }
              
        }

      } catch (error) {
        
        console.log(error);

      }

    }

    const deleteProduct = (ProductID) => {

      Swal.fire({
        title : 'Are you sure to delete this item ?',
        showCancelButton : true,
        showConfirmButton : true,
        confirmButtonText : 'Yes',
        icon : 'warning'
      })
      .then(async(response) => {

        if (response.isConfirmed) {
          toast.loading('')

          try {

            const res = await Axios.delete('/products/' + ProductID)
            if (res.status === 200) {
              
              const updatedProducts = Products.filter((item) => 
                item.id !== ProductID
              )

              if (updatedProducts.length === 0) {
                seterrorMessage('No Products Existing')
              }
              
              setProducts(updatedProducts)
              setFilteredProducts(updatedProducts)

              if (currentPage === totalPages && currentProducts.length === 1) {
                
                goToPreviousPage()

              }

              toast.dismiss()
              toast.success('Product Deleted Successfully')

            }

          } catch (rej) {
            
            if (rej.response.status === 422) {
              
              toast.dismiss()
              Swal.fire({
                title : 'Note!',
                text : rej.response.data.message,
                icon : 'error'
              })

            }

          }

        }

      })

    }

  return (
    <div>
      <h1 className="text-[#324d67] mb-5 font-bold text-[19px] sm:text-[25px] ">
        Products Management
      </h1>

      <div className="border rounded-xl border-gray-200 shadow-lg">
        <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
          <h2 className="text-[#324D67] font-semibold text-[22px]">Products</h2>
          <button onClick={() => setShowModalCreate(true)} className="bg-second rounded-lg text-white font-semibold p-2">
            Add Product
          </button>
        </div>

        <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 justify-end">
          <label>Search : </label>
          <input
            type="text"
            value={SearchQuery}
            onChange={(e) => dataFilter(Products, setFilteredProducts, e.target.value)}
            className="p-1 rounded-md border border-gray-300 focus:border-[#324D67] outline-none"
          />
        </div>
        <div className="overflow-x-scroll hide-scrollbar relative">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
              <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  #
                </th>
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
            <tbody className={`${IsLoading || errorMessage ? 'h-[34vh]' : ''}`}>
              {
                IsLoading && <Loading />
              }
              {
                !IsLoading && errorMessage && <p className="absolute text-[21px] text-second font-bold -translate-y-[50%] text-center w-full left-0 top-[50%]">{errorMessage}</p>
              }
              {
                  !IsLoading && currentProducts.length > 0 && currentProducts?.map((item, i) => (
                      <tr key={item.id} className="hover:bg-gray-200">
                        <td className="py-4 px-6 border-b border-grey-light">{i + 1 + (itemsPerPage * (currentPage - 1))}</td>
                        <td className="py-4 px-6 border-b border-grey-light">{item.name}</td>
                        <td className="py-4 px-6 border-b border-grey-light text-center">{item.category_name}</td>
                        <td className="py-4 px-6 border-b border-grey-light text-center">{item.quantity}</td>
                        <td className="py-4 px-6 border-b border-grey-light">{item.price}</td>
                        <td className="py-4 border-b border-grey-light">
                          <button onClick={() => prepareToUpdateOrShow(item.id, 'show')}><FaEye className="hover:text-second" fontSize={22}/></button>
                          <button onClick={() => prepareToUpdateOrShow(item.id, 'update')} className="ml-4 mr-3"><FaEdit className="hover:text-second" fontSize={22}/></button>
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

      {ShowModalCreate && <ProductM seterrorMessage={seterrorMessage} closeModal={setShowModalCreate} header='Add Product' action="create" Products={Products} baseUrl={baseUrl} setProducts={setProducts} setFilteredProducts={setFilteredProducts} />}
      {ShowModalUpdate && 
        
          <ProductM seterrorMessage={seterrorMessage} closeModal={setShowModalUpdate} header='Update Product' action="update" product={ProductInfo} baseUrl={baseUrl} Products={Products} setProducts={setProducts} setFilteredProducts={setFilteredProducts}/>
        } 
      {ShowModalShow && <ProductM closeModal={setShowModalShow} header='Show Product' action="show" product={ProductInfo} baseUrl={baseUrl} />}
    </div>
  );
};

export default ProductsManagement;
