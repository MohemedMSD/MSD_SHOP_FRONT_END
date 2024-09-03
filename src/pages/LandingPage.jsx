import React, { useEffect, useState } from "react";
import Axios from "../assets/constants/axios/axios";
import { useFunctionsContext } from "../context/FunctionsContext";
import { 
  Categories_Com, 
  Footer, 
  FooterBanner, 
  Loading, 
  Partners, 
  Product, 
  SearchBar, 
  Services 
} from "../components";

import "swiper/css";
import Banner from "../components/landingPage/Banner";
import { bg_colors } from "../assets/constants/axios";
import { StockEmpty } from ".";
import { useRef } from "react";

const LandingPage = () => {
  const {
    setitemsPerPage,
    renderPages,
    goToNextPage,
    goToPreviousPage
  } = useFunctionsContext();

  const [Products, setProducts] = useState([]);
  const [current_page, setCurrent_page] = useState(1);
  const [total_pages, setTotal_pages] = useState(1);

  const [IsLoading, setIsLoading] = useState(true);
  const [Error, setError] = useState("");

  const [RunOneTime, setRunOneTime] = useState(true);
  const [changePage, setchangePage] = useState(true);
  const [categoryLoading, setcategoryLoading] = useState(false);

  // this for products if doesnt exists discounts
  const [bannerData, setBannerData] = useState([]);

  const [categoryIndex, setCategoryIndex] = useState(0);

  const [Categories, setCategories] = useState([]);
  const [CategorySelected, setCategorySelected] = useState("");

  const [Discounts, setDiscounts] = useState([])
  const [FooterBannerType, setFooterBannerType] = useState('discounts')

  const [StockEmptyState, setStockEmptyState] = useState(false)

  useEffect(() => {

    (async () => {

      // this state for if change pages run the code for test and get the product for page choosed
      if (changePage) {

        // this for if user make reload for get category or not
        if (RunOneTime) {

          setIsLoading(true)

          try {
            
            const resCategory = await Axios.get("/categories");
            setCategories(resCategory.data.data);

          } catch (error) {
            console.log(error);
          }

        }else{

          setcategoryLoading(true)
          setIsLoading(true)

        }

        try {

          let path = "";

          // this for choose any route it go
          // the first go to get the best selling product
          // the second go to get the product id

          if (categoryIndex === 0) {

            path = "/get-products/" + current_page;

          } else {

            path = "/products-category/" + categoryIndex + "/" + current_page;

          }

          const res = await Axios.get(path);

          if (res.status === 200) {

            if (res.data.products?.length == 0 && res.data?.Discounts?.length == 0) {
              
              setStockEmptyState(true)

            }else{

              setStockEmptyState(false)
              setProducts(res.data.products);
              setTotal_pages(res.data.total_pages);

              /*
                this part about if doest have any discounts get single product from each category
                and put discount color in that products
              */

              const updatedDiscounts = res.data?.Discounts?.map((item)=>{
                if (!item?.discount) {
                  setFooterBannerType('bannerData')
                  return {
                    ...item,
                    discount : {
                      color : bg_colors[Math.floor(Math.random() * bg_colors.length)]
                    }
                  }
                }
                return item
              })

              setDiscounts(updatedDiscounts)

              setCategorySelected("Best Selling Products");
              setError("");
              setitemsPerPage(20);

            }

          }

        } catch (error) {
          setError("Something Wrong! Try Again");
        }

        setIsLoading(false);
        setcategoryLoading(false)

        setRunOneTime(false);
        setchangePage(false);

      }

    })();
    
  }, [current_page, Products, RunOneTime, changePage]);

  const category = async (category) => {
    let route;

    if (category.name === "BS") {
      route = "/get-products/1";
      setCategorySelected("Best Selling Products");
      setCategoryIndex(0);
      setCurrent_page(1);
    } else {
      route = "/products-category/" + category.id + "/" + 1;
      setCategorySelected(category.name);
      setCategoryIndex(category.id);
      setCurrent_page(1);
    }
    setcategoryLoading(true);
    try {
      const res = await Axios.get(route);

      if (res.status === 200) {
        setProducts(res.data.products);
        setTotal_pages(res.data.total_pages);
        setError("");
      }
    } catch (error) {
      setError("Something Wrong! Try Again");
    }
    setcategoryLoading(false);
  };

  if (IsLoading) {
    return <Loading />;
  }

  if (StockEmptyState) {
    return <StockEmpty />;
  }

  return (
    <div>
      <div className="flex sm:hidden mt-4 border-b w-full border-primary_text lg:max-w-[1024px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto">
        <SearchBar/>
      </div>

      <div className="flex flex-col sm:gap-4 overflow-hidden">
        
        <Banner 
          bannerData={
            Discounts.length > 0 && Discounts ||
            bannerData.length > 0 && bannerData 
          } 
        />

        <Categories_Com Categories={Categories} categoryIndex={categoryIndex} category={category}/>

        <div className=" text-center my-5 text-primary_text w-full lg:max-w-[1024px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto">
          <h2 className="text-[30px] sm:text-[40px] capitalize font-[800]">
            {CategorySelected}
          </h2>
        </div>

        <div className=" w-full lg:max-w-[1024px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto">
          <div
            className={`${
              categoryLoading ? "relative" : ""
            } flex justify-center flex-wrap gap-[16px] mt-0 pt-4  w-full`}
          >
            {categoryLoading && (
              <div className="z-50 pb-5">
                <Loading />
              </div>
            )}

            {IsLoading && <Loading />}

            {Products.length > 0 &&
              !IsLoading &&
              Products.map((item) => <Product key={item.id} product={item} />)}

            {Products.length === 0 && Error === "" && !IsLoading && (
              <p className=" text-primary_text font-[700] text-center text-[1.3em]">
                No Products Existing
              </p>
            )}

            {Error !== "" && !IsLoading && (
              <p className=" text-red-500 font-[700] text-center text-[1.3em]">
                {Error}
              </p>
            )}
          </div>
          <div className=" p-5 px-3 flex items-center gap-4 justify-center">
            <ol className="flex justify-center gap-1 text-[16px] font-medium">
              <li>
                <button
                  disabled={current_page === 1}
                  onClick={() => goToPreviousPage(setCurrent_page, setchangePage)}
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

              {renderPages(current_page, total_pages, setCurrent_page, setchangePage)}

              <li>
                <button
                  disabled={current_page === total_pages}
                  onClick={() => goToNextPage(setCurrent_page, setchangePage, total_pages)}
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


        <Services/>

        <FooterBanner 
          bannerData={Discounts}

          type={FooterBannerType}

        />
        
        <Partners/>

        <Footer/>
      </div>
    </div>
  );
};
export default LandingPage;
