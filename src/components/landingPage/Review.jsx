import React, { useState } from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaEdit, FaRegStar, FaStar, FaTrashAlt } from 'react-icons/fa'
import LazyLoad from 'react-lazyload'
import Swal from 'sweetalert2'
import { ReviewImages, ReviewsDetails } from '..'
import Axios from '../../assets/constants/axios/axios'
import { useStateContext } from '../../context/StateContext'

const Review = ({
    item, 
    displayActions = false, 
    setIsLoading = null,
    showReviews = null,
    getReviews = null,
    product_id = null,
    Sort = null,
    CurrentPage = null,
    Filtred = null,
    setCurrentPage = null,
    Reviews_data,
    setReviews_data = null
}) => {

    /* 
        displayActions : this prop for management the visibllity of review actions
    */

    const {user} = useStateContext()
    const [showModelUpdate, setShowModalUpdate] = useState(false)
    const [showModelImage, setShowModalImage] = useState(false)
    const [Images, setImages] = useState([])
    const [ImageIndex, setImageIndex] = useState(0)

    const deleteReview = async (id) => {

        Swal.fire({
            title : 'Are you sure to delete this Review ?',
            showCancelButton : true,
            showConfirmButton : true,
            confirmButtonText : 'Yes',
            icon : 'warning'
          })
        .then(async(response) => {

            if (response.isConfirmed) {
                toast.loading('')
                try {
                    
                    const res = await Axios.post(`/reviews/${id}`, {
                        _method : 'DELETE'
                    })
        
                    if (res.status == 200) {
                        
                        const itemsPerPage = 10
                        let Page = CurrentPage
                        let NumberPageChanged = false

                        /* 
                            this test for check if the page has the correct review
                            if dont have correct review go back the previos page 
                            else stay in same page
                        */
                        if (
                            Reviews_data?.reviews?.length - 1 <= CurrentPage * itemsPerPage &&
                            Reviews_data?.reviews?.length - 1 <= (CurrentPage - 1) * itemsPerPage 
                        ) {
                            Page = CurrentPage - 1
                            NumberPageChanged = true
                            setCurrentPage(Page)
                        }
                        
                        showReviews(product_id)
                        
                        /*
                            this for if dont have any review call the function for get the revies
                            else just remove deleted review 
                        */
                        if (Reviews_data?.reviews?.length - 1 == 0) {
                            getReviews(Sort, 1, Filtred)
                        }else{
                            setReviews_data({
                                reviews : Reviews_data?.reviews?.filter(item => item.id != id),
                                total_pages : NumberPageChanged ? Reviews_data?.total_pages - 1 : Reviews_data?.total_pages,
                                all_reviews_count : Reviews_data?.all_reviews_count - 1,
                                reviews_count : Reviews_data?.reviews_count - 1
                            })
                            setIsLoading(false)
                        }

                        toast.dismiss()
                        toast.success('Your Review deleted successfully')
                    }
        
                } catch (error) {
                    toast.dismiss()
                    console.log(error);
                }
            }

        })

    }

    useEffect(()=> {
        
        if (showModelUpdate || showModelImage) {
            document.body.style.overflowY = 'hidden'
        }else{
            document.body.style.overflowY = 'scroll'
        }

    }, [showModelUpdate, showModelImage])

  return (
    <div key={item?.id} className='flex flex-col'>

        <div className='flex gap-3'>

            <div className='self-start pt-1'>
                <div className='w-10 h-10 rounded-full flex justify-center items-center bg-primary_text'>
                    {
                        !item.user.profile ?
                            <img src={item.user.profile} className="w-full h-full" />
                        :
                            <p className='font-bold text-white uppercase'>{item.user.name.slice(0, 1)}</p>
                    }
                </div>

            </div>

            <div className='flex flex-col gap-1'>
                
                <div className='flex gap-2 flex-wrap items-center'>
                    <h5 className='capitalize font-semibold'>{item.user.name}</h5>
                    <div className='flex text-[14px]'>
                        {
                            
                            Array.from({length: 5}, (_, index) => index + 1)
                            .map((number, i) => (
                                
                                item.review_star >= number
                                
                                ?
                                    <FaStar key={i} className='text-second'/>
                                :
                                    <FaRegStar key={i} className='text-second'/>
                            ))

                        }
                    </div>
                </div>

                <p className='text-[12px] mb-1'>{item.updated_at}</p>
                <p className='text-wrap capitalize'>{item.review}</p>

                {
                    item?.images?.length > 0 && (
                        <div className={`gap-4 ${displayActions ? 'hidden sm:flex' : 'flex'} flex-wrap`}>
                            
                            {
                                item?.images?.map((image, index) => 
                                    <div key={index} onClick={() => {
                                        setImages(item?.images);
                                        setImageIndex(index)
                                        setShowModalImage(true)
                                    }} className={`rounded-lg cursor-pointer bg-gray-100 w-[100px] h-[100px] ${displayActions ? 'md:w-[130px] md:h-[130px]' : 'md:w-[120px] md:h-[120px]'}`}>
                                        <LazyLoad>
                                            <img src={image} className='rounded-lg h-full w-full' />
                                        </LazyLoad>
                                    </div>)
                            }
            
                        </div>
                    )
                }

            </div>

            {
                displayActions && (
                    user.role == 'seller' ||
                    item?.ReviewPermission
                ) &&
                <div className='flex self-start items-center gap-2'>
                    <FaEdit className='cursor-pointer hover:text-second text-[17px]' onClick={() => setShowModalUpdate(true)}/>
                    
                    <FaTrashAlt
                        className='cursor-pointer hover:text-second text-[16px]'
                        onClick={ () => deleteReview(item.id)}
                    />
                </div>

            }

        </div>

        {
            displayActions && 
                    item?.images?.length > 0 && (
                        <div className={`gap-4 ${displayActions && 'flex sm:hidden'} flex-wrap pl-12 pt-2`}>
                            
                            {
                                item?.images?.map((item, index) => 
                                    <div key={index} onClick={() => {
                                        setImages(item?.images);
                                        setImageIndex(index)
                                        setShowModalImage(true)
                                    }} className={`rounded-lg cursor-pointer bg-gray-100 w-[100px] h-[100px]`}>
                                        <img src={item} className='rounded-lg h-full w-full' />
                                    </div>)
                            }
            
                        </div>
                    )
        }

        {
            showModelUpdate && <ReviewsDetails
                header='Update Your Review'
                action='update'
                Reviews_data={Reviews_data}
                showReviews={showReviews}
                getReviews={getReviews}
                closeModal={setShowModalUpdate}
                review={item}
                setReviews_data={setReviews_data}
                product_id={product_id}
                setIsLoading={setIsLoading}
                id={item?.id}
            />
        }

        {
            showModelImage && 
            <ReviewImages
                images={Images}
                closeModal={setShowModalImage}
                ImgIndex={ImageIndex}
            />
        }

    </div>
  )
}

export default Review