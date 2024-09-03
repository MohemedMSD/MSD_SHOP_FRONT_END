import React, { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";
import { Loading } from "../..";
import Axios from "../../../assets/constants/axios/axios";

const CostumerAdress = ({ cardItems, closeModal }) => {
  const [line, setLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal_code, setPostal_code] = useState("");
  const [country, setCountry] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [errors, setErrors] = useState({});

  useEffect(()=>{

    (async()=>{
        setIsLoading(true)
        try {
            
            const res = await Axios.get('/user')

            if (res.status == 200) {
                
                setLine(res.data.adress.line)
                setCity(res.data.adress.city)
                setState(res.data.adress.state)
                setPostal_code(res.data.adress.postal_code)
                setCountry(res.data.adress.country)

            }

        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
    })()

}, [])

    const validateForm = () => {
        const newErrors = {};
        if (!line) newErrors.line = 'Address Line is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (!postal_code) newErrors.postal_code = 'Postal Code is required';
        if (!country) newErrors.country = 'Country is required';
        else if (postal_code.length > 10) newErrors.postal_code = 'Postal Code is too long';
        // Add more validation rules as needed

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkout = (e) => {
        e.preventDefault()
    
        if (validateForm()) {
        
            toast.loading("redirect...");

            let arrayProducts = cardItems.map((item) => {
            return {
                price_data: {
                currency: "usd",
                product_data: {
                    name: item.product.name,
                },
                unit_amount: item?.product?.discount?.discount
                    ? (Math.round((item.product.price -
                        item.product.price * (item.product?.discount?.discount / 100)) * 100) / 100 ) * 100
                    : item.product.price * 100,
                },
                adjustable_quantity: {
                enabled: false,
                },
                quantity: item.quantity,
            };
            });

            const products = cardItems.map((item) => {
            return {
                id: item.product.id,
                quantity: item.quantity,
                price_per_product: item?.product?.discount?.discount
                ? item.product.price -
                    item.product.price * (item.product?.discount?.discount / 100)
                : item.product.price,
            };
            });

            Axios.post("/checkout", {
                products_checkout: arrayProducts,
                success: window.location.origin + "/success",
                cancel: window.location.origin + "/cancel",
                products: products,
                adress : {
                    line : line,
                    city : city,
                    state : state,
                    postal_code : postal_code,
                    country : country
                }
            })
            .then((res) => {
                if (res.status) {
                    window.location.href = res.data;
                }
            })
            .catch((rej) => {

                if (rej.response.status === 422) {

                    const messages = rej?.response?.data;
                    const erros = {}

                    if (messages['adress.line']) erros.line = messages['adress.line'];
                    if (messages['adress.city']) erros.city = messages['adress.city'];
                    if (messages['adress.state']) erros.state = messages['adress.state'];
                    if (messages['adress.postal_code']) erros.postal_code = messages['adress.postal_code'];
                    if (messages['adress.country']) erros.country = messages['adress.country'];
                    
                    setErrors(erros)

                    if (messages?.products) {
                        Swal.fire({
                            title: "Error!",
                            text: rej.response.data.products,
                            icon: "error",
                        });
                    }

                }
            });

        }

    };

  return (
    <div className="fixed top-0 h-screen right-0 w-full flex justify-center items-center">
      <div className="fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60" />

      <div className="bg-white w-[98%] relative sm:w-[70%] lg:w-[55%] z-50 rounded-lg ">
        <div className="flex items-center justify-between p-3">
          <h1 className=" text-[22px] sm:text-[25px] md:text-[26px] lg:text-[25px] xl:text-[28px] font-bold">Shipping information</h1>
          <button onClick={() => closeModal(false)}>
            <IoMdCloseCircleOutline fontSize={25} />
          </button>
        </div>

        <hr className="border-gray-600" />

        <div className="flex flex-col gap-3 max-h-[88vh] sm:h-fit overflow-x-scroll hide-scrollbar p-2 sm:p-5">
            {isLoading && <div className="z-50"><Loading/></div>}
          <div className="border border-gray-400 p-2 rounded-lg">
            <h1 className="text-[19px] sm:text-[21px] md:text-[23px] lg:text-[23px] xl:text-[24px] text-primary_text font-bold">
              Fill in you address information
            </h1>

            <form className="relative flex flex-col gap-4 mt-3 p-2" onSubmit={checkout}>

            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row gap-1 md:gap-3 items-start md:items-center">
                    <label className=" font-semibold w-full  md:w-1/4">
                        Address Line:
                    </label>
                    <input
                        type="text"
                        value={line}
                        className={` ${errors?.line ? 'border-red-500' : 'border-gray-400'} border w-full md:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                        onChange={(e) => setLine(e.target.value)}
                    />
                </div>
                {errors.line && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.line}</span>}
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row gap-1 md:gap-3 items-start md:items-center">
                    <label className=" font-semibold w-full  md:w-1/4">
                        City
                    </label>
                    <input
                        type="text"
                        value={city}
                        className={` ${errors?.city ? 'border-red-500' : 'border-gray-400'} border w-full md:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                {errors.city && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.city}</span>}
            </div>

            <div className="flex flex-col">

                <div className="flex flex-col md:flex-row gap-1 md:gap-3 items-start md:items-center">
                    <label className=" font-semibold w-full  md:w-1/4">
                    State:
                    </label>
                    <input
                        type="text"
                        value={state}
                        className={` ${errors?.state ? 'border-red-500' : 'border-gray-400'} border w-full md:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>
                {errors.state && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.state}</span>}

            </div>

            <div className="flex flex-col">

                <div className="flex flex-col md:flex-row gap-1 md:gap-3 items-start md:items-center">
                    <label className=" font-semibold w-full  md:w-1/4">
                        Postal Code
                    </label>
                    
                    <input
                        type="text"
                        value={postal_code}
                        className={` ${errors?.postal_code ? 'border-red-500' : 'border-gray-400'} border w-full md:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                        onChange={(e) => setPostal_code(e.target.value)}
                    />
                    

                </div>
                    
                {errors.postal_code && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.postal_code}</span>}

            </div>
            
            <div className="flex flex-col">

                <div className="flex flex-col md:flex-row gap-1 md:gap-3 items-start md:items-center">
                    <label className=" font-semibold w-full  md:w-1/4">
                        Country
                    </label>
                    
                    <input
                        type="text"
                        value={country}                        
                        className={` ${errors?.country ? 'border-red-500' : 'border-gray-400'} border w-full md:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                        onChange={(e) => setCountry(e.target.value)}
                    />
                    
                </div>
                    
                {errors.country && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.country}</span>}

            </div>

            <button className="p-2 mx-auto w-full md:w-fit font-semibold bg-second text-white rounded-md" type="submit">Go To Payement</button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostumerAdress;
