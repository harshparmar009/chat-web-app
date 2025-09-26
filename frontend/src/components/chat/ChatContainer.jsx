// src/components/chat/ChatContainer.jsx
import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useDispatch, useSelector } from "react-redux";
import { useGetMessagesQuery,  } from "../../features/chat/chatApi";
import {
  clearMessages,
  collectMessages,
} from "../../features/chat/chatSlice";
import { formatMessageTime } from "../../lib/utils.js";
import useChatSocket from "../../hook/useChatSocket.js";
import { getSocket } from "../../service/socket.js";
import { messageApi } from "../../features/chat/chatApi"; 

const ChatContainer = () => {

  const { selectedUser, messages = [], typingStatus } =
    useSelector((state) => state.chat) || {};
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const socket = getSocket();
  const containerRef = useRef(null); // to detect scroll position
  const messageEndRef = useRef(null);
  const prevMessagesLenRef = useRef(messages.length);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { data, isLoading, isSuccess } = useGetMessagesQuery(
    selectedUser?._id,
    {
      skip: !selectedUser?._id,
      refetchOnMountOrArgChange: true,
    }
  );

  // hook for listening socket events (keeps original event names)
  useChatSocket(selectedUser?._id, user?._id);

  // join my socket room (safe to call repeatedly)
  useEffect(() => {
    if (!socket || !user?._id) return;
    socket.emit("join", user._id);
  }, [socket, user?._id]);

  // scroll container scroll listener -> maintains isAtBottom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 50;
      setIsAtBottom(atBottom);
    };

    el.addEventListener("scroll", onScroll);
    onScroll(); // initialize
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // initial load: collect messages, scroll to bottom, and mark seen if needed
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(collectMessages(data));

      // scroll to bottom once (opening chat)
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 50);

      // if there are unseen messages for me, and chat is open — tell server
      const unseenForMe = data.filter(
        (m) => m.receiver === user._id && !m.seen
      );
      if (unseenForMe.length > 0 && selectedUser?._id) {
        socket.emit("markMessagesSeen", {
          friendId: selectedUser._id,
          userId: user._id,
        });
        dispatch(messageApi.util.invalidateTags(["Chats"]));    }
      }


    return () => {
      dispatch(clearMessages());
    };
  }, [isSuccess, data, dispatch, selectedUser, socket, user]);

  // handle message list changes: auto-scroll and emit seen when appropriate
  useEffect(() => {
    const prevLen = prevMessagesLenRef.current;
    const currLen = messages.length;

    if (currLen > prevLen) {
      // New message(s) added
      const last = messages[messages.length - 1];

      // If I (current user) sent the new message → always scroll down
      if (last && last.sender === user._id) {
        setTimeout(
          () => messageEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
      } else {
        // incoming message from other user
        // if user is at bottom (reading) OR tab is visible, scroll + mark seen
        if (isAtBottom || document.visibilityState === "visible") {
          setTimeout(
            () => messageEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            50
          );

          // mark unseen messages as seen (only those where receiver is me & sender is selectedUser)
          const unseenForMe = messages.filter(
            (m) => m.receiver === user._id && !m.seen && m.sender === selectedUser?._id
          );

          if (unseenForMe.length > 0 && selectedUser?._id) {
            socket.emit("markMessagesSeen", {
              friendId: selectedUser._id,
              userId: user._id,
            });
          }

          // refetchMessageCounter();

        } else {
          // not at bottom: don't auto-scroll (you can show "new messages" UI here)
        }
      }
    }

    prevMessagesLenRef.current = currLen;
  }, [messages, isAtBottom, selectedUser, user, socket]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-gray-800">
        <ChatHeader selectedUser={selectedUser} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">message is loading</div>
        <MessageInput selectedUser={selectedUser} />
      </div>
    );
  }

  // sorted copy for stable display (do not mutate original)
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gray-800 rounded-xl">
      <ChatHeader selectedUser={selectedUser} />
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {sorted.map((message, index) => {
          const isMine = message.sender === user._id;
          const isLastMine = isMine && index === sorted.length - 1;
          return (
            <div key={message._id} className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={isMine ? user.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />}
                {message.text && <p>{message.text}</p>}
              </div>

              {/* Seen indicator only under the last message you sent */}
              {isLastMine && <div className="text-[10px] text-gray-400 mt-1 ml-2">{message.seen ? "Seen" : "Sent"}</div>}
            </div>
          );
        })}

        {/* Typing indicator placed before bottom ref so it's above the input */}
        {/* {typingStatus && selectedUser && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src={selectedUser.profilePic || "/avatar.png"} alt="profile pic" />
              </div>
            </div>
            <div className="chat-bubble bg-base-300 text-sm text-zinc-500 italic flex items-center gap-1">
              <span className="animate-pulse">Typing</span>
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-75">.</span>
              <span className="animate-bounce delay-150">.</span>
            </div>
          </div>
        )} */}



        {/* bottom anchor */}
        <div ref={messageEndRef}></div>
      </div>

      {typingStatus && selectedUser && (
    <div className="px-4 py-1 text-sm text-zinc-400 italic flex items-center gap-1 bg-gray-800">
      {/* <img
        src={selectedUser.profilePic || "/avatar.png"}
        alt="profile"
        className="size-6 rounded-full border"
      /> */}
      <span className="animate-pulse">Typing</span>
      <span className="animate-bounce">.</span>
      <span className="animate-bounce delay-75">.</span>
      <span className="animate-bounce delay-150">.</span>
    </div>
  )}
      
      <MessageInput selectedUser={selectedUser} />
    </div>
  );
};

export default ChatContainer;
