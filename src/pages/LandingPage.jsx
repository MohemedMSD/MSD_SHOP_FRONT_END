import React, { lazy, useEffect, useState } from 'react'
import Axios from '../assets/constants/axios/axios'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { BiCategory } from 'react-icons/bi'
import { useFunctionsContext } from '../context/FunctionsContext'
import {Loading, Product} from '../components'


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import LazyLoad from 'react-lazyload'

const fetcher = url => Axios.get(url).then(res=>res.data);

const LandingPage = () => {

  const {goToPreviousPage, goToNextPage, goToPage, PrepareArrayItems, setCurrentPage, currentPage, totalPages, setitemsPerPage} = useFunctionsContext()
  
  const [Products, setProducts] = useState([])

  const [IsLoading, setIsLoading] = useState(true)
  const [Error, setError] = useState('')

  const [RunOneTime, setRunOneTime] = useState(true)

  const [currentProducts, setcurrentProducts] = useState([]);

  const [categoryIndex, setCategoryIndex] = useState(0);

  const [Categories, setCategories] = useState([])
  const [CategorySelected, setCategorySelected] = useState('')

  const [query, setquery] = useState('');

  const Navigate = useNavigate();

  useEffect(() => {
    (async ()=>{

    if (RunOneTime) {

        setIsLoading(true)

          try {

            const resCategory = await Axios.get('/categories');
            setCategories(resCategory.data)

          } catch (error) {

            console.log(error);

          }

          try {
            const res = await Axios.get('/products');
            if (res.status === 200) {
              
              setProducts(res.data.products)
              
              if (!localStorage.getItem('baseUrl')) {
                localStorage.setItem('baseUrl', res.data.baseUrl)
              }
  
              setCategorySelected('Best Selling Products')
              setitemsPerPage(20)
    
            }
  
          } catch (error) {
    
            setError('Something Wrong! Try Again')
  
          }

        setIsLoading(false)


      setRunOneTime(false);

    }

    })()

    setCurrentPage(1)
    PrepareArrayItems(Products, setcurrentProducts)
    
  }, [currentPage, Products, RunOneTime])

  const search = (query) => {
    if (query !== '') {
      Navigate('/products/search/' + query)
      window.location.reload()
    }
  }

  const category = async (category) => {
    
    let route;

    if (category.name === 'BS') {

      route = '/products';
      setCategorySelected('Best Selling Products')
      setCategoryIndex(0)

    }else {

      route = '/products-category/' + category.id
      setCategorySelected(category.name)
      setCategoryIndex(category.id)

    }
    
    const res = await  Axios.get(route)
    
    if (res.status === 200) {
      
      setProducts(res.data.products)

    }else{

      console.log(res);

    }

  }

  return (
    <div>
      <div className='flex md:hidden mt-4 border-b w-full border-[#324D67]'>
          <input type='text' onChange={(e) => setquery(e.target.value)} className='w-full py-1 px-2 focus:outline-none focus:border-[#324D67]' placeholder='Search'/>
          <button><FaSearch onClick={() => search(query)} fontSize={23}/></button>
      </div>

      <div className='flex flex-col sm:gap-4'>

        <div className='hidden flex-col sm:w-[25%] lg:w-[20%] xl:w-[14%] mt-5 p-2'>
          <h3 className='font-bold text-second text-[20px] mb-2'>Categories </h3>
          <button onClick={() => category({name : 'BS'})} className={`${categoryIndex === 0 ? 'active' : ''} text-[18px] capitalize p-2 text-[#324D67] text-start font-semibold`}>
                {'>Best Selling'}
          </button>
          {
            Categories?.map((item, index) => (
              <button key={index} onClick={() => category(item)} className={`${categoryIndex === item.id ? 'active' : ''} text-[18px] capitalize p-2 text-[#324D67] text-start font-semibold`}>
                {'>'+item.name}
              </button>
            ))
          }
        </div>

        <Swiper
            spaceBetween={15}
            slidesPerView= 'auto'
            style={{zIndex : 0}}
            className='flex w-[100%] flex-col sm:px-5 xl:px-28 overflow-x-scroll hide-scrollbar gap-4 mt-10 p-2'>
          <div
            className='flex items-center gap-4'>
            <SwiperSlide style={{minWidth : '180px', maxWidth : '180px', width : '180px', height : '100px', zIndex: "-1"}} className={`relative ${categoryIndex === 0 ? 'scale-95 sm:scale-100 bg-slate-400' : ''} cursor-pointer rounded-lg category-box overflow-hidden`}>
              <div onClick={() => category({name : 'BS'})} className={`text-[18px] bg-gray-300 capitalize border w-full h-full rounded-lg p-2 border-[#324D67] text-[#324D67] text-center font-semibold`}>
                <BiCategory fontSize={90} className='absolute text-white top-[50%] opacity-35 -translate-y-[50%] -translate-x-[50%] left-[50%] rounded-t-lg'/>
                <p className={`backdrop-blur-xl absolute bottom-0  ${categoryIndex !== 0 ? 'sm:translate-y-[100%]' : 'translate-y-[100%] sm:translate-y-0'} hover:translate-y-0 transition-transform text-[20px] rounded-b-lg px-2 pb-[2px] left-0 text-white font-semibold text-center capitalize w-full`}>Best Selling</p>
              </div>
            </SwiperSlide>
            {Categories?.map(item => (
                item.numbre_products > 0 && (
                  <SwiperSlide key={item.id} style={{minWidth : '180px', maxWidth : '180px', Width : '180px', height : '100px', zIndex: "-1"}} className={`relative ${categoryIndex === item.id ? 'scale-95 sm:scale-100 bg-slate-400' : ''} cursor-pointer rounded-lg category-box overflow-hidden min-w-[180px] w-[180px] h-[100px]`}>
                    <div onClick={() => category(item)} className={` ${!item.image && 'bg-gray-300'} text-[18px] capitalize border w-full h-full rounded-lg p-2 border-[#324D67] text-[#324D67] text-center font-semibold`}>
                      {
                        item.image ?
                          <LazyLoad>
                            <img src={localStorage.getItem('baseUrl') + '/uploads/' + item.image} loading='lazy' className={`absolute top-0 ${categoryIndex === item.id && 'opacity-70'} right-0 w-full h-full rounded-lg`}/>
                          </LazyLoad>
                        :
                          <BiCategory fontSize={90} className='absolute text-white top-[50%] opacity-35 -translate-y-[50%] -translate-x-[50%] left-[50%] rounded-lg'/>
                      }
                      
                    </div>
                    <p className={` backdrop-blur-xl absolute bottom-0  ${categoryIndex !== item.id ? 'sm:translate-y-[100%]' : 'translate-y-[100%] sm:translate-y-0'} hover:translate-y-0 transition-transform text-[20px] rounded-b-lg px-2 pb-[2px] text-white font-semibold text-center capitalize w-full`}>{item.name}</p>
                  </SwiperSlide>
                )
              ))
            }
          </div>

        </Swiper>

        
        <div className=" text-center my-5 mx-0 text-[#324d67]">
          <h2 className='text-[30px] sm:text-[40px] capitalize font-[800]'>{CategorySelected}</h2>
        </div>

        
        <div className='w-full'>
          <div className='flex justify-center flex-wrap gap-[16px] mt-0 pt-4  w-full'>

            {
              IsLoading && <Loading/>
            }

            {
              currentProducts.length > 0 && !IsLoading && currentProducts.map((item) => <Product key={item.id} product={item}/>)
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

      </div>

    </div>
  )
}
export default LandingPage
