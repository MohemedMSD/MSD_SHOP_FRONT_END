import React, { useEffect, useState } from 'react'
import Axios from '../assets/constants/axios/axios'
import { CiCircleChevLeft } from 'react-icons/ci'
import { NavLink, useParams } from 'react-router-dom'
import {SearchBar, Loading, Product} from '../components'
import { useFunctionsContext } from '../context/FunctionsContext'

const Search = () => {

    const {goToPreviousPage, goToNextPage, totalPages, renderPages, settotalPages} = useFunctionsContext()
    const [Products, setProducts] = useState([])
    const {query} = useParams()
    const [IsLoading, setIsLoading] = useState(true)
    const [ProductFounded, setProductFounded] = useState(0)
    const [Error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(()=>{

      (async()=>{

        
        setIsLoading(true)
    
        try {
          
          if (query == '') {
            window.location.href = '/'
          }

          const res = await Axios.get(`/products-search/${query}/${currentPage}`)
          
          if (res.status === 200) {
            
            setProducts(res.data.products)
            settotalPages(res.data.total_pages)
            setProductFounded(res.data.ProductFounded)
  
          }

        } catch (error) {
          setError('Something Wrong! Try Again')
        }

        setIsLoading(false)

      })()

    }, [currentPage, query])
  
    return (
      <div>
        <div className='flex sm:hidden mt-4 border-b w-full border-primary_text'>
            <SearchBar query={query}/>
        </div>
        <div className=" text-start mt-7 mb-10 mx-0 text-primary_text">
            <NavLink style={{width : 'fit-content'}} to='/' className='mb-2 font-semibold text-gray-500 flex items-center gap-1'><CiCircleChevLeft color='black'/> Back Home</NavLink>
            <h2 className='text-[20px] sm:text-[30px] font-[600]'>Search About : <span className='text-second font-bold'>{query} </span> <span className='text-gray-400 font-normal text-[18px]'><i>({ProductFounded} Results)</i></span></h2>
        </div>
  
        <div className='flex justify-center flex-wrap gap-[16px] mt-5 w-full'>
  
          {
            IsLoading && <Loading/>
          }
  
          {
            Products.length > 0 && !IsLoading && Products.map((item) => <Product product={item}/>)
          }
  
          {
            Products.length === 0 && Error === '' && !IsLoading  && <p className=' text-primary_text font-[700] text-center text-[1.3em]'>No Products Existing</p>
          }
  
          {
            Error !== '' && !IsLoading && <p className=' text-red-500 font-[700] text-center text-[1.3em]'>{Error}</p>
          }
      
          
        </div>

        {

          renderPages(currentPage, totalPages, setCurrentPage).length > 0 && 
          
            <div className=" p-5 px-3 flex items-center gap-4 justify-center">
                  
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

        }
      </div>
    )
}

export default Search