import React, { useEffect, useRef, useState } from 'react'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import { useDispatch, useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../../features/chat/chatApi';
import { clearMessages, collectMessages } from '../../features/chat/chatSlice';
import {formatMessageTime} from '../../lib/utils.js'
import useChatSocket from '../../hook/useChatSocket.js';

const ChatContainer = () => {

  const { selectedUser, messages, typingStatus } = useSelector(state => state.chat) || [];
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  
  const {data, isLoading, isSuccess } = useGetMessagesQuery(selectedUser._id, {
    skip: !selectedUser._id,
    refetchOnMountOrArgChange: true,
  })
  
  //hook for listening socket events
    useChatSocket(selectedUser._id, user._id);

    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingStatus]);

    //for shows old all message
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
         
         {typingStatus && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-bubble bg-base-300 text-sm text-zinc-500 italic flex items-center gap-1">
                <span className="animate-pulse">Typing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-75">.</span>
                <span className="animate-bounce delay-150">.</span>
              </div>
            </div>
          )}
        </div>
        <MessageInput selectedUser={selectedUser} />
      </div>
    )

}

export default ChatContainer
