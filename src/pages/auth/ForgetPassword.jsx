import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Axios from '../../assets/constants/axios/axios'
import { Loading, Timer } from '../../components'

const ForgetPassword = () => {

    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(sessionStorage.getItem('timer') ? sessionStorage.getItem('timer') != 0 : false)

    const [email, setEmail] = useState('')
    const [ErrorEmail, setErrorEmail] = useState('')
    const [SendButton, setSendButton] = useState(sessionStorage.getItem('timer') ? sessionStorage.getItem('timer') == 0 : true)
    const [timeRemaining, setTimeRemaining] = useState(sessionStorage.getItem('timer') || 0);
    
    const sendResetLink = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            
            const res = await Axios.post('/forget-password', {
                email : email,
                baseUrl : window.location.origin
            })

            if (res.status === 200) {

                setError(false);
                setSuccess(true)

                sessionStorage.setItem('timer', 30)
                setTimeRemaining(30)

                sessionStorage.setItem('userEmail', email)
                setSendButton(false)

                setErrorEmail('')
            }

        } catch (rej) {
            
            if (rej.response?.status === 422) {
                
                if (rej.response?.data?.email && rej.response?.data?.email[0] !== '') {
                    setErrorEmail(rej.response.data.email)
                }else{
                    setError(true);
                    setSuccess(false)
                }

            }

        }
        setIsLoading(false)
    }

  return (
    <div className="min-h-screen flex px-5 sm:px-0 flex-col items-center justify-center bg-primary">
      <div className="flex relative flex-col bg-slate-50 backdrop-blur-lg shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        
        {
          isLoading ? <Loading /> : ""
        }
        
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
          Forget To Your Password
        </div>

        <div className="mt-10 -z-10">
          <form action="#">

            <div className="flex flex-col mb-6">
              <label
                htmlFor="email"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                E-Mail Address:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>

                <input
                  id="email"
                  type="email"
                  value={email}
                  name="email"
                  className={`text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border ${ErrorEmail ? 'border-red-400' : 'border-gray-400'} w-full py-2 focus:outline-none focus:border-gray-400`} placeholder="E-Mail Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {
                ErrorEmail? <p className="text-red-500">{ErrorEmail}</p> : ''
              }
              {
                success && !error && (
                    <>
                        <h2 className='text-center mt-4 font-semibold text-[18px]'>The verification code sended to your email : <span className='text-second font-bold'>{sessionStorage.getItem('userEmail')}</span></h2>
                        <Timer setSuccess={setSuccess} setSendButton={setSendButton} timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining}/>
                    </>
                )
              }
              {
                error && !success && <h2 className='text-center mt-4 text-red-500 font-semibold text-[20px]'>Sometimes wrong, please try later!</h2>
              }
            </div>
              {
                SendButton && (
                    <div className="flex w-full">
                      <button
                        onClick={(e)=>sendResetLink(e)}
                        type="submit"
                        className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-second hover:bg-red-400 rounded py-2 w-full transition duration-150 ease-in"
                      >
                        <span className="mr-2 uppercase">Send reset Link</span>
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
                )
              }
          </form>
        </div>

        <div className="flex justify-center items-center mt-6">
          <NavLink
            to='/auth/login'
            className="inline-flex items-center font-bold text-second hover:text-red-700 text-xs text-center"
          >
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
                <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </span>
            <span className="ml-2">Login</span>
          </NavLink>
        </div>

      </div>
    </div>
  )
}

export default ForgetPassword