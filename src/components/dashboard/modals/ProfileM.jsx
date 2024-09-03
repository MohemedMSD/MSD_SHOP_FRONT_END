import React, { useState } from "react";
import { IoMdCloseCircleOutline } from 'react-icons/io'
import Axios from "../../../assets/constants/axios/axios";
import {FaEye, FaEyeSlash} from 'react-icons/fa'
import { useStateContext } from "../../../context/StateContext";
import Loading from "../../Loading";
import { useEffect } from "react";

const ProfileM = ({hundleClick, ProfilModal}) => {
    const {user, setUser} = useStateContext()

    const [isLoading, setIsLoading] = useState(true)

    const [name, setname] = useState(user.name)
    const [ErrName, setErrName] = useState('')

    const [line, setLine] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postal_code, setPostal_code] = useState("");
    const [country, setCountry] = useState("");

    const [errors, setErrors] = useState({});

    const [email, setemail] = useState(user.email)
    const [ErrEmail, setErrEmail] = useState('')

    const [Password, setPassword] = useState('')
    const [ErrPassword, setErrPassword] = useState('')

    const [Image, setImage] = useState(user.profile ? user.profile : '')
    const [ErrImage, setErrImage] = useState('')



    const [PasswordU, setPasswordU] = useState('')
    const [ErrPasswordU, setErrPasswordU] = useState('')

    const [Password_Confirmation, setPassword_Confirmation] = useState('')
    const [ErrPassword_Confirmation, setErrPassword_Confirmation] = useState('')

    const [CurrentPassword, setCurrentPassword] = useState('')
    const [ErrCurrentPassword, setErrCurrentPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showCurrPassword, setShowCurrPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfPassword, setShowConfPassword] = useState(false)

    useEffect(()=>{

        (async()=>{
            setIsLoading(true)
            try {
                
                const res = await Axios.get('/user')

                if (res.status == 200) {
                    
                    setname(res.data.name)
                    setImage(res.data.profile)
                    setemail(res.data.email)
                    setLine(res.data.adress.line)
                    setCity(res.data.adress.city)
                    setState(res.data.adress.state)
                    setPostal_code(res.data.adress.postal_code)
                    setCountry(res.data.adress.country)

                }

            } catch (error) {
                console.log(error);
            }
            setIsLoading(false)
        })()

    }, [])

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

    const validateForm = () => {
        const newErrors = {};
        if (!line) newErrors.line = 'Address Line is required';
        if (!city) newErrors.city = 'City is required';
        if (!state) newErrors.state = 'State is required';
        if (!postal_code) newErrors.postal_code = 'Postal Code is required';
        if (!country) newErrors.country = 'Country is required';
        else if (postal_code.length > 10) newErrors.postal_code = 'Postal Code is too long';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateProfileInfo = async (action) => {

        if (validateForm() && action == 'update name' || action === 'update name') {
            
            let formData = new FormData();

            if (action === 'update name') {
                formData.append('name', name)
                formData.append('profile', Image)

                formData.append('adress[line]', line)
                formData.append('adress[city]', city)
                formData.append('adress[state]', state)
                formData.append('adress[postal_code]', postal_code)
                formData.append('adress[country]', country)

            }
    
            if (action === 'update email') {
                formData.append('email', email)
                formData.append('password', Password)
            }
    
            setIsLoading(true)
    
            try {
                
                const res = await Axios.post('/update-information', formData)
                if (res.status === 200) {
                    
                    const old_user_info = JSON.parse(localStorage.getItem('user'))

                    setUser({
                        ...res.data, 
                        verified_at : action === 'update email' ? null : old_user_info.verified_at, 
                        token : user.token
                    })

                    setemail(res.data.email)
                    setname(res.data.name)
                    setPassword('')
                    setErrName('')
                    setErrEmail('')
                    setErrPassword('')
                    setIsLoading(false)
                    setErrors({})
    
                }
    
            } catch (rej) {
                
                if (rej.response.status === 422) {
                    setIsLoading(false)
                    setErrName(rej.response.data.name || '')
    
                    const erros = {}

                    if (rej.response.data['adress.line']) erros.line = rej.response.data['adress.line'];
                    if (rej.response.data['adress.city']) erros.city = rej.response.data['adress.city'];
                    if (rej.response.data['adress.state']) erros.state = rej.response.data['adress.state'];
                    if (rej.response.data['adress.postal_code']) erros.postal_code = rej.response.data['adress.postal_code'];
                    if (rej.response.data['adress.country']) erros.country = rej.response.data['adress.country'];

                    setErrors(erros)

                    if (rej.response.data.email ) {
                        setErrEmail(rej.response.data.email)
                    }else{
                        setErrEmail('')
                    }
    
                    if (rej.response.data.password ) {
                        setErrPassword(rej.response.data.password)
                    }else{
                        setErrPassword('')
                    }
                }
    
            }

        }


    }

    const updatePassword = async () => {
        setIsLoading(true)

        try {
            
            const res = await Axios.post('/update-password', {
                current_password : CurrentPassword,
                password : PasswordU,
                password_confirmation : Password_Confirmation
            })

            if (res.status === 200) {

                setPassword_Confirmation('')
                setErrPassword_Confirmation('')

                setCurrentPassword('')
                setErrCurrentPassword('')

                setPasswordU('')
                setErrPasswordU('')

                setIsLoading(false)
            }

        } catch (rej) {
            
            if (rej.response.status === 422) {
                
                if (rej.response.data.password) {
                    setErrPasswordU(rej.response.data.password)
                }else{
                    setErrPasswordU('')
                }

                if (rej.response.data.current_password) {
                    setErrCurrentPassword(rej.response.data.current_password)
                }else{
                    setErrCurrentPassword('')
                }

                if (rej.response.data.password_confirmation) {
                    setErrPassword_Confirmation(rej.response.data.password_confirmation)
                }else{
                    setErrPassword_Confirmation('')
                }
                
                setIsLoading(false)

            }

        }

    }

  return (
    <div className={`fixed top-0 h-screen right-0 w-full flex justify-center items-center z-50`}>

        <div className='fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60' />

        <div className="bg-white relative w-[98%] sm:w-[70%] lg:w-[55%] z-50 rounded-lg">

            <div className="flex items-center justify-between text-primary_text p-3">
                <h1 className="text-[30px] font-bold">Profile</h1>
                <button onClick={() => hundleClick(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
            </div>

            <hr className="border-gray-600" />

            <div className="flex flex-col gap-3 p-2 sm:p-5 overflow-y-scroll h-[88vh] sm:h-[84vh] hide-scrollbar">
                {isLoading && <div className="z-50"><Loading/></div>}

                <div className="border border-gray-400 text-primary_text p-2 rounded-lg">
                    <h1 className="text-[26px] font-bold">
                    Profile Information :
                    </h1>
                    <div className="flex text-primary_text flex-col gap-4 mt-3 p-2">

                        <div className="flex flex-col">

                            <div className={`w-[150px] ${!Image ? 'flex items-center justify-center' : ''} h-[150px] mx-auto sm:mx-0 bg-gray-300 mb-3 rounded-lg`}>
                                {Image ? <img className="h-full rounded-lg w-full" src={ typeof(Image) === 'string' ? Image : URL.createObjectURL(Image)} alt="profile" /> : <p className="font-bold uppercase text-[50px]">{user.name.slice(0,1)}</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
                                <label className="w-full sm:w-1/4 font-semibold">Picture</label>
                                <input
                                onChange={(e) => hundleChange(e)}
                                type="file"
                                className="border w-full sm:w-3/4 border-gray-400 rounded-lg py-2 px-3 focus:border-primary_text outline-none"
                                />
                            </div>

                            {ErrImage !== '' && <p className="text-red-500 mt-2">{ErrImage}</p>}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
                                <label className=" w-full font-semibold sm:w-1/4">Full Name</label>
                                <input
                                type="text"
                                onChange={(e) => setname(e.target.value)}
                                value={name}
                                className={`border ${ErrName !== '' ? 'border-red-500' : 'border-gray-400'} w-full sm:w-3/4 rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                />
                            </div>
                            {ErrName !== '' && <p className="text-red-500 mt-2">{ErrName}</p>}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start sm:items-center">
                                <label className=" font-semibold w-full  sm:w-1/4">
                                    Address Line:
                                </label>
                                <input
                                    type="text"
                                    value={line}
                                    className={` ${errors?.line ? 'border-red-500' : 'border-gray-400'} border w-full sm:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                    onChange={(e) => setLine(e.target.value)}
                                />
                            </div>
                            {errors.line && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.line}</span>}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start sm:items-center">
                                <label className=" font-semibold w-full  sm:w-1/4">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    className={` ${errors?.city ? 'border-red-500' : 'border-gray-400'} border w-full sm:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            {errors.city && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.city}</span>}
                        </div>

                        <div className="flex flex-col">

                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start sm:items-center">
                                <label className=" font-semibold w-full  sm:w-1/4">
                                State:
                                </label>
                                <input
                                    type="text"
                                    value={state}
                                    className={` ${errors?.state ? 'border-red-500' : 'border-gray-400'} border w-full sm:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>
                            {errors.state && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.state}</span>}

                        </div>

                        <div className="flex flex-col">

                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start sm:items-center">
                                <label className=" font-semibold w-full  sm:w-1/4">
                                    Postal Code
                                </label>
                                
                                <input
                                    type="text"
                                    value={postal_code}
                                    className={` ${errors?.postal_code ? 'border-red-500' : 'border-gray-400'} border w-full sm:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                    onChange={(e) => setPostal_code(e.target.value)}
                                />
                                

                            </div>
                                
                            {errors.postal_code && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.postal_code}</span>}

                        </div>
                        
                        <div className="flex flex-col">

                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 items-start sm:items-center">
                                <label className=" font-semibold w-full  sm:w-1/4">
                                    Country
                                </label>
                                
                                <input
                                    type="text"
                                    value={country}                        
                                    className={` ${errors?.country ? 'border-red-500' : 'border-gray-400'} border w-full sm:w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                                
                            </div>
                                
                            {errors.country && <span className="text-red-500 font-semibold md:ml-[25%] md:px-4 py-1">{errors.country}</span>}

                        </div>

                        <button 
                            onClick={() => updateProfileInfo('update name')} 
                            className="p-2 w-full mx-auto sm:w-[20%] font-semibold bg-second text-white rounded-md"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="border border-gray-400 text-primary_text p-2 rounded-lg">
                    <h1 className="text-[26px] font-bold">
                    Update Email:
                    </h1>
                    <div className="flex text-primary_text flex-col gap-4 mt-3 p-2">
                        <div className="flex flex-col">

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
                                <label className=" w-full sm:w-1/4">Email</label>
                                <input
                                type="text"
                                onChange={(e) => setemail(e.target.value)}
                                value={email}
                                className={`border w-full sm:w-3/4 ${ErrEmail !== '' ? 'border-red-500' : 'border-gray-400'}  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                />
                            </div>
                            {ErrEmail !== '' && <p className="text-red-500 mt-2">{ErrEmail}</p>}
                        </div>

                        <div className="flex flex-col">

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
                                <label className="w-full sm:w-1/4">Password</label>
                                <div className="relative w-full sm:w-3/4">
                                    <input
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={Password}
                                    className={`border w-full ${ErrEmail !== '' ? 'border-red-500' : 'border-gray-400'}  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                    />
                                    {
                                        showPassword ? 
                                        <FaEyeSlash  onClick={() => setShowPassword(false)} className='right-2  top-[50%] -translate-y-[50%] absolute'/>
                                        :
                                        <FaEye onClick={() => setShowPassword(true)} className='right-2  top-[50%] -translate-y-[50%] absolute'/>
                                    }
                                </div>
                            </div>
                            {ErrPassword !== '' && <p className="text-red-500 mt-2">{ErrPassword}</p>}
                        </div>

                        <button onClick={() => updateProfileInfo('update email')} className="p-2 w-full mx-auto sm:w-[20%] font-semibold bg-second text-white rounded-md">
                            Save
                        </button>
                    </div>
                </div>

                <div className="border border-gray-400 text-primary_text p-2 rounded-lg">
                    <h1 className="text-[26px] font-bold">
                    Modify Password :
                    </h1>
                    <div className="flex flex-col gap-4 mt-3 p-2">
                    <div className="flex flex-col">

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
                            <label className=" w-full sm:w-1/4">Current Password</label>
                            <div className="w-full sm:w-3/4 relative">
                                <input
                                value={CurrentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                type={showCurrPassword ? 'text' : 'password'}
                                className={`border w-full ${ErrEmail !== '' ? 'border-red-500' : 'border-gray-400'}  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                />
                                {
                                    showCurrPassword ? 
                                    <FaEyeSlash  onClick={() => setShowCurrPassword(false)} className='right-2  top-[50%] -translate-y-[50%] absolute'/>
                                    :
                                    <FaEye onClick={() => setShowCurrPassword(true)} className='right-2  top-[50%] -translate-y-[50%] absolute'/>
                                }
                            </div>
                        </div>

                        {ErrCurrentPassword !== '' && <p className="text-red-500 mt-2">{ErrCurrentPassword}</p>}
                    </div>

                    <div className="flex flex-col">

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
                            <label className=" w-full sm:w-1/4">New Password</label>
                            <div className="w-full sm:w-3/4 relative">
                                <input
                                value={PasswordU}
                                type={showNewPassword ? 'text' : 'password'}
                                onChange={(e) => setPasswordU(e.target.value)}
                                className={`border w-full ${ErrEmail !== '' ? 'border-red-500' : 'border-gray-400'}  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                />
                                {
                                    showNewPassword ? 
                                    <FaEyeSlash  onClick={() => setShowNewPassword(false)} className='right-2  top-[50%] -translate-y-[50%] absolute'/>
                                    :
                                    <FaEye onClick={() => setShowNewPassword(true)} className='right-2  top-[50%] -translate-y-[50%] absolute'/>
                                }
                            </div>
                        </div>
                        {ErrPasswordU !== '' && <p className="text-red-500 mt-2">{ErrPasswordU}</p>}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
                            <label className=" w-full sm:w-1/4">Confirme Password</label>
                            <div className="w-full sm:w-3/4 relative">
                                <input
                                value={Password_Confirmation}
                                onChange={(e) => setPassword_Confirmation(e.target.value)}
                                type={showConfPassword ? 'text' : 'password'}
                                className={`border w-full ${ErrEmail !== '' ? 'border-red-500' : 'border-gray-400'}  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                                />
                                {
                                    showConfPassword ? 
                                    <FaEyeSlash  onClick={() => setShowConfPassword(false)} className='right-2  top-[50%] -translate-y-[50%] absolute'/>
                                    :
                                    <FaEye onClick={() => setShowConfPassword(true)} className='right-2  top-[50%] -translate-y-[50%] absolute'/>
                                }
                            </div>
                        </div>
                        {ErrPassword_Confirmation !== '' && <p className="text-red-500 mt-2">{ErrPassword_Confirmation}</p>}
                    </div>

                    <button onClick={() => updatePassword()} className="p-2 w-full mx-auto sm:w-[20%] font-semibold bg-second text-white rounded-md">
                        Save
                    </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default ProfileM;
