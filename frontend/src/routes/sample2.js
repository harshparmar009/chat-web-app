//src/page/Dashboard
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

//src/components/chat/Sidebar.jsx
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllUsersQuery } from '../../features/chat/chatApi'
import { setSelectedUser } from '../../features/chat/chatSlice'

const Sidebar = () => {

    const [showOnlineOnly, setShowOnlineOnly] = useState(false)    
    const dispatch = useDispatch()
    const {selectedUser} = useSelector(state => state.chat)
    
    const { onlineUsers } = useSelector(state => state.auth || [])
    const { data, isLoading, error } = useGetAllUsersQuery(undefined, {
      refetchOnMountOrArgChange: true,});

  
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
    

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          {/* <Users className="size-6" /> */}
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
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
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
    
  )
}

export default Sidebar

//src/components/chat/ChatContainer
import React, { useEffect, useRef, useState } from 'react'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import { useDispatch, useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../../features/chat/chatApi';
import { clearMessages, collectMessages } from '../../features/chat/chatSlice';
import {formatMessageTime} from '../../lib/utils.js'
import { getSocket } from '../../service/socket.js';

const ChatContainer = () => {

    const { selectedUser, messages } = useSelector(state => state.chat) || [];
    const { user } = useSelector(state => state.auth);

    const socket = getSocket();
    const [typingStatus, setTypingStatus] = useState(false);


    const messageEndRef = useRef(null);

    const dispatch = useDispatch();
    
    const {data, isLoading, isSuccess } = useGetMessagesQuery(selectedUser._id, {
      skip: !selectedUser._id,
      refetchOnMountOrArgChange: true,
    })

    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //typing feature
    useEffect(() => {
      if (!socket || !selectedUser) return;
    
      socket.on("typing", (userId) => {
        console.log(`user Id: ${userId}, selected user: ${selectedUser._id}`)
        if (userId === selectedUser._id) {
          setTypingStatus(true);
          console.log("typing from server");
        }
      });
    
      socket.on("stopTyping", (senderId) => {
        if (senderId === selectedUser._id) {
          setTypingStatus(false);
        }
      });
    
      return () => {
        socket.off("typing");
        socket.off("stopTyping");
      };
    }, [socket, selectedUser]);
    

    useEffect(() => {
      if (isSuccess && data) {
        dispatch(collectMessages(data));
      }
  
      return () => {
        dispatch(clearMessages());
      };
    }, [isSuccess, data, dispatch]);
      

    if(isLoading){
      return (
      <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader selectedUser={selectedUser} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
          message is loading 
      </div>
      <MessageInput selectedUser={selectedUser} />
    </div>)
    }
    
    if(typingStatus){
      console.log("typing..")
    }

    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader selectedUser={selectedUser} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
        {messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.sender === user._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.sender === user._id
                        ? user.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                 <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time> 
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}  
         
        </div>
        <MessageInput selectedUser={selectedUser} />
      </div>
    )

}

export default ChatContainer

// /chat/ChatHeader
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { setSelectedUser } from "../../features/chat/chatSlice";

const ChatHeader = ({selectedUser}) => {

  const { onlineUsers } = useSelector(state => state.auth);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.userName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.userName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;

//chat/MessageInput
import React, { useEffect } from 'react'
import { useRef, useState } from "react";
import { useSendMessageMutation } from '../../features/chat/chatApi';
import { Paperclip  , Send, X } from 'lucide-react';
import { getSocket } from '../../service/socket';
import { addNewMessage } from '../../features/chat/chatSlice';
import { useDispatch } from 'react-redux';

const MessageInput = ({selectedUser}) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [sendMessage, {loading, error}] = useSendMessageMutation();
  const dispatch = useDispatch()
  
  const socket = getSocket();
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);8
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
        const receiverId = selectedUser._id
   
        const res = await sendMessage({
        text: text.trim(),
        image: imagePreview,
        receiverId: receiverId
      }).unwrap();

      console.log("selected user:", res)

      if(error) {
        console.log("sending message error :", error);
        
      }

      socket.emit("stopTyping", selectedUser._id);
      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  //handle typing
  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing",{ receiverId: selectedUser._id});

    // clearTimeout(typingTimeout);
    // const timeout = setTimeout(() => {
    //   socket.emit("stopTyping", {receiverId: selectedUser._id});
    // }, 1000); // stops typing after 1s of inactivity

    // setTypingTimeout(timeout);
  };

  //new message added
  useEffect(() => {    
    const handleReceiveMessage = ({ newMessage }) => {
      if (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id) {
        dispatch(addNewMessage(newMessage));
      }
    };
    
    socket.on("receive_message", handleReceiveMessage);
  
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [dispatch, selectedUser]);

  return (
    <div className="p-4 w-full">
    {imagePreview && (
      <div className="mb-3 flex items-center gap-2">
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
          />
          <button
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
            type="button"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>
    )}

    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={`hidden sm:flex btn btn-circle
                   ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip   size={20} />
        </button>
      </div>
      <button
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={!text.trim() && !imagePreview}
      >
        <Send size={22} />
      </button>
    </form>
  </div>
  )
}

export default MessageInput
