import React, { useEffect, useState } from 'react'
import Axios from '../assets/constants/axios/axios'
import { CiCircleChevLeft } from 'react-icons/ci'
import { NavLink, useParams } from 'react-router-dom'
import {SearchBar, Loading, Product} from '../components'
import { useFunctionsContext } from '../context/FunctionsContext'

const Search = () => {

    const {goToPreviousPage, goToNextPage, goToPage, PrepareArrayItems, currentPage, totalPages, setitemsPerPage} = useFunctionsContext()
    const [Products, setProducts] = useState([])
    const {query} = useParams()
    const [IsLoading, setIsLoading] = useState(true)
    const [RunOneTime, setRunOneTime] = useState(true)
    const [Error, setError] = useState('')
  
    const [currentProducts, setcurrentProducts] = useState([]);

    useEffect(() => {
      
      (async()=>{

        if (RunOneTime) {

          setIsLoading(true)
    
          try {
            
            const res = await Axios.get('/products-search/' + query)
            if (res.status === 200) {
              
              setProducts(res.data.data)
    
            }

          } catch (error) {
            setError('Something Wrong! Try Again')
          }
  
          setIsLoading(false)
          setRunOneTime(false);
          
        }

      })()

        setitemsPerPage(20)
        PrepareArrayItems(Products, setcurrentProducts)
      
    }, [currentPage, Products, RunOneTime, query])
  
    return (
      <div>
        <div className='flex md:hidden mt-4 border-b w-full border-[#324D67]'>
            <SearchBar/>
        </div>
        <div className=" text-start mt-7 mb-10 mx-0 text-[#324d67]">
            <NavLink to='/' className='mb-2 font-semibold text-gray-500 flex items-center gap-1'><CiCircleChevLeft color='black'/> Back Home</NavLink>
            <h2 className='text-[20px] sm:text-[30px] font-[600]'>Search About : <span className='text-second font-bold'>{query} </span> <span className='text-gray-400 font-normal text-[18px]'><i>({Products.length} Results)</i></span></h2>
        </div>
  
        <div className='flex justify-center flex-wrap gap-[16px] mt-5 w-full'>
  
          {
            IsLoading && <Loading/>
          }
  
          {
            currentProducts.length > 0 && !IsLoading && currentProducts.map((item) => <Product product={item}/>)
          }
  
          {
            currentProducts.length === 0 && Error === '' && !IsLoading  && <p className=' text-[#324d67] font-[700] text-center text-[1.3em]'>No Products Existing</p>
          }
  
          {
            Error !== '' && !IsLoading && <p className=' text-second font-[700] text-center text-[1.3em]'>{Error}</p>
          }
      
          
        </div>
        <div className=" p-5 px-3 flex items-center gap-4 justify-center">
              
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
    )
}

export default Search