import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Axios from "../../assets/constants/axios/axios";

const AddReview = ({setProgress, showReviews, setwriteReview, getReviews, progress, setCurrentPage, CurrentPage, Sort, Filtred}) => {

    const {id} = useParams()

    const [star_number, setStar_number] = useState(1)
    const [ErrStar_number, setErrStar_number] = useState('')

    const [Review_content, setReview_content] = useState('')
    const [ErrReview_content, setErrReview_content] = useState('')

    const [images, setImages] = useState('')
    const [ErrImages, setErrImages] = useState('')

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
    
    const saveReview = async () => {
        setProgress(true)
        try {
            
            let formData = new FormData()

            if (images.length > 0) {
                images.forEach((item, index) => {
                    formData.append(`images[${index + 1}]`, item);
                });
            }

            formData.append('review_star', star_number)
            formData.append('review', Review_content)
            formData.append('product_id', id)
            
            const res = await Axios.post('reviews', formData)

            if (res.status == 201) {
                
                toast.success('Your Review added successfully')
                setCurrentPage(1)
                setwriteReview(false)
                showReviews(id)
                getReviews(Sort, CurrentPage, Filtred)

            }

        } catch (error) {

            if (error.response.status == 422) {
                
                const messages = error.response.data

                setErrReview_content(messages?.review && messages?.review[0] || '')
                setErrStar_number(messages?.review_star && messages?.review_star[0] || '')
                setErrImages(messages?.image && messages?.image[0] || '')
                
            }else {
                toast.error('Sometimes wrong, please try again')
            }

        }
        
        setProgress(false)

    }

  return (
    <div className="p-3 flex flex-col gap-5">
      <h3 className="text-[20px] font-semibold text-center capitalize text-primary_text">Add your review</h3>
      <div>
        
        <div className="flex gap-2 items-center justify-center">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((number) =>
            star_number >= number ? (
                <FaStar onClick={() => setStar_number(number)} className="text-second text-[19px]" />
            ) : (
                <FaRegStar onClick={() => setStar_number(number)} className="text-second text-[19px]" />
            )
            )}
        </div>
        {
            ErrStar_number && <p className="text-red-500 w-full font-semibold">{ErrStar_number}</p>
        }
        

      </div>

      <div className="flex flex-col gap-4">

        <div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                
                <label className="font-semibold w-full sm:w-1/4">Choose image</label>
                <input type='file' onChange={(e) => hundleChangeImage(e)} className="py-2 file:bg-second file:text-white file:font-semibold file:rounded-lg file:py-1 file:px-2 file:border-none border-gray-300 w-full px-2 border rounded-lg" />

            </div>
            {
                ErrImages && <p className="text-red-500 w-full font-semibold">{ErrImages}</p>
            }

        </div>

        <div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            
                <label className="font-semibold w-full sm:w-1/4">Review</label>
                <textarea value={Review_content} onChange={(e) => setReview_content(e.target.value)} className="py-1 focus:outline-none px-2 border-gray-300 w-full border rounded-lg" />

            </div>
            {
                ErrReview_content && <p className="text-red-500 w-full font-semibold">{ErrReview_content}</p>
            }

        </div>

      </div>

      <div className="w-full flex justify-center">
        <button disabled={progress} onClick={() => saveReview()} className="rounded-lg bg-second hover:opacity-95 text-white font-semibold py-1 px-4">Save</button>
      </div>
    </div>
  );
};

export default AddReview;
