import React from 'react'
import { NavLink } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import {Autoplay} from 'swiper/modules'
import { useState } from 'react';

const Banner = ({bannerData}) => {
  
  const [bgColor, setBgColor] = useState( 
    bannerData[0] && typeof(bannerData[0]?.discount?.color) == 'string' 
    ? JSON.parse(bannerData[0]?.discount?.color) 
    : bannerData[0]?.discount?.color
  )
  
  const hundelChange = (swiper)=>{

    const color = bannerData[swiper] && typeof(bannerData[swiper]?.discount?.color) == 'string' 
    ? JSON.parse(bannerData[swiper]?.discount?.color) 
    : bannerData[swiper]?.discount?.color

    setBgColor(color)
    
  }

  return (
    <div style={{
      backgroundImage : `linear-gradient(to right, ${bgColor.from}, ${bgColor.to})`
    }} className={`w-full lg:max-w-[1024px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto rounded-3xl mt-4 py-7 sm:py-0 h-full sm:h-[550px] flex items-center px-2 sm:px-4 md:px-6 lg:px-10`}>

      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        onInit={() => hundelChange}
        onRealIndexChange={(swiper) => hundelChange(swiper.realIndex)}
        autoplay={{
          delay:3000,
          disableOnInteraction : false
        }} 
        loop={true}
        style={{zIndex : 0, height: '100%', width:'100%', overflow:'hidden'}}>
        
        {
          bannerData.map((item, index)=>(
            <SwiperSlide key={index} style={{width:'100% !important', maxWidth:'100%'}}>
              <div className='flex items-center relative self-center h-full'>
    
                <div className='flex flex-col justify-center items-center sm:items-start w-full overflow-x-hidden'>
                  <div className='w-[300px] h-[300px] sm:hidden items-center'>
                    <img src={item?.images} alt="Headphone" className='w-full h-full' />
                  </div>
                  <p className='text-[20px] sm:text-[22px] -mb-[10px] sm:ml-[10px] capitalize font-bold'>beats solo</p>
                  <h3 className='text-[2.3em] font-bold sm:text[2.6em] md:text-[2.8em] lg:text-[3.2em] xl:text-[4rem] mt-2 sm:mt-1 sm:-mb-[25px] md:-mb-[30px] lg:-mb-[40px] sm:ml-[5px] capitalize'>{item.category_name}</h3>
                  <h1 style={{lineHeight : 1,padding : '20px 0'}}  className='text-white text-[2.7em] w-full sm:text-[4.6em] md:text-[5em] lg:text-[6em] xl:text-[7em] font-bold uppercase text-wrap text-center sm:text-start z-10'>{item.name}</h1>
                  <div className='md:h-full'>
                  <NavLink to={`/products/${item.id}`}>
                    <button style={{ background: `${bgColor.button}`}} className={`b-none mt-4 sm:mt-0 sm:ml-[10px] cursor-pointer font-[500] text-[18px] rounded-xl px-[16px] py-[10px] text-white `}>Shop Now</button>
                  </NavLink>
                  </div>
                </div>
                <div className='sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] hidden sm:flex absolute sm:right-0 items-center'>
                  <img src={item?.images} alt="Headphone" className='w-full h-full -translate-y-1' />
                </div>
    
              </div>
            </SwiperSlide>
          ))
        }

      </Swiper>
      
    </div>
  )
}

export default Banner