import React from 'react'
import { useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { IoMdCloseCircleOutline } from 'react-icons/io'

const ReviewImages = ({images, closeModal, ImgIndex}) => {
    const [index, setIndex] = useState(ImgIndex)
  return (
    <div className="fixed top-0 z-50 h-screen right-0 w-full flex justify-center items-center">
        <div className="fixed top-0 right-0 z-50 w-full h-screen bg-slate-500 opacity-60" />

        <div className="bg-white p-3 h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] relative w-[95%] sm:w-[500px] md:w-[550px] lg:w-[600px] z-50 rounded-lg">
            
            <button className='absolute bg-white rounded-full z-50 right-3 top-3 md:right-4 md:top-4' onClick={() => closeModal(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
            
            <div className="w-full h-full overflow-hidden">
                <div style={{
                    transform : `translateX(-${index * 100}%)`,
                    transition : 'transform 0.5s ease'
                }} className="flex w-full h-full">
                { 
                    images?.map((item, index) => 
                    // <div className='rounded-lg flex-1 bg-gray-400 w-full h-full'>
                        <img key={index} src={item} className='rounded-lg w-full h-full'/>
                    // </div>
                    )
                }
                </div>
            </div>

            <FaAngleLeft onClick={() => setIndex(pre => {
                if (pre - 1 < 0) {
                    return 0
                }
                return pre - 1
            })} className='absolute opacity-80 left-2 top-[50%] text-[40px] cursor-pointer text-gray-200 -translate-y-[50%]'/>
            
            <FaAngleRight  onClick={() => setIndex(pre => {
                if (pre + 1 > images?.length - 1) {
                    return images?.length - 1
                }
                return pre + 1
            })} className='absolute opacity-80 right-2 top-[50%] text-[40px] cursor-pointer text-gray-200 -translate-y-[50%]'/>

        </div>
    
    </div>
  )
}

export default ReviewImages