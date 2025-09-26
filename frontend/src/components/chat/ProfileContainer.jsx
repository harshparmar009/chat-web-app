import { Mail, User } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChatRequestMutation } from '../../features/chat/chatApi'

const ProfileContainer = () => {

    const [ chatRequest ] = useChatRequestMutation()

    const {user, error } = useSelector((state) => state.auth)
    
    const { userProfile } = useSelector(state => state.chat)

    const [req, setReq] = useState(true);

    useEffect(() => {
      const checkReq = async() => {
        try {
          const res = await chatRequest({senderId: user._id, receiverId: userProfile._id}).unwrap()
          setReq(res.data.success)
          
          
        } catch (error) {
          console.log(error);
          
        }
    }
    checkReq()
    },[user._id])

    const handleChatRequest = async() => {

      try {
        const res = await chatRequest({senderId: user._id, receiverId: userProfile._id}).unwrap()
        // dispatch(logoutApi())

        // if (res.success) {
        //   console.log("user logout succefully");
        //   return navigate("/login")
        // }
      } catch (error) {
        console.error("failed", error);
      }
    }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gray-800 rounded-xl">
      <div className="">
        <div className="rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>


          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userProfile?.userName}</p>
            </div>
            
          

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userProfile?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{userProfile.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

          <div className='mt-6 rounded-xl'>
            {req ? <button 
            onClick={handleChatRequest}
            className='px-3 py-2 bg-base-300'>
              Send Request
            </button> : <button 
            className='px-3 py-2 bg-base-300'>
              Already Send
            </button> }
           
          </div>


        </div>
      </div>
    </div>
  )
}

export default ProfileContainer
