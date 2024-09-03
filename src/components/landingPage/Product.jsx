import React from 'react';
import { NavLink } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import {FaEye, FaRegStar, FaStar, FaStarHalfAlt} from 'react-icons/fa'

const Product = React.memo(({ product }) => {
    const { images, name, id, price, quantity, category_name, discount, views, details } = product;

    return (
        <div key={id}>
            <NavLink to={`/products/${id}`}>
                <div className="w-[250px] p-2 shadow-md rounded-[15px] cursor-pointer truncate scale-100 transition-transform duration-[.5s] ease-in text-primary_text">
                    <LazyLoad className='relative group' height={250} offset={100} once>
                        <img
                            src={images && images}
                            alt="ImageProduct"
                            srcSet={`${images && images} 480w, ${images && images} 800w, ${images && images} 1200w`}
                            sizes="(max-width: 480px) 250px, (max-width: 800px) 320px, 320px"
                            loading='lazy'
                            width={250}
                            height={250}
                            className="w-[250px] h-[250px] rounded-[15px] bg-[#ebebeb] scale-100 transition-transform duration-[.5s] ease-in"
                        />
                        <p className='flex opacity-0 group-hover:opacity-95 transition-opacity absolute right-[4%] text-[14px] top-[4%] bg-white rounded-md px-1 items-center gap-1 float-end'>
                            <FaEye style={{color:'#324d67 !important'}}/>{views}
                        </p>
                    </LazyLoad>
                    <p className="text-[25px] pt-1 px-2 font-[500] truncate">{name}</p>

                    
                    <div className="flex mb-1 items-center text-[15px] px-2 gap-1">
                        {Array.from({ length: 5 }, (_, index) => index + 1).map(
                            (number, i) =>
                            details.moyen_reviews >= number ? (
                                <FaStar key={i} className="text-second" />
                            ) : number - parseFloat(details.moyen_reviews) < 1 &&
                                number - parseFloat(details.moyen_reviews) <= 0.5 ? (
                                <FaStarHalfAlt key={i} className="text-second" />
                            ) : (
                                <FaRegStar key={i} className="text-second" />
                            )
                        )}
                        <p>({details.reviews_count})</p>
                    </div>

                    <p className="text-[17px] text-gray-500 capitalize pt-1 px-2 font-[500] truncate">{category_name}</p>
                    <div className='flex p-2 gap-2 items-center'>
                        <div className="text-[18px] font-[800] text-black">
                            {
                                discount ?
                                <p>
                                    <s className='text-gray-400 mr-1'>${price}</s>
                                    <span className='text-second'>${
                                        Math.round((price - price * discount.discount /100) * 100)/100
                                    }</span>
                                </p>
                                :
                                <p>${price}</p>
                            }
                        </div>
                        { quantity === 0 && <p className='text-second text-[14px] font-semibold'><i>No Stock</i></p> }
                    </div>
                </div>
            </NavLink>
        </div>
    );
});

export default Product;
