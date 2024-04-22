import React, { useEffect, useState } from "react";
import Axios from "../../../assets/constants/axios/axios";
import { IoMdCloseCircleOutline } from 'react-icons/io'
import toast from "react-hot-toast";

const ProductM = ({closeModal, header, seterrorMessage, action, baseUrl, product, Products, setProducts, setFilteredProducts}) => {
    
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

    const [Price, setPrice] = useState('');
    const [ErrPrice, setErrPrice] = useState('');

    const [Categories, setCategories] = useState([]);

    useEffect(() => {

        (async()=>{
        
        try {

          const res = await Axios.get('/categories');
          console.log(res);
          if (res.status == 200) {
            
            setCategories(res.data)

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
          setimages(product?.images !== null ? product?.images : [])
          setoldImages(product?.images_path !== null ? product?.images_path : [])

        }

    }, [action, product])

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
        toast.loading('')
        
        let formData = new FormData();
        
        images.forEach((item, index) => {
          formData.append(`images[${index + 1}]`, item);
        });
        
        formData.append('name', Name);
        formData.append('quantity', Quantity);
        formData.append('category', CategoryID);
        formData.append('description', Description);
        formData.append('price', Price);

        try {

          const res = await Axios.post('/products', formData);
          
          if (res.status === 200) {
        

            setProducts([...Products, res.data.product])

            setFilteredProducts([...Products, res.data.product])

            seterrorMessage('')

            toast.dismiss()
            toast.success('Product Added Successfully')

            closeModal(false)


          }

        } catch (rej) {
          
          if (rej.response.status === 422) {
            
            const messages = rej.response.data;
            
            setErrCategoryID(messages?.category)
            setErrDescription(messages?.description)
            setErrName(messages?.name)
            seterrImages(messages?.images)
            setErrQuantity(messages?.quantity)
            setErrPrice(messages?.price)
            toast.dismiss()

          }

        }

    }

    const updateProduct = async (e, id) => {
      e.preventDefault()

      toast.loading('processing...')

      let form_Data = new FormData();
        
      images?.forEach((item, index) => {

        if (typeof(item) === 'string') {
          
          if (item.includes(oldImages[index])) {
            item = oldImages[index]
          }

        }

        form_Data.append(`images[${index + 1}]`, item);
      });

      oldImages?.forEach((item, index) => {
        form_Data.append(`old_images[${index + 1}]`, item);
      });
      
      form_Data.append('name', Name);
      form_Data.append('quantity', Quantity);
      form_Data.append('category', CategoryID);
      form_Data.append('description', Description);
      form_Data.append('price', Price);

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
        setFilteredProducts(UpdatedProducts)

        toast.dismiss()
        toast.success('Product updated Successfully')

        closeModal(false)
        
      } catch (rej) {
        
        if (rej.response.status === 422) {
          
          const messages = rej.response.data;
          
          setErrCategoryID(messages?.category)
          setErrDescription(messages?.description)
          setErrName(messages?.name)
          setErrQuantity(messages?.quantity)
          setErrPrice(messages?.price)
          seterrImages(messages?.images)
          toast.dismiss()

        }

      }

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
            <h1 className="text-[26px] text-[#324d67] font-bold">
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
                    className={` ${ErrName ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-[#324d67] outline-none`}
                    />
                </div>
                { ErrName && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrName}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                  <label className=" w-1/4">Images</label>
                  {
                    action !== 'show' && (
                    <input type='file' className="file:border file:bg-[#324D67] file:text-white file:font-semibold file:py-2 file:px-3 file:rounded-lg" multiple onChange={(e) => hundleChange(e) } />
                    )
                  }
                </div>
                { errImages && <p className="text-second font-semibold ml-[25%] px-4 py-1">{errImages}</p>}
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
                    className={` ${ErrQuantity ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-[#324d67] outline-none`}
                    />
                </div>
                { ErrQuantity && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrQuantity}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Description</label>
                    <textarea
                    type="text"
                    disabled={action === 'show'}
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={` ${ErrDescription ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-[#324d67] outline-none`}
                    />
                </div>
                { ErrDescription && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrDescription}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Price</label>
                    <input
                    type="text"
                    disabled={action === 'show'}
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={` ${ErrPrice ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-[#324d67] outline-none`}
                    />
                </div>
                { ErrPrice && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrPrice}</p>}
              </div>

              <div className="flex flex-col">

                <div className="flex gap-3 items-center">
                    <label className=" w-1/4">Category</label>
                    <select disabled={action === 'show'} onChange={(e) => setCategoryID(e.target.value)} 
                        className={` ${ErrCategoryID ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-[#324d67] outline-none`} name="category">
                        <option disabled selected={true}>Select Category</option>
                        {
                            Categories?.map((item) => (
                                <option key={item.id} value={item.id} selected={CategoryID === item.id} >{item.name}</option>
                            ))
                        }
                    </select>
                </div>

                { ErrCategoryID && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrCategoryID}</p>}

              </div>
              {
                action === 'create' && <button onClick={(e) => createProduct(e)} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">Save</button>
              }

              {
                action === 'update' && <button onClick={(e) => updateProduct(e, product.id)} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">Save</button>
              }
              {
                action === 'show' && 
                <button onClick={(e) => closeModal(false)} className="p-2 mx-auto w-[20%] font-semibold bg-gray-500 text-white rounded-md">Close</button>
              }

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductM;
