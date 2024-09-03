import React, { useEffect, useState } from "react";
import {AiOutlineMinus, AiOutlinePlus} from "react-icons/ai"
import toast from "react-hot-toast";
import { NavLink, useParams } from "react-router-dom";
import Axios from "../../assets/constants/axios/axios";
import Swal from 'sweetalert2';
import { useStateContext } from "../../context/StateContext";
import {Comments, CostumerAdress, Footer, Loading, Product} from "../";
import LazyLoad from "react-lazyload";
import { FaHome } from "react-icons/fa";

const ProductDetails = () => {
  
  const {qty, decQty, incQty, AddOn, cardItems, setqty, isAddingOnCart, user} = useStateContext();
  
  const {id} = useParams()
  const [Product_D, setProduct_D] = useState()
  const [Reviews, setReviews] = useState([])
  const [Products, setProducts] = useState([])
  const [IsLoading, setIsLoading] = useState(true)
  const [ProductQty, setProductQty] = useState('');
  const [canUserMakeReview, setCanUserMakeReview] = useState(false)

  const [itemWillBuy, setItemWillBuy] = useState([{}])

  const [showAdressModal, setShowAdressModal] = useState(false)


  useEffect(() => {
    
    (async ()=>{

      setIsLoading(true)

        try {

          const res = await Axios.get(`/products/${id}`);

          if (res.status === 200) {

            setProduct_D(res.data.product)
    
            if (res.data.product.quantity === 0) {
              setProductQty(`No Stock (Max Quantity : ${res.data.product.quantity})`)
            }else{
              setProductQty('')
            }
    
            setqty(1)
    
            setProducts(res.data.product.products)
            setReviews(res.data.reviews)
            setCanUserMakeReview(res.data.canUserMakeReview)
    
          }
          
        } catch (error) {
          
          if(error.response.status == 404){

            window.location.href = '/'

          }

        }

      setIsLoading(false)
    })()

  }, [id])
  
  const [index, setindex] = useState(0)

  const checkQuantity = (product)=>{

    let itemFromCart = cardItems?.find((item) => {
      return item.product.id === product.id
    })

    if (itemFromCart) {

      if (qty + 1 <= product.quantity - itemFromCart.quantity) {
        
        setProductQty('')
        incQty(Product_D.quantity)
  
      }else{
        
        setProductQty(`No Stock (Max Quantity : ${product.quantity - itemFromCart.quantity})`)

      }
      
    }else if (qty + 1 > Product_D.quantity + 1 ) {

      setProductQty(`No Stock (Max Quantity : ${Product_D.quantity})`)
      
    } else{

      setProductQty('')
      incQty(Product_D.quantity)

    }

  }

  const checkUserConnected = (product, quantity) => {

    if(!user){

      toast.dismiss()
      toast.error('You need login before make this action')
      sessionStorage.setItem('redirectPath', window.location.pathname)

      setTimeout(() => {
        window.location = '/auth/login' 
      }, 1500);

    }

  }

  const checkQuantityBeforeAddToCart = (product, qty) =>{

    checkUserConnected()

    let itemFromCart = cardItems?.find((item) => {
      return item.product.id === product.id
    })
    
    if (
      itemFromCart && product.quantity - itemFromCart.quantity < 0 ||
      itemFromCart && product.quantity - itemFromCart.quantity - qty < 0
    ) {

      toast.error('this product isn\'t available in stock')
      setProductQty(`No Stock (Max Quantity : ${product.quantity - itemFromCart.quantity})`)

    }else{

      if (product.quantity - qty < 0) {

        toast.error('this product isn\'t available in stock')
        setProductQty(`No Stock (Max Quantity : ${product.quantity - qty > 0 ? product.quantity - qty : 0})`)

      } else {

        setProductQty('')
        AddOn(product, qty)

      }

    }

    
  }

  const minus = (product)=>{

    let itemFromCart = cardItems?.find((item) => {
      return item.product.id === product.id
    })

    if (itemFromCart && product.quantity - itemFromCart.quantity - 1 < 0) {

      setProductQty(`No Stock (Max Quantity : ${product.quantity - itemFromCart.quantity})`)

    }else if(product.quantity - 1 <= 0){

      setProductQty(`No Stock (Max Quantity : ${product.quantity - itemFromCart.quantity})`)

    }else{

      decQty()
      setProductQty('')

    }

  }

  const checkoutNow = (product, quantity) => {

    checkUserConnected()
    

      setItemWillBuy([{
        quantity: quantity,
        product: {
            id : product.id,
            name: product.name,
            price: product.price,
            discount: {
                discount: product?.discount?.discount || null
            }
        }
      }])

      setShowAdressModal(true)

    
  }

  if (IsLoading) return <Loading/>

  return (
    <div className="">
      
          <div className="flex py-[73px] m-0 justify-center gap-10 sm:m-5 text-primary_text flex-wrap">
            <div className="">

              <div className="bg-[#ebebeb] rounded-lg">
                <LazyLoad>
                  <img src={Product_D?.images && Product_D?.images[index]} alt="Image" className=" w-[310px] h-[310px] sm:w-[330px] sm:h-[330px] lg:w-[350px] lg:h-[350px]" />
                </LazyLoad>
              </div>
    
              <div className="flex gap-[5px] sm:gap-[16px] lg:gap-[23px] mt-5">
                {Product_D.images && Product_D.images.map((item, i)=>(
                  <LazyLoad key={i} height={350}>
                    <img
                      src={item && item}
                      className={`${i === index ? 'bg-second' : ''} rounded-[8px] cursor-pointer bg-[#ebebeb] w-[70px] h-[70px]`}
                      onMouseEnter={() => setindex(i)}
                      alt={`Image_${i}`}
                    />
                  </LazyLoad>
                ))}
              </div>
              
            </div>
    
            <div className="text-wrap w-[98%] sm:w-[70%] md:w-[45%] lg:w-[50%]">
              <h1 className="text-[30px] sm:text-[35px] whitespace-pre-line font-[700]">{Product_D?.name}</h1>
    
              <h4 className="text-[18px] font-[600] mt-[10px]">Details: </h4>
              <p className="mt-[10px] whitespace-pre-line text-[20px] sm:text-[18px] truncate">{Product_D?.description}</p>
              
              {
                Product_D?.discount > 0 ? 
                  <div className="flex text-gray-400 gap-2 text-[26px] mt-[30px]">
                    <p><s>${Product_D.price}</s></p> 
                    <p className="font-[700] text-second">${Math.round((Product_D.price - (Product_D.price * (Product_D.discount / 100))) * 100) / 100}</p>
                  </div>
                :
                <p className="font-[700] text-[26px] mt-[30px] text-second">${Product_D.price}</p>
              }
              
              <div className="flex gap-5 mt-[10px] flex-wrap items-center">
                <h3>Quantity</h3>
                
                <p className="border flex items-center border-gray-500 border-solid">
                  <span className=" text-[16px] cursor-pointer py-[8px] px-3 border-r border-solid border-gray-500 text-second" onClick={() => minus(Product_D)}>
                    <AiOutlineMinus/>
                  </span>
                  <span className=" text-[16px] px-3 text-gray-500">
                    {qty}
                  </span>
                  <span onClick={() => checkQuantity(Product_D)} className=" text-[16px] cursor-pointer py-[8px] px-3 border-l border-solid border-gray-500 text-[#31a831]">
                    <AiOutlinePlus/>
                  </span>
                </p>
                  
                <p className=" text-second font-semibold"><i> {`Quantity on stock : ${Product_D.quantity}`}</i></p>
    
              </div>
    
              <div className="flex flex-col mt-10 sm:flex-row gap-[10px] sm:gap-[30px]">
                
                    <button 
                      disabled={isAddingOnCart} 
                      className=" py-[10px] bg-white w-full sm:w-[200px] transition duration-100
                      ease-in cursor-pointer text-second font-[500] text-[18px] px-5 border border-solid border-second
                      rounded-md hover:bg-second hover:text-white" 
                      type="button" 
                      onClick={()=>checkQuantityBeforeAddToCart(Product_D, qty)}
                    >
                      Add To Cart
                    </button>
                    <button 
                      onClick={() => checkoutNow(Product_D, qty)} 
                      className=" w-full sm:w-[200px] py-[10px]  px-5 bg-second font-[500]
                      cursor-pointer hover:opacity-85 rounded-md text-white text-[18px] transition duration-100 ease-in" 
                      type="button"
                    >
                      Buy Now
                    </button>

              </div>
    
            </div>
          </div>

          <div className="mb-20">
            <Comments canUserMakeReview={canUserMakeReview} data={Reviews} product_id={id}/>
          </div>
    
          <div className="">
            <h2 className=" text-center text-primary_text text-[28px]">You may also like same Category</h2>
            <div className="relative h-[432px] w-full overflow-hidden">
              <div style={{
                'width' : `calc(1052px*${Products?.length <= 4 ? 1 : Products?.length / 4})`,
                'animationDuration' : `${Products?.length <= 4 ? `${15*1}s` : `${15*Products?.length / 5}s`}`
                }} className={`flex justify-center gap-[15px] mt-5 track`}>
                {Products?.map((item)=>(
                  <Product product={item} key={item.id}/>
                ))}
              </div>
            </div>
          </div>

          <Footer/>

          {
          showAdressModal && <CostumerAdress 
            cardItems={itemWillBuy}
            closeModal={setShowAdressModal}
          />
        }
      
    </div>
  );
};

export default ProductDetails;
