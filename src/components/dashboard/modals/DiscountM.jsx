import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { CostumeSelect, Loading } from '../..'
import { bg_colors } from '../../../assets/constants/axios'
import Axios from '../../../assets/constants/axios/axios'
import { useFunctionsContext } from '../../../context/FunctionsContext'

const DiscountM = ({
  closeModal, 
  setCurrentPage,
  setReload, 
  header, 
  discount, 
  action, 
  Discounts, 
  setDiscounts,
}) => {

  
    const {goToPreviousPage, goToNextPage, totalPages, settotalPages, renderPages} = useFunctionsContext()

    const [Title, setTitle] = useState('')
    const [ErrTitle, setErrTitle] = useState('')

    const [Desc, setDesc] = useState('')
    const [ErrDesc, setErrDesc] = useState('')

    const [Discount, setDiscount] = useState('')
    const [ErrDiscount, setErrDiscount] = useState('')

    const [Color, setColor] = useState('')
    const [ErrColor, setErrColor] = useState('')

    const [Start_date, setStart_date] = useState('')
    const [ErrStart_date, setErrStart_date] = useState('')

    const [End_date, setEnd_date] = useState('')
    const [ErrEnd_date, setErrEnd_date] = useState('')

    const [StatusID, setStatusID] = useState('')  
    const [products, setProducts] = useState([])
    const [isLoading, setisLoading] = useState(true)
    const [totalProducts, setTotalProducts] = useState(0)

    const [current_page, setCurrent_page] = useState(1);

    // const [Bg_colors, setBg_colors] = useState([
    //     {id : 1,from : '#1872f9', to : '#1872f9bf', button : '#000000'},
    //     {id : 2,from : '#d1d5dbcc', to : '#f3f4f6', button : '#f02d34'},
    //     {id : 3,from : '#f02d34', to : '#f02d34c2', button : '#000000'},
    //     {id : 4,from : '#5cff00', to : '#a9f57efa', button : '#000000'},
    //     {id : 5,from : '#2dcc6f', to : '#2dcc6f82', button : '#000000'}
    // ]);
    
    useEffect(() => {

      if (action === 'update' || action === 'show' && discount) {
            
        setTitle(discount.title)
        setDesc(discount.desc)
        setDiscount(discount.discount)
        setStart_date(discount.start_date)
        setEnd_date(discount.end_date)
        setProducts(discount.products)
        setColor(JSON.parse(discount.color))
        setStatusID(JSON.parse(discount.active))

      }

    }, [action, discount])

    useEffect(() => {

      (async() =>{
        setisLoading(true)

        if (action != 'create') {
          
          setisLoading(true)
          try {
            
            const res = await Axios.get(`/products-discount/${discount.id}/${current_page}`)

            if (res.status == 200) {
              
              setProducts(res.data.products)
              settotalPages(res.data.total_pages)
              setTotalProducts(res.data.TotalProducts)

            }
    
          } catch (error) {
            console.log(error);
          }
          setisLoading(false)

        }

      })()
      

    }, [current_page])

    const updateDiscount = async(e, id) => {
        e.preventDefault()

        toast.loading('Processing...')

        try {
        
          const res = await Axios.post('/update-discount/' + id, {
            _method : 'put',
            title : Title,
            desc : Desc,
            discount : Discount,
            color : JSON.stringify(Color),
            start_date : Start_date,
            end_date : End_date,
            active : StatusID
          }, {
            headers: {
              'Content-Type' : 'text/json'
            } 
          })
  
          if (res.status) {

            const newArray = Discounts.map((item) => {

              if (item.id == id) {

                return {
                  ...res.data.data,
                  id : id
                }

              }

              return item

            })

            setDiscounts(newArray)

            toast.dismiss()
            toast.success('Discount updated successfully')
            closeModal(false)
  
          }
  
        } catch (rej) {
          
          if (rej.response.status == 422) {
            
            toast.dismiss()
            toast.error('The information is incorrect or or invalid')
            let messages = rej.response.data;
  
            setErrTitle(messages.title || '')
            setErrDesc(messages.desc || '')
            setErrDiscount(messages.discount || '')
            setErrColor(messages.color || '')
            setErrStart_date(messages.start_date || '')
            setErrEnd_date(messages.end_date || '')
  
          }else{
            toast.dismiss()
            toast.error('Something wrong, please try again.')
          }
  
        }
  
    }

    const createDiscount = async (e) => {
      
      e.preventDefault()
      toast.loading('Processing...')

      try {
        
        const res = await Axios.post('/discount', {
          title : Title,
          desc : Desc,
          discount : Discount,
          color : JSON.stringify(Color),
          start_date : Start_date,
          end_date : End_date
        })

        if (res.status == 201) {
          
          setCurrentPage(1);
          toast.dismiss()
          toast.success('Discount created successfully')
          setReload(pre => !pre)
          closeModal(false)

        }

      } catch (rej) {
        
        if (rej.response.status == 422) {
          
          toast.dismiss()
          toast.error('The information is incorrect or or invalid')
          let messages = rej.response.data;

          setErrTitle(messages.title || '')
          setErrDesc(messages.desc || '')
          setErrDiscount(messages.discount || '')
          setErrColor(messages.color || '')
          setErrStart_date(messages.start_date || '')
          setErrEnd_date(messages.end_date || '')

        }else{
          toast.dismiss()
          toast.error('Something wrong, please try again.')
        }

      }

    }

  return (
    <div className="fixed top-0 h-screen z-50 right-0 w-full flex justify-center items-center">
      <div className="fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60" />

      <div className="bg-white w-[98%] sm:w-[70%] lg:w-[55%] z-50 rounded-lg ">

        <div className="flex items-center justify-between p-3">
          <h1 className="text-[28px] font-bold">{header}</h1>
          <button onClick={() => closeModal(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
        </div>

        <hr className="border-gray-600" />

        <div className="flex flex-col gap-3 max-h-[85vh] hide-scrollbar overflow-y-scroll p-2 sm:p-5">

          <div className="border border-gray-400 p-2 rounded-lg">
            <h1 className="text-[26px] text-primary_text font-bold">
              Discount Information :
            </h1>
            <form onSubmit={(e) => e.preventDefault()} action="" className="relative flex flex-col gap-4 mt-3 p-2">

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Title</label>
                    <input
                    type="text"
                    disabled={action === 'show'}
                    value={Title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={` ${ErrTitle ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrTitle && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrTitle}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Desc</label>
                    <input
                    type="text"
                    disabled={action === 'show'}
                    value={Desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className={` ${ErrDesc ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrDesc && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrDesc}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Discount</label>
                    <input
                    type="number"
                    min={0}
                    max={100}
                    disabled={action === 'show'}
                    value={Discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className={` ${ErrDiscount ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrDiscount && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrDiscount}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Start Date</label>
                    <input
                    type="date"
                    disabled={action === 'show'}
                    value={Start_date}
                    onChange={(e) => setStart_date(e.target.value)}
                    className={` ${ErrStart_date ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrStart_date && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrStart_date}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">End Date</label>
                    <input
                      type="date"
                      disabled={action === 'show'}
                      value={End_date}
                      onChange={(e) => setEnd_date(e.target.value)}
                      className={` ${ErrEnd_date ? 'border-red-500' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrEnd_date && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrEnd_date}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">  
                    <label className=" w-1/4">Color</label>
                    <CostumeSelect action={action} Color={Color} setColor={setColor} ErrColor={ErrColor} bg_gradient={bg_colors}/>
                </div>
                { ErrColor && <p className="text-red-500 font-semibold ml-[25%] px-4 py-1">{ErrColor}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Status</label>
                    <select
                      disabled={action === 'show'}
                      onChange={(e) => setStatusID(e.target.value)}
                      className={` border-gray-400 border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    >
                      <option selected disabled>Select Status</option>
                      <option selected={StatusID == 1} value={1}>Enable</option>
                      <option selected={StatusID == 0} value={0}>disable</option>
                    </select>
                </div>
              </div>
              
              {
                ((isLoading || totalProducts > 0) && action != 'create') && (
                  <div className='w-full'>

                    <h6 className='text-2xl font-semibold text-primary_text text-center py-2'>Products ({totalProducts})</h6>
                    
                      <div className='w-full relative'>
                      {
                        isLoading && <div className='h-[25vh]'><Loading/></div>
                      }

                      <table className='w-full mt-2'>
                        <thead className='border-b'>
                          <th className='text-center pb-1'>ID</th>
                          <th className='text-center pb-1'>Name</th>
                          <th className='text-center pb-1'>Price</th>
                        </thead>
                        <tbody>
                          {
                            products?.map((item, index) => (
                              <tr key={index}>
                                <td className='text-center p-2'>{item?.id}</td>
                                <td className='text-center text-nowrap p-2 font-semibold'>{item?.name}</td>
                                <td className='text-center p-2 flex items-center justify-center text-nowrap'>
                                  <s className='mr-1 text-gray-500'>${item?.price}</s>
                                  <p className='font-semibold'>
                                  ${
                                    Math.round((item?.price - item?.price * Discount/100) * 100 ) / 100
                                  }
                                  </p>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>

                      <div className="border-b p-5 border-gray-300 px-3 flex items-center gap-4 justify-center">
              
                        <ol className="flex justify-center gap-1 text-[16px] font-medium">
                          <li>
                            <button
                              onClick={() => goToPreviousPage(setCurrent_page)}
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

                          {
                              renderPages(current_page, totalPages, setCurrent_page)
                          }
                          <li>
                            <button
                              onClick={()=>goToNextPage(setCurrent_page)}
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

                  </div>
                )
              }
              
              {
                action === 'create' && <button onClick={(e) => createDiscount(e)} className="p-2 mx-auto w-full sm:w-fit font-semibold bg-second text-white rounded-md">Create</button>
              }

              {
                action === 'update' && <button onClick={(e) => updateDiscount(e, discount.id)} className="p-2 mx-auto w-full sm:w-fit font-semibold bg-second text-white rounded-md">Save</button>
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
  )
}

export default DiscountM