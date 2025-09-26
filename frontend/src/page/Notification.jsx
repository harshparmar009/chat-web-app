import React from 'react'
import { useGetChatRequestQuery, useChatRequestAcceptMutation, useChatRequestDeclineMutation } from '../features/chat/chatApi'
import { useSelector } from 'react-redux'

const Notification = () => {

    const [ chatRequestAccept ] = useChatRequestAcceptMutation();
    const [ chatRequestDecline ] = useChatRequestDeclineMutation();
    const {user, error } = useSelector((state) => state.auth)
    const {data: request, isLoading, refatch} = useGetChatRequestQuery(user?._id, {
        skip: !user
    })
    
   const handleAccept = async(userId) => {
    const req  = await chatRequestAccept(userId).unwrap()
    console.log(req.message);
    refatch()
    
    }

    const handleDecline = async(userId) => {
       const req = await chatRequestDecline(userId).unwrap()
       console.log(req.message);
       refatch()

    }

  return (
    <div className='h-full flex'>
      <div className="flex flex-1 overflow-hidden gap-4 pt-4">
          {/* Inbox List */}
          <section className="w-1/3 border-r border-gray-700 bg-gray-800 rounded-xl">

           <div className='p-3' >
                {request?.length === 0 && <p>no new request</p>}
                {request?.map((req) => (
                    <div key={req._id} className='border p-2 rounded mb-2'>

                        <div className='flex'>
                            <img src={req.profilePic} alt='profile' className='size-14 rounded-full object-cover border-4' />

                            <p><b>{req.userName}</b></p>
                        </div>

                       <div className='flex items-center gap-2 mt-2'>
                        <button 
                        onClick={() => handleAccept(req._id)}
                        className='bg-green-500 text-white px-2 py-1 rounded'>Accept</button>

                        <button 
                        onClick={() => handleDecline(req._id)}
                        className='bg-green-500 text-white px-2 py-1 rounded'>Decline</button>
                       </div>
                    </div>
                ))}
           </div>

          </section>

        </div>
  </div>
  )
}

export default Notification
