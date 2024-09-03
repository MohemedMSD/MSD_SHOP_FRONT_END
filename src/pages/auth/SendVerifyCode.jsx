import React, { useEffect, useState } from 'react'
import Axios from '../../assets/constants/axios/axios';
import { Loading, Timer } from '../../components'
import { useStateContext } from "../../context/StateContext";

const SendVerifyCode = () => {
    
  const {user, setUser} = useStateContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(true)
  const [SendButton, setSendButton] = useState(sessionStorage.getItem('timer') == 0 || false)
  const [timeRemaining, setTimeRemaining] = useState(sessionStorage.getItem('timer') || 0); // 10 دقائق (600 ثانية)


  if (!user) {
    window.location.href = '/auth/login'
  }else if (user.verified_at) {
    window.location.href = '/'
  }

  useEffect(()=>{
    
    if (timeRemaining == 0) {
      
      setSendButton(true)
      setSuccess(false)

    }

  }, [timeRemaining])

  const sendVerificationLink = async()=>{
    
    if (sessionStorage.getItem('timer') == 0 || !sessionStorage.getItem('timer')) {
      
      setIsLoading(true)

        try {
                    
          const res = await Axios.post('/send-verification-code', {
            baseUrl : window.location.origin
          })
        
          if (res.status == 200) {
                            
            sessionStorage.setItem('timer', 30)
            sessionStorage.setItem('userEmail', res.data)

            setTimeRemaining(30)

            setSuccess(true)
            setError(false)

            setSendButton(false)
        
          }
        
        } catch (error) {
            
            setSuccess(false)
            setError(true)
        
        }

        setIsLoading(false)

    }

  }

  const logout = async() => {

    try {
        
        const res = await Axios.post('/logout')
        if (res.status === 200) {
            setUser();
            sessionStorage.removeItem('timer');
            sessionStorage.removeItem('userEmail');
            <Navigate to='/'/>
        }

    } catch (error) {
        console.log(error);
    }

  }
  

  return (
    <div className="min-h-screen flex px-5 sm:px-0 flex-col items-center justify-center bg-primary">
      <div className="flex relative gap-[52px] justify-center items-center flex-col bg-slate-50 backdrop-blur-lg shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md h-[58vh] w-full max-w-md">
        
        {
          isLoading ? <div className='z-50'><Loading /></div> : ""
        }
        
        <div className="self-center">
          <h2 className='font-medium text-center mb-2 text-xl sm:text-2xl uppercase text-gray-800'>Email verification</h2>
          <p>click on button for send you verification link</p>
        </div>

        <div className="-z-10 flex flex-col gap-[45px]">
            {
              !error && success && (
                <>
                  <h2 className='text-center font-semibold text-[18px]'>The verification code sended to your email : <span className='text-second font-bold'>{sessionStorage.getItem('userEmail')}</span></h2>
                  <Timer setSendButton={setSendButton} setSuccess={setSuccess} timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining}/>
                </>
              )
            }
            {
              error && !success && <h2 className='text-center text-red-500 font-semibold text-[20px]'>Sometimes wrong, please try later!</h2>
            }

            {
              SendButton && (
                <button
                  onClick={() => sendVerificationLink()}
                    type="submit"
                    className="flex items-center uppercase justify-center focus:outline-none text-second px-3 hover:text-white text-sm sm:text-base font-semibold border border-second bg-transparent hover:bg-second rounded py-2 w-full transition duration-150 ease-in"
                  >
                    Send verification link
                </button>
              )
            }
            {/* <p className='text-center'>This code will expire in 10 minutes.<span className='text-second'>resend link</span></p> */}
        </div>
        <div className=' absolute bottom-[2rem] w-[86%]'>
            <button
                type="submit"
                onClick={()=>logout()}
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-second hover:bg-red-400 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">Logout</span>
                <span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </button>
        </div>

        <div className="flex justify-center items-center mt-6">
            
        </div>
      </div>
    </div>
  )
}

export default SendVerifyCode