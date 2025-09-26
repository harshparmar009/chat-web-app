import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAcceptedUsersQuery, useMessageCounterQuery } from '../features/chat/chatApi'
import { setSelectedUser } from '../features/chat/chatSlice'
import ChatContainer from '../components/chat/ChatContainer';
import NoChatSelected from '../components/chat/NoChatSelected';

const Messages = () => {

  const { data: counter } = useMessageCounterQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 5000,
  });
  
  const { data, isLoading, error } = useGetAcceptedUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,});

  const [showOnlineOnly, setShowOnlineOnly] = useState(false)    
  const dispatch = useDispatch()
  const {selectedUser} = useSelector(state => state.chat)
  
  const { onlineUsers } = useSelector(state => state.auth || [])

    
  
    const users = data?.users || [];
  
  if (isLoading || !data?.users) return <p>Loading users...</p>;
  if(error){
    console.log("Users fetch Error:" , error);
  }
  
  const filteredUsers = showOnlineOnly
  ? users.filter((user) => onlineUsers.includes(user._id)) : users;

  const handleUserSelect = (user) => {      
    dispatch(setSelectedUser(user));
  }

  const totalUnseen = counter?.reduce(
    (sum, chat) => sum + (chat.unseenCount || 0),
    0
  ) || 0;  

  const perUserCounter = {};
counter?.forEach(chat => {
  perUserCounter[chat.friend._id] = chat.unseenCount;
});

  return (
    <div className='h-full flex '>
 
      {/* chat main content */}
          <div className="flex flex-1 overflow-hidden gap-4 pt-4">
            {/* Inbox List */}
            <section className="w-1/3 border-r border-gray-700 bg-gray-800 rounded-xl">
              <div className="p-3">
                <h2 className="flex justify-between text-sm mb-2">
                  <span>Inbox</span>
                {totalUnseen > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {totalUnseen} New
                  </span>
                )}
              </h2>
              
                <div className="flex space-x-2 text-xs mb-4">
                  <button className="text-blue-400">All</button>
                  <button>Unread</button>
                  <button>Group</button>
                </div>
                              
              </div>
                
                <div className='h-[80%] overflow-y-auto'>
              {users.map((user) => {
                 const unseen = perUserCounter[user._id] || 0;
          return(
          <button
            key={user._id}
            onClick={() => handleUserSelect(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `
        }
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-8 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user?.userName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

                  {/* Per-user unseen badge */}
                {unseen > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unseen}
                  </span>
                )}

          </button> )
              })}


        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
                </div>
            </section>
  
           
      {selectedUser ? <ChatContainer/> : <NoChatSelected/>}
          </div>

    </div>
  )
}

export default Messages


