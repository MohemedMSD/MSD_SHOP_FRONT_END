import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import Axios from '../../../assets/constants/axios/axios';

const CategoryM = ({category, Categories, header, action, closeModal, setCategories, setFilteredCategories, seterrorMessage}) => {

    const [Name, setName] = useState('');
    const [ErrName, setErrName] = useState('');

    const [Image, setImage] = useState('');
    const [ErrImage, setErrImage] = useState('');

    useEffect(() => {
      
        if (action === 'update' || action === 'show' && category) {
          
          setName(category?.name)
          setImage(category?.image)

        }

    }, [action])

    const hundleChange = (e) => {
      const imagesTypes = ['jpg', 'jpeg', 'png', 'webp']

      if (e.target.files[0] !== undefined) {
          
          if (e.target.files[0].size > 1024 * 1024) {
              setErrImage('One or more files exceed the maximum size of 1MB');
          }if(!imagesTypes.includes(e.target.files[0].name.split('.').pop())){
              setErrImage('One or more files exceed the type not image');
          } else {
            
              setImage(e.target.files[0])
  
          }

      }else{
          setImage('')
          setErrImage('If You want to change your picture select an image ');
      }

    }

    const createCategory = async (e) => {
        e.preventDefault()

        let formData = new FormData()
        formData.append('name', Name)
        formData.append('image', Image)

        try {
          
          const res = await Axios.post('/categories', formData)
          if (res.status === 200) {
        

            setCategories([...Categories, res.data])


            setFilteredCategories([...Categories, res.data])
            seterrorMessage('')
            toast.success('Category Created Successfully')
            closeModal(false)

          }

        } catch (rej) {
          
          if (rej.response.status === 422) {
            
            const messages = rej.response.data;
            
            if (messages.name ) {
              setErrName(messages.name)
            }else{
              setErrName('')
            }
            
            if (messages.image ) {
              setErrImage(messages.image)
            }else{
              setErrImage('')
            }

          }

        }

    }

    const updateCategory = async (e, id) => {
      e.preventDefault()

      let formData = new FormData()
      formData.append('name', Name)

      if (typeof(Image) !== 'string') {
        formData.append('image', Image)
      }

      try {
        
        const res = await Axios.post('/categories-management/' + id, formData)
        
        const UpdatedCategories = Categories.map((item) => {
          
          if (item.id === id) {
            return {
              ...item,
              name : Name,
            }
          }

          return item

        })

        setCategories(UpdatedCategories)
        setFilteredCategories(UpdatedCategories)
        seterrorMessage('')
        toast.success('Category Updated Successfully')
        closeModal(false)

      } catch (rej) {
        
        if (rej.response.status === 422) {
          
          const messages = rej.response.data;
          
          if (messages.name ) {
            setErrName(messages.name)
          }else{
            setErrName('')
          }
          
          if (messages.image ) {
            setErrImage(messages.image)
          }else{
            setErrImage('')
          }

        }

      }

    }

  return (
    
    <div className="fixed top-0 h-screen right-0 w-full flex justify-center items-center">
      <div className="fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60" />

      <div className="bg-white w-[98%] sm:w-[70%] lg:w-[55%] z-50 rounded-lg  hide-scrollbar overflow-y-scroll">

        <div className="flex items-center justify-between p-3">
          <h1 className="text-[28px] font-bold">{header}</h1>
          <button onClick={() => closeModal(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
        </div>

        <hr className="border-gray-600" />

        <div className="flex flex-col gap-3 p-2 sm:p-5">

          <div className="border border-gray-400 p-2 rounded-lg">
            <h1 className="text-[26px] text-[#324d67] font-bold">
              Category Information :
            </h1>
            <form action="" className="relative flex flex-col gap-4 mt-3 p-2">

              <div className="flex flex-col">
                <div className={`w-[150px] ${!Image ? 'flex items-center justify-center' : ''} h-[150px] bg-gray-300 mx-auto mb-2 rounded-lg`}>
                    {Image ? <img className="h-full rounded-lg w-full" src={ typeof(Image) === 'string' ? localStorage.getItem('baseUrl') + '/uploads/' + Image : URL.createObjectURL(Image)} alt="profile" /> : <div className="bg-gray-400 w-full h-full flex items-center justify-center text-[23px] text-white rounded-lg">No Image</div>}
                </div>
                <div className="flex gap-3 items-center">
                    <label className=" w-1/4">Image</label>
                    <input
                    fileName={Image}
                    onChange={(e) => hundleChange(e)}
                    type="file"
                    className={`border w-3/4 ${ErrImage === '' ? 'border-gray-400' : 'border-second'} rounded-lg py-2 px-3 focus:border-[#324d67] outline-none`}
                    />
                </div>
                {ErrImage !== '' && <p className="text-second font-semibold mt-2">{ErrImage}</p>}
              </div>

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
              
              {
                action === 'create' && <button onClick={(e) => createCategory(e)} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">Save</button>
              }

              {
                action === 'update' && <button onClick={(e) => updateCategory(e, category.id)} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">Save</button>
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
  )
}

export default CategoryM