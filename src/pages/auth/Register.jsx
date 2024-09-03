import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { NavLink } from 'react-router-dom'
import Axios from '../../assets/constants/axios/axios'
import {Loading} from '../../components'

const Register = () => {
  
  const [IsLoading, setIsLoading] = useState(false)

  const [Name, setName] = useState()
  const [Email, setEmail] = useState()
  const [Password, setPassword] = useState()
  const [Password_C, setPassword_C] = useState()

  const [ErrorName, setErrorName] = useState()
  const [ErrorEmail, setErrorEmail] = useState()
  const [ErrorPassword, setErrorPassword] = useState()
  const [ErrorPassword_C, setErrorPassword_C] = useState()

  const hundlClick = (e) => {
    
    e.preventDefault()

    setIsLoading(true)
    setErrorName('')
    setErrorEmail('')
    setErrorPassword('')
    setErrorPassword_C('')

    Axios.post('/register', {
      name : Name,
      email : Email,
      password : Password,
      password_confirmation : Password_C
    })
    .then((res) => {

      toast.success('Your Account Created Successfully')
      window.location.href = '/auth/login'

    }).catch((rej) => {

      setIsLoading(false)

      if (rej.response.status === 422) {

        if (rej.response.data.email !== '') {
          setErrorEmail(rej.response.data.email)
        }

        setErrorPassword(rej.response.data.password)
        setErrorName(rej.response.data.name)
        setErrorPassword_C(rej.response.data.confirmation_password)

      }

    })
  }

  return (
    <div className="min-h-screen flex px-5 sm:px-0 flex-col items-center justify-center bg-primary">
      <div className="flex relative flex-col bg-slate-50 backdrop-blur-lg shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
        
        {
          IsLoading ? <Loading /> : ""
        }
        
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
          Create A New Account
        </div>

        <div className="mt-10 -z-10">
          <form action="#">
          <div className="flex flex-col mb-6">
              <label
                htmlFor="email"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
              >
                Name:
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
                  name="email"
                  className={`text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border ${ErrorName ? 'border-red-400' : 'border-gray-400'} w-full py-2 focus:outline-none focus:border-gray-400`} placeholder="User Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {
                ErrorName? <p className="text-red-500">{ErrorName}</p> : ''
              }
            </div>

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
                  name="email"
                  className={`text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border ${ErrorEmail ? 'border-red-400' : 'border-gray-400'} w-full py-2 focus:outline-none focus:border-gray-400`} placeholder="E-Mail Address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {
                ErrorEmail? <p className="text-red-500">{ErrorEmail}</p> : ''
              }
            </div>

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
                onClick={(e) => hundlClick(e)}
                type="submit"
                className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-second hover:bg-red-400 rounded py-2 w-full transition duration-150 ease-in"
              >
                <span className="mr-2 uppercase">Register</span>
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
            <span className="ml-2">Do you Have Account ?</span>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Register