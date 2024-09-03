import React from "react";
import { BiCategory } from "react-icons/bi";
import { FaStarHalfAlt } from "react-icons/fa";
import LazyLoad from "react-lazyload";
import { Swiper, SwiperSlide } from "swiper/react";
import { Best_selling_logo } from "../../assets/constants/axios";

const Categories = ({categoryIndex, category, Categories}) => {
  
  return (
    <Swiper
      spaceBetween={15}
      slidesPerView="auto"
      style={{ zIndex: 0 }}
      className="flex w-full lg:max-w-[1024px] sm:max-w-[640px] md:max-w-[850px] xl:max-w-[1280px] mx-auto flex-col sm:px-5 xl:px-28 overflow-x-scroll hide-scrollbar gap-4 mt-10 p-2"
    >
      <div className="flex items-center gap-4" >
        <SwiperSlide
          style={{
            minWidth: "245px",
            maxWidth: "245px",
            width: "245px",
            height: "125px",
            zIndex: "-1",
            transform: categoryIndex === 0 ? "scale(.93)" : "",
          }}
          className={`relative ${
            categoryIndex === 0 ? "scale-95 sm:scale-100 bg-slate-200" : ""
          } cursor-pointer  rounded-lg category-box overflow-hidden`}
        >
          <div
            onClick={() => category({ name: "BS" })}
            className={`text-[18px] bg-gray-100 capitalize border w-full h-full rounded-lg p-2 border-primary_text text-primary_text text-center font-semibold`}
          >
            <LazyLoad>
              <img
                src={Best_selling_logo}
                loading="lazy"
                className={`absolute top-0 right-0 w-full h-full rounded-lg`}
              />
            </LazyLoad>
            <p
              className={`backdrop-blur-xl absolute bottom-0  ${
                categoryIndex !== 0
                  ? "sm:translate-y-[100%]"
                  : "translate-y-[100%] sm:translate-y-0"
              } hover:translate-y-0 transition-transform text-[20px] rounded-b-lg px-2 pb-[2px] left-0 text-red-600 font-bold text-center capitalize w-full`}
            >
              Best Selling
            </p>
          </div>
        </SwiperSlide>
        {Categories?.map(
          (item) =>
            item.numbre_products > 0 && (
              <SwiperSlide
                key={item.id}
                style={{
                  minWidth: "245px",
                  maxWidth: "245px",
                  width: "245px",
                  height: "125px",
                  zIndex: "-1",
                  transform: categoryIndex === item.id ? "scale(.93)" : "",
                  transition: "transform .2s ease",
                }}
                className={`relative cursor-pointer rounded-lg ${
                  categoryIndex === item.id ? "bg-slate-400" : ""
                } category-box overflow-hidden min-w-[180px] w-[180px] h-[100px]`}
              >
                <div
                  onClick={() => category(item)}
                  className={` ${
                    !item.image && "bg-gray-300"
                  } text-[18px] capitalize bg-gray-100 border w-full h-full rounded-lg p-2 border-primary_text text-primary_text text-center font-semibold`}
                >
                  {item.image ? (
                    <LazyLoad>
                      <img
                        src={item.image && item.image}
                        loading="lazy"
                        className={`absolute top-0 right-0 w-full h-full rounded-lg`}
                      />
                    </LazyLoad>
                  ) : (
                    <BiCategory
                      fontSize={90}
                      className="absolute text-white top-[50%] opacity-35 -translate-y-[50%] -translate-x-[50%] left-[50%] rounded-lg"
                    />
                  )}
                </div>
                <p
                  className={` backdrop-blur-xl absolute bottom-0  ${
                    categoryIndex !== item.id
                      ? "sm:translate-y-[100%]"
                      : "translate-y-[100%] sm:translate-y-0"
                  } hover:translate-y-0 transition-transform duration-200 text-[20px] rounded-b-lg px-2 pb-[2px] text-white font-semibold text-center capitalize w-full`}
                >
                  {item.name}
                </p>
              </SwiperSlide>
            )
        )}
      </div>
    </Swiper>
  );
};

export default Categories;
