import React, { useState } from 'react'
import { FaAngleRight, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { NavLink } from 'react-router-dom';
import { Review, ReviewsDetails } from '..';

const Comments = ({data, product_id, canUserMakeReview}) => {

    const [writeReview, setwriteReview] = useState(false);

  return ( 
    <>

        <div className='w-full md:w-[90%] lg:w-[85%] xl:w-[74%] mx-auto flex flex-col items-center'>

            <div className='font-semibold text-start w-full flex items-start sm:items-center gap-3 text-primary_text text-[22px] sm:text-[25px]'>

                    {
                        data.reviews.length > 0 && (

                            <>
                                <h3>{data.details.reviews_count} Reviews </h3>

                                <div className='flex items-center mt-1 text-[17px] gap-1'>
                                {
                                
                                    Array.from({length: 5}, (_, index) => index + 1)
                                    .map((number, i) => (
                                        
                                        data.details.moyen_reviews >= number
                                        
                                        ?
                                            <FaStar key={i} className='text-second'/>
                                        :
                                            number - parseFloat(data.details.moyen_reviews) < 1  &&
                                            number - parseFloat(data.details.moyen_reviews) <= 0.5    ?
                                                <FaStarHalfAlt key={i} className='text-second'/>
                                            :
                                                <FaRegStar key={i} className='text-second'/>
                                    ))
                
                                }
                                <p className='text-[15px]'>{Math.round(data.details.moyen_reviews  * 10 ) / 10} out of 5</p>
                                </div>
                            </>

                        )
                    }

            </div>

            <div className='flex w-full flex-col gap-5 mt-4'>
                {
                    data.reviews.length > 0 ? data.reviews.map(item => (
                        <Review key={item?.id} item={item}/>
                    ))

                    :

                    <p className='text-center font-semibold'>This product doesn't have any reviews</p>
                }
            </div>

            {
                data.reviews.length > 0 && (
                    
                    <NavLink className='font-semibold flex gap-2 text-[18px] sm:text-[19px] items-center mt-8 text-second px-2 py-1' to={`/products/review/${product_id}`}>
                        <FaAngleRight className='rounded-full mt-[1.5px] border-2 border-second'/> Show more reviews
                    </NavLink>

                )
            }

            {
                data.reviews.length == 0 && canUserMakeReview && (
                    <NavLink className='font-semibold flex gap-2 text-[18px] sm:text-[19px] items-center mt-8 text-second px-2 py-1' to={`/products/review/${product_id}`}>
                        <FaAngleRight className='rounded-full mt-[1.5px] border-2 border-second'/> Go to write review
                    </NavLink>
                )
            }

        </div>
    </>
  )
}

export default Comments