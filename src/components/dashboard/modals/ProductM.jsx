import React, { useEffect, useState } from "react";
import Axios from "../../../assets/constants/axios/axios";
import { IoMdCloseCircleOutline } from 'react-icons/io'
import toast from "react-hot-toast";
import { validate_Price } from "../../../assets/constants/HelpFunctions";

const ProductM = ({
  closeModal, 
  setCurrentPage, 
  header, 
  setReload, 
  seterrorMessage, 
  action, 
  product, 
  Products, 
  setProducts,
  setSearchQuery,
  setSearchAction,
  setStockSearchQuery
}) => {
    
    const [ProductID, setProductID] = useState(0);

    const [Name, setName] = useState('');
    const [ErrName, setErrName] = useState('');

    const [images, setimages] = useState([]);
    const [oldImages, setoldImages] = useState([]);
    const [errImages, seterrImages] = useState('')

    const [Quantity, setQuantity] = useState('');
    const [ErrQuantity, setErrQuantity] = useState('');

    const [CategoryID, setCategoryID] = useState('');
    const [ErrCategoryID, setErrCategoryID] = useState('');

    const [Description, setDescription] = useState('');
    const [ErrDescription, setErrDescription] = useState('');

    const [Price, setPrice] = useState(0);
    const [ErrPrice, setErrPrice] = useState('');

    const [PurchasePrice, setPurchasePrice] = useState(0);
    const [ErrPurchasePrice, setErrPurchasePrice] = useState('');

    const [Categories, setCategories] = useState([]);

    const [DiscountID, setDiscountID] = useState(null);

    const [Discounts, setDiscounts] = useState([]);
    const [ErrDiscounts, setErrDiscounts] = useState('');

    const [ProductDiscount, setProductDiscount] = useState(null)

    useEffect(() => {
      
        (async()=>{
        
          try {

            const product_id = product ? product?.id : 'null';
            const res = await Axios.get('/discount-select/' + product_id);

            if (res.status == 200) {
              
              setCategories(res.data.categories)
              setDiscounts(res.data.discounts)
              console.log(res.data.discounts?.filter(item => item.selected)[0]?.id);
              setDiscountID(res.data.discounts?.filter(item => item.selected)[0]?.id || null)

            }

          } catch (error) {
            console.log(error);
          }

        })();
      
        if (action === 'update' || action === 'show' && product) {
          
          setCategoryID(product?.category_id)
          setDescription(product?.description)
          setName(product?.name)
          setQuantity(product?.quantity)
          setPrice(product?.price)
          setPurchasePrice(product?.purchase_price)
          setProductDiscount(product?.discount)
          setimages(product?.images !== null ? product?.images : [])
          setoldImages(product?.images_path !== null ? product?.images_path : [])

        }

    }, [action, product])

    useEffect(()=>{

      if (PurchasePrice > Price) {
        
        setErrPrice('You will lose if you sell this product at this price')

      }else{
        setErrPrice('')
      }

    }, [Price, PurchasePrice])

    const hundleChange = (e) => {
      const selectedFiles = Array.from(e.target.files).slice(0, 4); // Limit to 4 files

      const imagesTypes = ['jpg', 'jpeg', 'png', 'webp']
      // Validate file size
      const invalidFiles = selectedFiles.filter(file => file.size > 1024 * 1024); // 1MB
      
      const FileNotImage = selectedFiles.filter((file) => {
        const imageType = file.name.split('.').pop();
        return !imagesTypes.includes(imageType.toLowerCase())
      })
      
      if (invalidFiles.length > 0) {
        seterrImages('One or more files exceed the maximum size of 1MB');
      }if(FileNotImage.length > 0){
        seterrImages('One or more files exceed the type not image');
      } else {
          
            let newArray = []
            
            if (images?.length === 0) {
              newArray = selectedFiles
            }else{
              newArray = [...images, ...selectedFiles]
            }

            if (newArray.length <= 4) {
              setimages(newArray);
              seterrImages('');
            }else{
              seterrImages('We accepted just 4 pictures')
            }

        }

    }

    const removeImage = (index) => {

      let newArray = [...images];
      newArray.splice(index, 1);
      setimages(newArray)

    } 
    
    const createProduct = async (e) => {
        e.preventDefault()
        toast.loading('Processing...')
        
        let formData = new FormData();
        
        images.forEach((item, index) => {
          formData.append(`images[${index + 1}]`, item);
        });
        
        formData.append('name', Name);
        formData.append('quantity', Quantity);
        formData.append('category', CategoryID);
        formData.append('description', Description);
        formData.append('price', Math.round(Price * 100) / 100);
        formData.append('purchase_price', Math.round(PurchasePrice * 100) / 100);
        formData.append('discount_id', DiscountID)

        try {

          const res = await Axios.post('/products', formData);
          
          if (res.status === 200) {
  
            setSearchAction(true)
            setSearchQuery(Name)
            setStockSearchQuery(Name)
            seterrorMessage('')

            toast.dismiss()
            toast.success('Product Added Successfully')
            setCurrentPage(1)
            setReload(pre => !pre)
            closeModal(false)


          }

        } catch (rej) {
          
          toast.dismiss()

          if (rej.response.status === 422) {
            
            const messages = rej.response.data;
            
            setErrCategoryID(messages?.category)
            setErrDescription(messages?.description)
            setErrName(messages?.name)
            seterrImages(messages?.images)
            setErrQuantity(messages?.quantity)
            setErrPrice(messages?.price)
            setErrPurchasePrice(messages?.purchase_price)
            
            toast.error('The information is incorrect or or invalid')

          }else{

            toast.error('Something wrong, please try again')

          }

        }

    }

    const updateProduct = async (e, id) => {  
      e.preventDefault()

      toast.loading('Processing...')
      
      let form_Data = new FormData();
        
      images?.forEach((item, index) => {

        let image = item;
        
        if (typeof(image) == 'string') {
          
          const old_image = oldImages.filter(old_image => item.includes(old_image));

          if (old_image?.length > 0) {
            image = old_image[0]
          }

        }

        form_Data.append(`images[${index + 1}]`, image);
      });

      oldImages?.forEach((item, index) => {
        form_Data.append(`old_images[${index + 1}]`, item);
      });
      
      form_Data.append('name', Name);
      form_Data.append('quantity', Quantity);
      form_Data.append('category', CategoryID);
      form_Data.append('description', Description);
      form_Data.append('price', Math.round(Price * 100) / 100);
      form_Data.append('purchase_price', Math.round(PurchasePrice * 100) / 100);
      form_Data.append('discount_id', DiscountID)
      form_Data.append('_method', 'PUT');

      try {

        const res = await Axios.post('/products-management/' + id, form_Data);

        const UpdatedProducts = Products.map((item) => {
          
          if (item.id === id) {
            return {
              ...item,
              name : Name,
              quantity : Quantity,
              category_id : CategoryID,
              description : Description,
              price : Price,
              category_name : Categories.find((item) => {return item.id == CategoryID} ).name
            }
          }

          return item

        })

        setProducts(UpdatedProducts)
        toast.dismiss()
        toast.success('Product updated Successfully')

        closeModal(false)
        
      } catch (rej) {
        
        toast.dismiss()

        if (rej.response.status === 422) {
          
          const messages = rej.response.data;
          
          setErrCategoryID(messages?.category)
          setErrDescription(messages?.description)
          setErrName(messages?.name)
          setErrQuantity(messages?.quantity)
          setErrPrice(messages?.price)
          setErrPurchasePrice(messages?.purchase_price)
          seterrImages(messages?.images)

          toast.error('The information is incorrect or or invalid')

        }else{

          toast.error('Something wrong, please try again')

        }

      }

    }

    const hundelChangeDiscount = (id) => {

      setDiscounts(pre => {

        return pre?.map(item => {

          if (item?.id == id) {
            
            setDiscountID(id)
            setProductDiscount(item?.discount)

            return {
              ...item,
              selected : true
            }

          }

          return {
            ...item,
            selected : false
          }

        })

      })

    }

  return (
    <div className="fixed top-0 h-screen right-0 w-full flex justify-center items-center">
      <div className="fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60" />

      <div className="bg-white w-[98%] sm:w-[70%] lg:w-[55%] z-50 rounded-lg">

        <div className="flex items-center justify-between p-3">
          <h1 className="text-[28px] font-bold">{header}</h1>
          <button onClick={() => closeModal(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
        </div>

        <hr className="border-gray-600" />

        <div className="flex h-[89vh] hide-scrollbar overflow-y-scroll flex-col gap-3 p-2 sm:p-5">

          <div className="border border-gray-400 p-2 rounded-lg">
            <h1 className="text-[26px] text-primary_text font-bold">
              Product Information :
            </h1>
            <form action="" encType="multipart/form-data" className="relative flex flex-col gap-4 mt-3 p-2">
              <input type="hidden" name="_method" value="put"/>
              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Name</label>
                    <input
                    type="text"
                    disabled={action === 'show'}
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    className={` ${ErrName ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrName && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrName}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                  <label className=" w-1/4">Images</label>
                  {
                    action !== 'show' && (
                    <input type='file' className="file:border file:bg-primary_text file:text-white file:font-semibold file:py-2 file:px-3 file:rounded-lg" multiple onChange={(e) => hundleChange(e) } />
                    )
                  }
                </div>
                { errImages && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{errImages}</p>}
                <div className="flex justify-start w-full gap-y-2 gap-x-8  px-2 py-5 flex-wrap">
                  {
                    images?.map((item, index) => (
                      <div key={index} className=" w-[100px] h-[100px] rounded-lg relative">
                        {action !== 'show' && <IoMdCloseCircleOutline onClick={() => removeImage(index)} fontSize={20} className="text-second cursor-pointer absolute top-3 right-0"/>}
                        <img className=" max-h-full max-w-full" src={ typeof(item) !== 'string' ? URL.createObjectURL(item) : item}/>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex gap-3 items-center">
                    <label className=" w-1/4">quantity</label>
                    <input
                    value={Quantity}
                    disabled={action === 'show'}
                    type="number"
                    onChange={(e) => setQuantity(e.target.value)}
                    className={` ${ErrQuantity ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrQuantity && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrQuantity}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Description</label>
                    <textarea
                    type="text"
                    disabled={action === 'show'}
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={` ${ErrDescription ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrDescription && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrDescription}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Price($)</label>
                    <input
                    type="text"
                    disabled={action === 'show'}
                    value={Price}
                    onChange={(e) => validate_Price(e.target.value, setPrice)}
                    className={` ${ErrPrice ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrPrice && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrPrice}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Purchase price($)</label>
                    <input
                    type="text"
                    disabled={action === 'show'}
                    value={PurchasePrice}
                    onChange={(e) => validate_Price(e.target.value, setPurchasePrice)}
                    className={` ${ErrPurchasePrice ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrPurchasePrice && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrPurchasePrice}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Profit($)</label>
                    <input
                    type="text"
                    disabled
                    value={Math.round((Price - PurchasePrice) * 100 ) / 100}
                    className={`border-gray-400 border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
              </div>


              <div className="flex flex-col">

                <div className="flex gap-3 items-center">
                    <label className=" w-1/4">Category</label>
                    <select disabled={action === 'show'} onChange={(e) => setCategoryID(e.target.value)} 
                        className={` ${ErrCategoryID ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`} name="category">
                        <option disabled selected={true}>Select Category</option>
                        {
                            Categories?.map((item) => (
                                <option key={item.id} value={item.id} selected={CategoryID === item.id} >{item.name}</option>
                            ))
                        }
                    </select>
                </div>

                { ErrCategoryID && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrCategoryID}</p>}

              </div>

              <div className="flex flex-col">

                <div className="flex gap-3 items-center">
                    <label className=" w-1/4">Discounts</label>
                    <select disabled={action === 'show'} onChange={(e) => hundelChangeDiscount(e.target.value)} 
                        className={` ${ErrDiscounts ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`} name="category">
                        <option disabled selected={true}>Select Discount</option>
                        {
                            Discounts?.map((item) => (
                                <option key={item.id} value={item.id} selected={item.selected} >{item.title}</option>
                            ))
                        }
                    </select>
                </div>

                { ErrDiscounts && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrDiscounts}</p>}

              </div>

              {
                ProductDiscount && (
                  <>
                    <div className="flex flex-col">
                      <div className="flex  gap-3 items-center">
                          <label className=" w-2/4">Price with discount</label>
                          <input
                          type="text"
                          disabled
                          value={
                            Math.round((Price - (Price * ProductDiscount / 100)) * 100) / 100
                          }
                          className={`border w-2/4 border-gray-400 rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                          />
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex  gap-3 items-center">
                          <label className=" w-2/4">Profit with discount</label>
                          <input
                          type="text"
                          disabled
                          value={
                            Math.round(((Price - (Price * ProductDiscount / 100)) - PurchasePrice) * 100 ) / 100
                          }
                          className={`border w-2/4 border-gray-400 rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                          />
                      </div>
                    </div>
                  </>
                )
              }

              {
                action === 'create' && <button onClick={(e) => createProduct(e)} className="p-2 mx-auto w-full sm:w-fit font-semibold bg-second text-white rounded-md">Save</button>
              }

              {
                action === 'update' && <button onClick={(e) => updateProduct(e, product.id)} className="p-2 mx-auto w-full sm:w-fit font-semibold bg-second text-white rounded-md">Save</button>
              }
              {
                action === 'show' && 
                <button onClick={(e) => closeModal(false)} className="p-2 mx-auto w-full sm:w-fit font-semibold bg-gray-500 text-white rounded-md">Close</button>
              }

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductM;
