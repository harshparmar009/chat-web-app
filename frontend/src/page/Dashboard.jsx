import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/chat/Sidebar.jsx'
import { useLogoutMutation } from '../features/auth/authApi.js'
import { logoutApi } from '../features/auth/authSlice.js'
import ChatContainer from '../components/chat/ChatContainer.jsx'
import NoChatSelected from '../components/chat/NoChatSelected.jsx'

const Dashboard = () => {
    const [logout] = useLogoutMutation()
    
    const { user } = useSelector(state => state.auth)
    const { selectedUser } = useSelector(state => state.chat)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    
    const handleLogOut = async(e) => {
      e.preventDefault()

      try {
        const res = await logout().unwrap()
        dispatch(logoutApi())

        if (res.success) {
          console.log("user logout succefully");
          return navigate("/login")
        }
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
    
  return (
    <>
      

  <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {selectedUser ? <ChatContainer/> : <NoChatSelected/>}

          </div>
        </div>
      </div>
              <div className='flex flex-col items-center w-full gap-4'>
                <button onClick={handleLogOut}>Log Out</button>
              </div>
    </div>
    </>
  )
}

export default Dashboard
