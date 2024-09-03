import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Axios from '../../assets/constants/axios/axios'
import Loading from '../Loading'

const CancelCom = () => {

    const CHECKOUT_SESSION_ID = useParams()
    
    useEffect(()=>{

        Axios.get('/cancel/' + CHECKOUT_SESSION_ID.CHECKOUT_SESSION_ID)
        .then((res) => {
            if (res.status === 200) {
                Swal.fire({
                    title : 'Your Operation Canceled',
                    icon : 'success',
                    showConfirmButton : false
                })

                setTimeout(() => {
                    window.location.href = '/'
                }, 750);
            }
        })
        .then((rej) => console.log(rej))

    }, [])

  return (
    <div className='relative bg-white h-[92vh]'>
        <Loading/>
    </div>
  )
}

export default CancelCom