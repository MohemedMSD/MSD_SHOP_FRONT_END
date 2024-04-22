import React from 'react';
import { NavLink } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

const Product = React.memo(({ product }) => {
    const { images, name, id, price, quantity } = product;
    
    return (
        <div>
            <NavLink to={`/products/${id}`}>
                <div className="w-[250px] cursor-pointer truncate scale-100 transition-transform duration-[.5s] ease-in text-[#324d67]">
                    <LazyLoad height={250} offset={100} once>
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
                    </LazyLoad>
                    <p className="text-[25px] font-[500] truncate">{name}</p>
                    <div className='flex gap-2 items-center'>
                        <p className="text-[18px] font-[800] mt-[6px] text-black">${price}</p>
                        { quantity === 0 && <p className='text-second text-[14px] font-semibold'><i>No Stock</i></p> }
                    </div>
                </div>
            </NavLink>
        </div>
    );
});

export default Product;
