import React, { useEffect } from "react";
import { useState } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { Link, NavLink } from "react-router-dom";
import { CostumerAdress } from "..";
import { useStateContext } from "../../context/StateContext";

const Card = () => {
  
  const {
    showCart,
    cardItems,
    totalPrice,
    totalQuantity,
    settotalPrice,
    getCardItems,
    settotalQuantity,
    setshowCart,
    toggleCartChangeQty,
    removeProductInCart,
  } = useStateContext();

  const [showAdressModal, setShowAdressModal] = useState(false)
  
  useEffect(()=>{

    getCardItems()

    if(showCart){
        document.body.style.overflowY = 'hidden'
    }else{
        document.body.style.overflowY = 'scroll'
    }

  }, [])



  return (
    
      <div className={` ${showCart ? 'right-0' : '-right-[200%]'} h-screen z-50 smooth-transition w-full sm:w-[600px] bg-white float-right px-0 sm:px-[10px] py-10 fixed top-0`}>

        <button className="flex gap-[2px] border-none bg-transparent items-center text-[18px] font-[500] cursor-pointer ml-[10px]" onClick={() => setshowCart(false)}>
          <AiOutlineLeft />
          <span className="ml-[10px]">Your Cart</span>
          <span className="ml-[10px] text-second">({totalQuantity} items)</span>
        </button>

        {cardItems.length < 1 && (

          <div className="m-10 text-center">
            <AiOutlineShopping className="mx-auto" size={150} />
            <h3>You Shopping bag is empty</h3>
            <Link href="/">

              <button
                type="button"
                className="w-full text-white max-w-[400px] text-[20px] mt-10 cursor-pointer scale-100 transition-transform duration-500 ease-in uppercase bg-second px-3 py-[10px] rounded-2xl border-none hover:scale-110 "
                onClick={() => setshowCart(false)}
              >
                continue shopping
              </button>
            </Link>
          </div>

        )}

        <div className="mt-[15px] hide-scrollbar overflow-auto max-h-[70vh] py-5 px-[10px]">
          {cardItems?.length > 0 &&
            cardItems.map((item, i) => (

              <div className={` ${ i !== 0 ? 'border-t border-gray-300 ' : ''} flex px-0 sm:px-5 py-5 justify-between flex-wrap gap-0 sm:gap-[15px] w-full`} key={item.id}>
                
                <img
                  src={item.product.images}
                  alt={`Image_${i}`}
                  className="sm:w-[130px] sm:h-[130px] w-[110px] h-[110px] rounded-2xl bg-[#ebebeb]"
                />

                <div className="flex flex-col gap-4 sm:gap-0 justify-between w-[59%] sm:w-[64%] text-primary_text">

                  <div className="flex justify-between items-center flex-wrap gap-[10px] w-full text-primary_text">
                    <NavLink to={`/products/${ + item.product.id}`} className="text-[18px] sm:text-[24px] font-bold">{item.product.name}</NavLink>
                    <h4 className="text-[16px] sm:text-[20px] font-bold">
                      
                      {
                        item?.product?.discount?.discount ?

                        <div className="flex text-gray-400 gap-2">
                          <p><s>${item.product.price}</s></p> 
                          <p className="text-second">${Math.round((item.product.price - (item.product.price * (item.product?.discount?.discount / 100))) * 100) / 100}</p>
                        </div>

                        :

                          item.product.price
                        
                      }

                    </h4>
                  </div>

                  <div className="flex justify-between w-full text-primary_text mb-3">

                    <div className="">

                      <p className="border flex items-center border-solid border-gray-500 gap-2">
                        <span
                          className=" text-[14px] sm:text-[16px] py-[9px] px-3 cursor-pointer border-r border-solid border-gray-500 text-[#f02d34]"
                          onClick={() => toggleCartChangeQty(item.id, "minus", item.product.quantity)}
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="border-solid px-1 text-[18px] sm:text-[20px]">{item.quantity}</span>
                        <span
                          className="text-[14px] sm:text-[16px] py-[9px] px-3 cursor-pointer border-l border-solid border-gray-500 text-[#31a831]"
                          onClick={() => toggleCartChangeQty(item.id, "plus", item.product.quantity)}
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>

                    </div>

                    <button type="button" className="text-[24px] cursor-pointer bg-transparent border-none  text-second" onClick={()=>removeProductInCart(item.id)}>
                      <TiDeleteOutline />
                    </button>

                  </div>

                </div>

              </div>

            ))}

        </div>

        {cardItems.length > 0 && (
          <div className=" absolute backdrop-blur-lg bottom-0 right-0 w-full px-[35px] py-[15px] sm:pb-[20px] sm:px-[65px]">
            <div className="flex justify-between font-semibold sm:font-[700]">
              <h3 className="text-[22px] sm:text-[25px]">Totale Price : </h3>
              <h3 className="text-[22px] sm:text-[25px]">${Math.round(totalPrice * 100) / 100}</h3>
            </div>
            <div className=" w-[90%] sm:w-[300px] m-auto">
              <button onClick={()=> setShowAdressModal(true)} className="w-full text-white max-w-[400px] text-[20px] mt-5 cursor-pointer scale-100 transition-transform duration-500 ease-in uppercase bg-second px-3 py-[10px] rounded-2xl border-none hover:scale-110 " type="button">
                Purchase now
              </button>
            </div>
          </div>
        )}

        {
          showAdressModal && <CostumerAdress 
            cardItems={cardItems}
            closeModal={setShowAdressModal}
          />
        }
      </div>
  );
};

export default Card;
