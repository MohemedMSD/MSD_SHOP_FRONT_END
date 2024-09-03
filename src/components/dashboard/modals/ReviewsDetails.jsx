import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegStar, FaStar } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Loading } from "../..";
import Axios from "../../../assets/constants/axios/axios";

const ReviewsDetails = ({
  header,
  action,
  showReviews,
  Reviews_data=null,
  closeModal,
  id = null,
  product_id=null,
  setIsLoading=null,
  review=null,
  setReviews_data=null,
  setCurrentPage=null,
  setSort=null,
  setFiltred=null
}) => {

    const [star_number, setStar_number] = useState(1)
    const [ErrStar_number, setErrStar_number] = useState('')

    const [loading, setLoading] = useState(action == 'update' ? true : false)

    const [Review_content, setReview_content] = useState('')
    const [ErrReview_content, setErrReview_content] = useState('')

    const [images, setImages] = useState([])
    const [ErrImages, setErrImages] = useState('')

    const [old_images, setOld_images] = useState([])

    const [processing, setProcessing] = useState(false)

    useEffect(() => {

        (async() => {
          
          if (action == 'update') {
            try {
  
              const res = await Axios.get(`/reviews/show/${id}`)
              if (res.status == 200) {
  
                setStar_number(res.data.star_number)
                setReview_content(res.data.review)
                setImages(res.data.images || [])
                setOld_images(res.data.images_path || [])
                setLoading(false)
  
              }
  
            } catch (err) {
              console.log(err);
            }
          }

        })()

    }, [])

    // function for validate images size, number, type
    const hundleChangeImage = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 4); // Limit to 4 files
  
        const imagesTypes = ['jpg', 'jpeg', 'png', 'webp']
        // Validate file size
        const invalidFiles = selectedFiles.filter(file => file.size > 1024 * 1024); // 1MB
        
        const FileNotImage = selectedFiles.filter((file) => {
          const imageType = file.name.split('.').pop();
          return !imagesTypes.includes(imageType.toLowerCase())
        })
        
        if (invalidFiles.length > 0) {
          setErrImages('One or more files exceed the maximum size of 1MB');
        }if(FileNotImage.length > 0){
          setErrImages('One or more files exceed the type not image');
        } else {
            
              let newArray = []
              
              if (images?.length === 0) {
                newArray = selectedFiles
              }else{
                newArray = [...images, ...selectedFiles]
              }
  
              if (newArray.length <= 4) {
                setImages(newArray);
                setErrImages('');
              }else{
                setErrImages('We accepted just 4 pictures')
              }
  
          }
  
      }
      
    // function for remove image in choose review images
    const removeImage = (index) => {
  
      let newArray = [...images];
      newArray.splice(index, 1);
      setImages(newArray)
  
    } 
    
    // function for add review
    const saveReview = async () => {
        setProcessing(true)
        toast.loading('Loading...')
        try {
            
            let formData = new FormData()

            if (images.length > 0) {
                images.forEach((item, index) => {
                    formData.append(`images[${index + 1}]`, item);
                });
            }else{
              formData.append(`images`, []);
            }

            formData.append('review_star', star_number)
            formData.append('review', Review_content)
            formData.append('product_id', product_id)
            
            const res = await Axios.post('reviews', formData)

            if (res.status == 201) {
                
                setCurrentPage(1)
                closeModal(false)
                setSort('mostRecent')
                setFiltred('all')
                toast.dismiss()
                toast.success('Your Review added successfully')
                showReviews(product_id)

            }

        } catch (error) {
          
          toast.dismiss()
            if (error.response.status == 422) {
                
                const messages = error.response.data

                setErrReview_content(messages?.review && messages?.review[0] || '')
                setErrStar_number(messages?.review_star && messages?.review_star[0] || '')
                setErrImages(messages?.image && messages?.image[0] || '')
                
                toast.error('incompleted information')
            }else {
                toast.error('Sometimes wrong, please try again')
            }

        }
        
        setProcessing(false)

    }

    const updateReview = async (id) => {

        setProcessing(true)
        toast.loading('Loading...')
        try {
            
            let formData = new FormData()

            images?.forEach((item, index) => {

              let image = item;
              
              if (typeof(image) == 'string') {
                
                const old_image = old_images?.filter(old_image => item.includes(old_image));
      
                if (old_image?.length > 0) {
                  image = old_image[0]
                }
      
              }
      
              formData.append(`images[${index + 1}]`, image);
            });

            if (old_images?.length > 0) {
              old_images?.forEach((item, index) => {
                formData.append(`old_images[${index + 1}]`, item);
              });
            }else{
              formData.append(`old_images[]`, null);  
            }

            formData.append('review_star', star_number)
            formData.append('_method', 'put')
            formData.append('review', Review_content)
            
            const res = await Axios.post(`reviews/${review.id}`, formData)

            if (res.status == 200) {

                
                const newArray = Reviews_data.reviews.map(item => {

                  if (item.id == id) {
                    return res.data.data
                  }
                  return item

                })

                setReviews_data({
                  ...Reviews_data,
                  reviews : newArray
                })

                toast.dismiss()
                toast.success('Your Review updated successfully')
                closeModal(false)
                await showReviews(product_id)
                
                setIsLoading(false)

            }

        } catch (error) {
          console.log(error);
            if (error.response.status == 422) {
                
                const messages = error.response.data

                setErrReview_content(messages?.review && messages?.review[0] || '')
                setErrStar_number(messages?.review_star && messages?.review_star[0] || '')
                setErrImages(messages?.image && messages?.image[0] || '')
                
            }else {
                toast.dismiss()
                toast.error('Sometimes wrong, please try again')
            }

        }
        
        setProcessing(false)

    }

  return (
    <div className="fixed top-0 h-screen z-50 right-0 w-full flex justify-center items-center">
      <div className="fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60"></div>

      <div className="bg-white relative w-[98%] sm:w-[70%] lg:w-[65%] z-50 rounded-lg  hide-scrollbar overflow-y-scroll">
        {loading && <Loading/>}
        <div className="flex items-center justify-between p-3">
          <h1 className=" text-[23px] sm:text-[25px] md:text-[28px] text-primary_text font-bold">{header}</h1>
          <button onClick={() => closeModal(false)}>
            <IoMdCloseCircleOutline fontSize={25} />
          </button>
        </div>

        <hr className="border-gray-600" />

        <div className="max-h-[90vh]  mt-2 overflow-y-scroll hide-scrollbar">
          <div className="p-3 flex flex-col gap-5">
            <div>
              <div className="flex gap-2 items-center justify-center">
                {Array.from({ length: 5 }, (_, index) => index + 1).map(
                  (number) =>
                    star_number >= number ? (
                      <FaStar
                        onClick={() => setStar_number(number)}
                        className="text-second text-[19px]"
                      />
                    ) : (
                      <FaRegStar
                        onClick={() => setStar_number(number)}
                        className="text-second text-[19px]"
                      />
                    )
                )}
              </div>
              {ErrStar_number && (
                <p className="text-red-500 w-full font-semibold">
                  {ErrStar_number}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="font-semibold w-full sm:w-1/4">
                    Choose image
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => hundleChangeImage(e)}
                    className="py-2 file:bg-second file:text-white file:font-semibold file:rounded-lg file:py-1 file:px-2 file:border-none border-gray-300 w-full px-2 border rounded-lg"
                  />
                </div>
                {ErrImages && (
                  <p className="text-red-500 w-full font-semibold">
                    {ErrImages}
                  </p>
                )}
                <div className="flex justify-start w-full gap-y-2 gap-x-8  px-2 py-5 flex-wrap">
                  {
                    images.length > 0 ? images?.map((item, index) => (
                      <div key={index} className=" w-[100px] h-[100px] rounded-lg relative">
                        {action !== 'show' && <IoMdCloseCircleOutline onClick={() => removeImage(index)} fontSize={20} className="text-second cursor-pointer absolute top-3 right-0"/>}
                        <img className=" max-h-full max-w-full" src={ typeof(item) !== 'string' ? URL.createObjectURL(item) : item}/>
                      </div>
                    ))
                    :
                    <p className="text-center w-full capitalize">You dont have any images</p>
                  }
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="font-semibold w-full sm:w-1/4">
                    Review
                  </label>
                  <textarea
                    value={Review_content}
                    onChange={(e) => setReview_content(e.target.value)}
                    className="py-1 focus:outline-none px-2 border-gray-300 w-full border rounded-lg"
                  />
                </div>
                {ErrReview_content && (
                  <p className="text-red-500 w-full font-semibold">
                    {ErrReview_content}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full flex justify-center">

                {
                    action == 'create' && (
                        <button
                          disabled={processing}
                          onClick={() => saveReview()}
                          className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md"
                        >
                          Save
                        </button>
                    )
                }

                {
                    action == 'update' && (
                        <button
                          disabled={processing}
                          onClick={() => updateReview(review?.id)}
                          className="p-2 mx-auto font-semibold bg-second text-white rounded-md"
                        >
                          update
                        </button>
                    )
                }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsDetails;
