import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Axios from '../../assets/constants/axios/axios';
import { Loading } from '../../components'

const ResetPassword = () => {
  
  const { token } = useParams();

  const [IsLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('')
  const [Password_C, setPassword_C] = useState('')

  const [ErrorPassword, setErrorPassword] = useState('')
  const [ErrorPassword_C, setErrorPassword_C] = useState('')

  useEffect(()=>{

    (async ()=>{

      try {
        
        const res = await Axios.post('/check-is-link-valide/' + token)
        
        if (res.status === 200) {
          
          if (!res.data) {
            window.location.href = '/auth/forget-password'
          }

          setIsLoading(false)

        }

      } catch (error) {
        
        Swal.fire({
          title : 'Error!',
          text : 'Invalid reset link. please try again',
          icon : 'error'
        })

        setTimeout(()=>{
          window.location.href = '/auth/forget-password'
        }, 2000)

      }

    })()

  }, [])

  const ResetPassword = async (e)=>{
    e.preventDefault()
    try {
      
      const res = await Axios.post('/reset-password/' + token,{
        password : password,
        password_confirmation : Password_C
      })

      if (res.status === 200) {
        
        Swal.fire({
          title : 'Success!',
          text : 'Your Password reset successfully',
          icon : 'success'
        })

        setTimeout(() => {
          window.location.href = '/auth/login'
        }, 2000);

      }

    } catch (rej) {
      
      if (rej.response.status === 422) {

        setErrorPassword(rej.response.data.password)
        setErrorName(rej.response.data.name)
        setErrorPassword_C(rej.response.data.confirmation_password)

        if (rej?.response?.data) {
          
          Swal.fire({
            title : 'Error!',
            text : 'Invalid reset link. please try again',
            icon : 'error'
          })

          setTimeout(()=>{
            window.location.href = '/auth/forget-password'
          }, 2000)

        }

      }

    }

  }

  return (
    <div className="min-h-screen flex px-5 sm:px-0 flex-col items-center justify-center bg-primary">
      <div className="flex relative flex-col bg-slate-50 backdrop-blur-lg shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        
        {
          IsLoading ? <Loading /> : ""
        }
        
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
          Reset your Password
        </div>

        <div className="mt-10 -z-10">
          <form action="#">

            <div className="flex flex-col mb-6">
              <label
                htmlFor="password_confirmation"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Password:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
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
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  className={`text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border ${ErrorPassword ? 'border-red-400' : 'border-gray-400'} w-full py-2 focus:outline-none focus:border-gray-400`} 
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {
                ErrorPassword ? <p className="text-red-500">{ErrorPassword}</p> : ''
              }
            </div>

            <div className="flex flex-col mb-6">
              <label
                htmlFor="password_confirmation"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Password Confirmation:
              </label>
              <div className="relative">
                <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
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
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>

                <input
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={Password_C}
                  className={`text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border ${ErrorPassword_C ? 'border-red-400' : 'border-gray-400'} w-full py-2 focus:outline-none focus:border-gray-400`} 
                  placeholder="Password Confirmation"
                  onChange={(e) => setPassword_C(e.target.value)}
                />
              </div>
              {
                ErrorPassword_C ? <p className="text-red-500">{ErrorPassword_C}</p> : ''
              }
            </div>

            <div className="flex w-full">
              <button
                onClick={(e) => ResetPassword(e)}
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-second hover:bg-red-400 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">Reset Password</span>
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

          </form>
        </div>

      </div>
    </div>
  )
}

export default ResetPassword