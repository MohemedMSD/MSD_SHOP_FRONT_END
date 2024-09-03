import React from 'react'
import { Navigate, Outlet} from 'react-router-dom'
import { SideBar, Footer, Header } from '../components'
import { useStateContext } from '../context/StateContext';

const Dashboard = () => {
  
  const {user} = useStateContext();

  
  if (!user) {

    return <Navigate to="/auth/login" />

  }else if (!user.verified_at) {

    return <Navigate to="/auth/send-verification-code" />

  }else if (user.role !== 'seller') {

    return <Navigate to="/" />
    
  }

  return (
    <div className="relative h-screen overflow-hidden flex">
        <SideBar />

        <div className="flex-1 flex flex-col h-screen bg-white">

          <Header/>

          <div className="sm:px-10 w-screen lg:w-[calc(100vw_-_250px)] px-6 py-5 h-screen overflow-y-scroll hide-scrollbar">
            
              <Outlet/>
              
          </div>


        </div>

      </div>
  )
}

export default Dashboard
