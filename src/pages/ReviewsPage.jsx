import React, { useEffect, useState } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { FaAngleDown, FaAngleLeft, FaAngleUp, FaArrowLeft, FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import Axios from "../assets/constants/axios/axios";
import { AddReview, Loading, Review, ReviewsDetails } from "../components";

const ReviewsPage = () => {

  const { id } = useParams();
  const elementRef = useRef(null)

  const [ShowReviewModal, setShowReviewModal] = useState(false);
  const [IsLoading, setIsLoading] = useState(true)
  const [writeReview, setwriteReview] = useState(false);

  const [Sort, setSort] = useState("topReviews");
  const [Filtred, setFiltred] = useState("all");
  const [CurrentPage, setCurrentPage] = useState(1);
  const [moyen_reviews, setmoyen_reviews ] = useState(0)
  const [progress, setProgress] = useState(false);

  const [Reviews_details, setReviews_details] = useState([]);
  const [Reviews_data, setReviews_data] = useState([]);

  const [product, setProduct] = useState({})

  const [reveiwsID, setReviewID] = useState(0)

  const getReviews = async (typeSort, current_page, numberStar) => {

    setProgress(true);

    try {
      
      const res = await Axios.get(
        `reviews/${id}/${typeSort}/${current_page}/${numberStar}`
      );

      if (res.status == 200 && res.data.reviews_count > 0) {

        /* 
          if user in first page set the new data but 
          else add the new data on the old data 
        */
      
        if (current_page == 1) {

          setReviews_data(res.data);

        } else {

          setReviews_data({
            ...Reviews_data,
            reviews: [...Reviews_data.reviews, ...res.data.reviews],
          });

        }
        
      } else {

        setReviews_data({
          ...Reviews_data,
          reviews: [],
          total_pages: 0,
          reviews_count: 0,
          all_reviews_count : 0
        });

      }

    } catch (error) {
      console.log(error);
    }

    setProgress(false);
    setIsLoading(false)
    toast.dismiss()

  };

  // function for get static
  const showReviews = async (id) => {
    
    setProgress(true);
    setIsLoading(true);

    try {

      const res = await Axios.get(`reviews/${id}`);

      if (res.status == 200) {
        
        setReviews_details(res.data);
        setmoyen_reviews(res.data.details.moyen_reviews)
        setProduct(res.data.product)

      }

    } catch (error) {

      toast.error('Sometimes wrong, please try again')

    }

    setProgress(false);

  };

  useEffect(() => {
    
    showReviews(id)

  }, [])
  
  useEffect(() => {
    !IsLoading && toast.loading('loading...')
    setCurrentPage(1);
    getReviews(Sort, CurrentPage, Filtred);
  }, [Sort, Filtred]);

  const GoToTop = () => {
    elementRef.current.scrollIntoView({behavior:'smooth', block:'start'})
  }

  // function for get more reviews
  const seeMoreReview = () => {
    setCurrentPage((pre) => pre + 1)
    getReviews(Sort, CurrentPage + 1 , Filtred);
  }

  if (IsLoading) return <Loading/>

  return (
    <div className="w-full mt-5 lg:max-w-[1024px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto">
      
      <NavLink style={{width : 'fit-content'}} className='flex gap-1 py-3 items-center text-gray-500 font-semibold' to={`/products/${id}`}>
        <FaAngleLeft className="border border-gray-500 rounded-full mt-[1.5px]"/> Go Back
      </NavLink>

      <div className="flex flex-col md:flex-row">

        <div className="w-full md:w-[50%] flex flex-col gap-3 p-3">

          <div className="">
            <h3 className="font-semibold text-primary_text text-[20px]">
              Costumer reveiws
            </h3>

            <div className="flex mb-1 items-center text-[17px] gap-1">
              {Array.from({ length: 5 }, (_, index) => index + 1).map(
                (number) =>
                  moyen_reviews >= number ? (
                    <FaStar className="text-second" />
                  ) : number - parseFloat(moyen_reviews) < 1 &&
                    number - parseFloat(moyen_reviews) <= 0.5 ? (
                    <FaStarHalfAlt className="text-second" />
                  ) : (
                    <FaRegStar className="text-second" />
                  )
              )}
              <p className="text-[15px]">
                {Math.round(moyen_reviews * 10) / 10} out of 5
              </p>
            </div>
            <p>{Reviews_details.total_reviews} reviews</p>

          </div>

          {Array.from({ length: 5 }, (_, index) => 5 - index).map((item) => {
            
            const review = Reviews_details?.moyens?.filter(
              (rev) => rev.review_star == item
            );
            
            const moyen = review && review[0]
              ? (Math.round(review[0]?.average * 10) / 10) * 100
              : 0;

            return (
              <div className="flex w-full gap-3">
                <p className="text-nowrap w-[10%] py-1">{item} star</p>

                <div className="border w-[80%] -z-[1] relative rounded-md text-center">
                  <div
                    style={{
                      transform: `scaleX(${moyen}%)`,
                      transformOrigin: "left",
                    }}
                    className={` absolute h-full bg-second w-full rounded-md top-0 right-0 `}
                  />
                </div>

                <p className="w-[10%]">{moyen}%</p>
              </div>
            );
          })}
          
          <div className="mt-4 self-center md:self-end md:pr-5">
            {
                Reviews_details.permission_make_review &&
                    <button
                    onClick={() => setwriteReview(true)}
                    className="border text-white bg-second transition-all hover:opacity-90 border-second rounded-lg py-[0.30rem] px-[0.65rem] md:py-2 md:px-3 font-semibold"
                    >
                    Write Review
                    </button>
            }
          </div>

        </div>

        <div className="w-full md:w-[50%] flex flex-col p-3 gap-3">

            <div className="flex items-center gap-5 justify-start w-full">
                
                <div className="w-[100px] bg-slate-100 rounded-lg h-[100px]">
                    <img src={product.image} className="w-full h-full rounded-lg" />
                </div>

                <div className="">
                    <h3 className="font-bold text-primary_text text-[20px]">{product.name}</h3>
                </div>

            </div>

          {

            Reviews_details?.NigativeAndPositive?.length > 0 && (

              <>
                <h3 className="text-primary_text text-center md:text-start font-semibold text-[20px]">
                  Top Critical and positive reviews
                </h3>
              
                {
                  Reviews_details?.NigativeAndPositive && Reviews_details?.NigativeAndPositive?.map((item, index) => (
                    item?.review_star >= 3 ?
                      <div key={index}>
                        <h3 className="font-semibold mb-2 text-second text-[17px]">
                          Top positive review
                        </h3>
                          <Review 
                            item={item} 
                          />
                      </div>
                    :
                      <div key={index} className="">
                        <h3 className="font-semibold mb-2 text-second text-[17px]">
                          Top critical review
                        </h3>
                        <Review item={item}/>
                      </div>
                  ))
                }

              </>

            )

          }

        </div>

      </div>

      <div ref={elementRef} className="p-3 border rounded-xl my-5 border-gray-300">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <div className="flex gap-3 items-center">
            <label className="font-semibold">Sort By</label>
            <select
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg py-1 focus:outline-none px-3"
            >
              <option selected={Sort == "topReviews"} value="topReviews">
                Top review
              </option>
              <option selected={Sort == "mostRecent"} value="mostRecent">
                Most recent
              </option>
            </select>
          </div>

          <div className="flex gap-3 items-center">
            <label className="font-semibold">Filtred By</label>
            <select
              onChange={(e) => setFiltred(e.target.value)}
              className="border rounded-lg py-1 focus:outline-none px-3"
            >
              <option selected={Filtred == "all"} value="all">
                All stars
              </option>
              <option selected={Filtred == 1} value="1">
                1 star
              </option>
              <option selected={Filtred == 2} value="2">
                2 star
              </option>
              <option selected={Filtred == 3} value="3">
                3 star
              </option>
              <option selected={Filtred == 4} value="4">
                4 star
              </option>
              <option selected={Filtred == 5} value="5">
                5 star
              </option>
            </select>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-1">
          {Reviews_data.reviews_count} from {Reviews_data.all_reviews_count}{" "}
          reviews
        </p>
      </div>
      
      {
        Reviews_data?.reviews?.length > 0 && (

          <div className="py-3 relative px-4 md:px-10 flex flex-col gap-3">
          {Reviews_data?.reviews?.map((item) => (
            <Review 
              setShowReviewModal={setShowReviewModal} 
              showReviews={showReviews}
              getReviews={getReviews}
              displayActions={true} 
              item={item}
              CurrentPage={CurrentPage}
              setCurrentPage={setCurrentPage}
              Reviews_data={Reviews_data}
              setReviews_data={setReviews_data}
              Filtred={Filtred}
              Sort={Sort}
              setReviewID={setReviewID}
              product_id={id}  
              setIsLoading={setIsLoading}
            />
          ))}
          </div>

        )
      }


      {
        Reviews_data?.reviews?.length ? (
          <div className="w-full mt-5 overflow-x-hidden flex pb-4 px-3">
            {
                Reviews_data.total_pages == CurrentPage && !progress ?
                <button
                    onClick={() => GoToTop()}
                    className={`mx-auto border flex items-center gap-2 relative font-semibold border-second rounded-2xl px-3 py-2 bg-white text-second 
                                before:absolute before:translate-y-[-50%] before:w-[354px] ${
                                    IsLoading ? "-z-[1]" : ""
                                } before:left-[50%] before:translate-x-[-50%] before:top-[50%] before:h-[1px] before:-z-10 before:bg-second`}
                >
                    <FaAngleUp className="font-semibold border-2 border-second rounded-full" />
                    Go To Top
                </button>
                :
    
                <button
                    disabled={progress}
                    onClick={() => seeMoreReview()}
                    className={`mx-auto border flex items-center gap-2 relative font-semibold border-second rounded-2xl px-3 py-2 bg-white text-second 
                                before:absolute before:translate-y-[-50%] before:w-[354px] ${
                                    IsLoading ? "-z-[1]" : ""
                                } before:left-[50%] before:translate-x-[-50%] before:top-[50%] before:h-[1px] before:-z-10 before:bg-second`}
                >
                    <FaAngleDown className="font-semibold border-2 border-second rounded-full" />
                    See 10 more reviews
                </button>
    
            }
          </div>
        ) : <p className="text-center py-4">No Reviews Exists </p>
      }
    
        {
            writeReview && <ReviewsDetails
                header='Write Review'
                action='create'
                setCurrentPage={setCurrentPage}
                progress={progress}
                product_id={id}
                setSort={setSort}
                setFiltred={setFiltred}
                showReviews={showReviews}
                closeModal={setwriteReview}
                setProgress={setProgress}
                getReviews={getReviews}
                CurrentPage={CurrentPage}
                Sort={Sort}
                Filtred={Filtred}
            />
        }

        {
          ShowReviewModal && <ReviewsDetails
            header='Update Your Review'
            action='update'
            setCurrentPage={setCurrentPage}
            id={reveiwsID}
            progress={progress}
            showReviews={showReviews}
            closeModal={setShowReviewModal}
            setProgress={setProgress}
            getReviews={getReviews}
            CurrentPage={CurrentPage}
            Sort={Sort}
            Filtred={Filtred}
          />
        }

    </div>
  );
};

export default ReviewsPage;
