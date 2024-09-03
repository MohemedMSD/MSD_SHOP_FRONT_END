import React from 'react'
import { NavLink } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const FooterBanner = ({bannerData, type}) => {

    const date = (start, end) => {

        const months = [
            'Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]

        const start_date = new Date(start);
        const end_date = new Date(end);

        const day_start_date = start_date.getDate();
        const month_start_date = start_date.getMonth();
        
        const day_end_date = end_date.getDate();
        const month_end_date = end_date.getMonth();

        return `${day_start_date} ${months[month_start_date]} To ${month_end_date} ${months[month_start_date]}`
    }

  return (

    type == 'discounts' 
    ?

        <div className='w-full grid grid-cols-1 items-center overflow-hidden lg:max-w-[1024px] lg:h-[430px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto'>
            <div className=' text-white relative rounded-3xl xl:h-[320px] bg-second px-2 sm:px-4 md:px-6 lg:px-6'>
                
                <Swiper 
                modules={[Autoplay]}
                autoplay={{
                        delay:3000,
                        disableOnInteraction : false
                        }} 
                        loop={true}
                    style={{overflow : 'unset', height:'100%'}}
                >

                    {
                        bannerData.map((item, index)=>(
                            <SwiperSlide key={index}>
                                <div className='flex justify-between flex-col lg:flex-row items-center h-full'>
                                    <div className='w-full z-10 lg:w-[66%] pt-6 px-6 sm:pt-8 sm:px-8 lg:px-6 pb-5 sm:pb-0 lg:pb-8'>
                                        <p className='text-lg font-semibold'>{item?.discount?.discount}% off</p>
                                        <h1 style={{
                                            lineHeight:1,
                                        }} className={`uppercase text-4xl sm:text-6xl font-bold`}>{item?.name}</h1>
                                        <p className='text-lg font-semibold'> {date(item?.discount?.start_date, item?.discount?.end_date)}</p>
                                    </div>
                                    <div className='w-full lg:w-[0%] h-full flex justify-center items-center'>
                                        <img src={item?.images} alt="Headphone" className='scale-110 sm:scale-125 md:scale-100 h-[250px] w-[250px] md:h-[380px] md:w-[380px] lg:h-[360px] lg:w-[360px] xl:h-[450px] xl:w-[450px] lg:absolute lg:left-[50%] lg:-translate-y-[50%] lg:top-[50%] lg:-translate-x-[50%]' />
                                    </div>
                                    <div className="flex w-full lg:w-[33%] flex-col justify-center gap-4 pb-6 px-6 sm:pb-8 sm:px-8 lg:px-6 pt-5 sm:pt-0 lg:pt-8">
                                        <p className="font-bold capitalize text-xl">{item?.category_name}</p>
                                        <p className="text-3xl sm:text-5xl font-bold">{item?.discount?.title}</p>
                                        <p className="text-md  tracking-wide leading-5">{item?.discount?.desc}</p>
                                        <NavLink to={`/products/${item?.id}`}>
                                            <button className="bg-white hover:opacity-90 font-semibold py-2 px-4 rounded-full text-second" >Shop Now</button>
                                        </NavLink>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }

                </Swiper>
                
                
            </div>
        </div>
    
    :

        <div className='w-full grid grid-cols-1 items-center overflow-hidden lg:max-w-[1024px] md:h-[430px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto'>
            <div className=' text-white relative rounded-3xl xl:h-[320px] bg-second px-2 sm:px-4 md:px-6 lg:px-6'>
                
                <Swiper 
                modules={[Autoplay]}
                autoplay={{
                        delay:3000,
                        disableOnInteraction : false
                        }} 
                        loop={true}
                    style={{overflow : 'unset', height:'100%'}}
                >

                    {
                        bannerData.map((item, index)=>(
                            <SwiperSlide key={index}>
                                <div className='flex justify-between flex-col md:flex-row items-center h-full'>
                                    
                                    <div className='w-full z-10 pt-6 px-6 sm:pt-8 sm:px-8 md:px-6 pb-5 sm:pb-0 md:pb-8'>
                                        <p className='text-xl mb-2 font-semibold text-center md:text-start'>Best Selling</p>
                                        <p className='text-4xl font-bold text-center md:text-start'>{item.category_name}</p>
                                        
                                        <h1 style={{
                                            lineHeight:1,
                                        }} className={`uppercase hidden md:block text-4xl sm:text-6xl font-bold`}>{item?.name}</h1>
                                        
                                        <div className='mt-5 hidden md:block'>
                                            <button className="bg-white hover:opacity-90 font-semibold py-2 px-4 rounded-full text-second" >Shop Now</button>
                                        </div>

                                    </div>

                                    <div className='w-full md:w-[0%] h-full flex justify-center items-center'>
                                        <img src={item?.images} alt="Headphone" className='scale-110 sm:scale-125 md:scale-100 h-[250px] w-[250px] md:h-[380px] md:w-[380px] lg:h-[360px] lg:w-[360px] xl:h-[450px] xl:w-[450px] md:absolute md:right-[2%] lg:right-[5%] md:-translate-y-[50%] md:top-[50%]' />
                                    </div>

                                    <div className='flex md:hidden w-full flex-col items-center justify-center gap-4 pb-6 px-6 sm:pb-8 sm:px-8 lg:px-6 pt-5 sm:pt-0 lg:pt-8'>
                                        <h1 style={{
                                            lineHeight:1,
                                        }} className={`uppercase text-center text-4xl sm:text-6xl font-bold`}>{item?.name}</h1>
                                        
                                        <NavLink to={`/products/${item?.id}`}>
                                            <button className="bg-white hover:opacity-90 font-semibold py-2 px-4 rounded-full text-second" >Shop Now</button>
                                        </NavLink>
                                    </div>

                                </div>
                            </SwiperSlide>
                        ))
                    }

                </Swiper>
                
                
            </div>
        </div>
  )
}

export default FooterBanner