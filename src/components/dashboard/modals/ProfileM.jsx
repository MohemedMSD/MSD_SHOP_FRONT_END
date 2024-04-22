import React, { useState } from "react";
import { IoMdCloseCircleOutline } from 'react-icons/io'
import Axios from "../../../assets/constants/axios/axios";
import { useStateContext } from "../../../context/StateContext";
import Loading from "../../Loading";

const ProfileM = ({hundleClick, ProfilModal}) => {
    const {user, setUser} = useStateContext()

    const [isLoading, setIsLoading] = useState(false)

    const [name, setname] = useState(user.name)
    const [ErrName, setErrName] = useState('')

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

    const updateProfileInfo = async (action) => {

        let formData = new FormData();

        if (action === 'update name') {
            formData.append('name', name)
            formData.append('profile', Image)
        }

        if (action === 'update email') {
            formData.append('email', email)
            formData.append('password', Password)
        }

        setIsLoading(true)

        try {
            
            const res = await Axios.post('/update-information', formData)
            if (res.status === 200) {
                
                setUser({...res.data, token : user.token});
                setemail(res.data.email)
                setname(res.data.name)
                setPassword('')
                setErrName('')
                setErrEmail('')
                setErrPassword('')
                setIsLoading(false)

            }

        } catch (rej) {
            
            if (rej.response.status === 422) {
                setIsLoading(false)
                setErrName(rej.response.data.name)

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

            <div className="flex items-center justify-between text-[#324D67] p-3">
                <h1 className="text-[30px] font-bold">Profile</h1>
                <button onClick={() => hundleClick(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
            </div>

            <hr className="border-gray-600" />

            <div className="flex flex-col gap-3 p-2 sm:p-5 overflow-y-scroll h-[88vh] sm:h-[84vh] hide-scrollbar">
                {isLoading && <Loading/>}

                <div className="border border-gray-400 text-[#324D67] p-2 rounded-lg">
                    <h1 className="text-[26px] font-bold">
                    Profile Information :
                    </h1>
                    <div className="flex text-[#324D67] flex-col gap-4 mt-3 p-2">
                        <div className="flex flex-col">
                            <div className={`w-[100px] ${!Image ? 'flex items-center justify-center' : ''} h-[100px] bg-gray-300 rounded-lg`}>
                                {Image ? <img className="h-full w-full" src={ typeof(Image) === 'string' ? localStorage.getItem('baseUrl') + '/uploads/' + Image : URL.createObjectURL(Image)} alt="profile" /> : <p className="font-bold uppercase text-[50px]">{user.name.slice(0,1)}</p>}
                            </div>
                            <div className="flex gap-3 items-center">
                                <label className=" w-1/4">Full Name</label>
                                <input
                                onChange={(e) => hundleChange(e)}
                                type="file"
                                className="border w-3/4 border-gray-400 rounded-lg py-2 px-3 focus:border-[#324d67] outline-none"
                                />
                            </div>
                            {ErrImage !== '' && <p className="text-second mt-2">{ErrImage}</p>}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex gap-3 items-center">
                                <label className=" w-1/4">Full Name</label>
                                <input
                                type="text"
                                onChange={(e) => setname(e.target.value)}
                                value={name}
                                className="border w-3/4 border-gray-400 rounded-lg py-2 px-3 focus:border-[#324d67] outline-none"
                                />
                            </div>
                            {ErrName !== '' && <p className="text-second mt-2">{ErrName}</p>}
                        </div>

                        <button onClick={() => updateProfileInfo('update name')} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">
                            Save
                        </button>
                    </div>
                </div>

                <div className="border border-gray-400 text-[#324D67] p-2 rounded-lg">
                    <h1 className="text-[26px] font-bold">
                    Update Email:
                    </h1>
                    <div className="flex text-[#324D67] flex-col gap-4 mt-3 p-2">
                        <div className="flex flex-col">

                            <div className="flex gap-3 items-center">
                                <label className=" w-1/4">Email</label>
                                <input
                                type="text"
                                onChange={(e) => setemail(e.target.value)}
                                value={email}
                                className="border w-3/4 border-gray-400 rounded-lg py-2 px-3 focus:border-[#324d67] outline-none"
                                />
                            </div>
                            {ErrEmail !== '' && <p className="text-second mt-2">{ErrEmail}</p>}
                        </div>

                        <div className="flex flex-col">

                            <div className="flex gap-3 items-center">
                                <label className=" w-1/4">Password</label>
                                <input
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={Password}
                                className="border w-3/4 border-gray-400 rounded-lg py-2 px-3 focus:border-[#324d67] outline-none"
                                />
                            </div>
                            {ErrPassword !== '' && <p className="text-second mt-2">{ErrPassword}</p>}
                        </div>

                        <button onClick={() => updateProfileInfo('update email')} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">
                            Save
                        </button>
                    </div>
                </div>

                <div className="border border-gray-400 text-[#324D67] p-2 rounded-lg">
                    <h1 className="text-[26px] font-bold">
                    Modify Password :
                    </h1>
                    <div className="flex flex-col gap-4 mt-3 p-2">
                    <div className="flex flex-col">

                        <div className="flex gap-3 items-center">
                            <label className=" w-1/4">Current Password</label>
                            <input
                            value={CurrentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            type="password"
                            className="border w-3/4 border-gray-400 rounded-lg py-2 px-3 focus:border-[#324d67] outline-none"
                            />
                        </div>

                        {ErrCurrentPassword !== '' && <p className="text-second mt-2">{ErrCurrentPassword}</p>}
                    </div>

                    <div className="flex flex-col">

                        <div className="flex gap-3 items-center">
                            <label className=" w-1/4">New Password</label>
                            <input
                            value={PasswordU}
                            type="text"
                            onChange={(e) => setPasswordU(e.target.value)}
                            className="border w-3/4 border-gray-400 rounded-lg py-2 px-3 focus:border-[#324d67] outline-none"
                            />
                        </div>
                        {ErrPasswordU !== '' && <p className="text-second mt-2">{ErrPasswordU}</p>}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex gap-3 items-center">
                            <label className=" w-1/4">Confirme Password</label>
                            <input
                            value={Password_Confirmation}
                            onChange={(e) => setPassword_Confirmation(e.target.value)}
                            type="text"
                            className="border w-3/4 border-gray-400 rounded-lg py-2 px-3 focus:border-[#324d67] outline-none"
                            />
                        </div>
                        {ErrPassword_Confirmation !== '' && <p className="text-second mt-2">{ErrPassword_Confirmation}</p>}
                    </div>

                    <button onClick={() => updatePassword()} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">
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
