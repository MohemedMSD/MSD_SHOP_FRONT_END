import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Axios from '../../assets/constants/axios/axios'
import Loading from '../Loading'

const SuccessCom = () => {
    const CHECKOUT_SESSION_ID = useParams()
    const [IsLoading, setIsLoading] = useState(true)

    useEffect(()=>{

        Axios.post('/success/' + CHECKOUT_SESSION_ID.CHECKOUT_SESSION_ID)
        .then((res) => {

            if (res.status === 200) {
                setIsLoading(false)
                Swal.fire({
                    title : 'Paymenet Succeessfully !',
                    text : 'Your purchase success',
                    icon : 'success',
                    confirmButtonText : 'Continue Shopping',
                    confirmButtonColor : '#f02d34'
                }).then((result)=> {
                    if (result.isConfirmed) {
                        window.location.href = '/'
                    }
                })

            }

        })
        .catch((rej) => {
            
            if (rej.response?.status == 422) {
                
                window.location.href = '/'

            }

        })

    }, [])

  return (
    <div className='relative h-[92vh] bg-white'>
        {IsLoading && <Loading/>}
    </div>
  )
}
export default SuccessCom
