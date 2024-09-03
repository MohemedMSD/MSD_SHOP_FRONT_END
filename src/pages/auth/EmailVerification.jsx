import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Axios from '../../assets/constants/axios/axios'
import { Loading } from '../../components'
import { useStateContext } from '../../context/StateContext'

const EmailVerification = () => {

    const {token} = useParams()
    const {setUser, user} = useStateContext()

    if (!user) {
        window.location.href = '/auth/login'
      }else if (user.verified_at) {
        window.location.href = '/'
      }

    useEffect(()=>{

            (async()=>{
    
                try {
                    
                    const res = await Axios.post('/email-verification/' + token);
    
                    if (res.status === 200) {
                        
                        setUser({...user, verified_at : res.data.verified_at})
                        Swal.fire({
                            title : 'Success!',
                            text : 'Your email verified successfly',
                            icon : 'success',
                            confirmButtonText : 'Go To Shopping',
                            confirmButtonColor : '#f02d34'
                        }).then((result)=> {
                            if (result.isConfirmed) {
                                window.location.href = '/'
                            }
                        })
                        sessionStorage.removeItem('timer')
                        sessionStorage.removeItem('userEmail')
                    }
    
                } catch (error) {
                    Swal.fire({
                        title : 'Error!',
                        text : 'Invalid verification link.',
                        icon : 'error',
                        confirmButtonText : 'Go to Verify',
                        confirmButtonColor : '#f02d34'
                    }).then((result)=> {
                        if (result.isConfirmed) {
                            window.location.href = '/auth/send-verification-code'
                        }
                    })
                }
    
            })()
        
    }, [])

  return (
    <div><Loading/></div>
  )
}

export default EmailVerification