import React, { useEffect, useMemo, useState } from 'react'
// import { io } from 'socket.io-client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignUp from './page/LoginSignUp'
import SocketProvider from './context/SocketContext'
import Chat from './page/Chat';
import UserProvider from './context/UserContext';

const App = () => {

    // const socket = useMemo(()=>io("http://localhost:3000"),[])

    // const [value, setValue] = useState("");
    // const [socketId, setSocketId] = useState("");
    // const [roomName, setRoomName] = useState("");
    // const [message, setMessage] = useState([])
    // const [users, setUsers] = useState([])

    // const handleValue = (e) => {
    //     e.preventDefault();
    //     socket.emit("send-msg", {value, socketId});
    //     setValue("");
    //     setSocketId("")
    // }

    // const handleMsg = (user) => {
    //   // e.preventDefault();
    //   const msg = 'hello jazz'
    //   socket.emit("send-msg", {user, msg})
    //   console.log(user)
    // }

    // const handleCreateRoom = (e) => {
    //   e.preventDefault();
    //   socket.emit("custom-room", roomName)
    //   setRoomName("");
    // }
    // //call methods here or listening event here
    // useEffect(() => {
    //     socket.on("connect", () => {
    //         console.log(`you are now connected on ID:${socket.id}`);
    //         socket.emit("add-user", socket.id)
    //         socket.on("show-user", (data) => {
    //           setUsers(data);
    //         })
    //       })
          
    //       console.log(users);

    //     socket.on("msg-receive", (msg) => {
    //       // setMessage([...message, msg])
    //       console.log(msg);
          
    //     })

    //     // socket.on("recieve-message", (msg)=>{
    //     //     console.log(msg);
    //     //     setMessage([...message, msg])
    //     // })

    //     // socket.on("room-create", (msg) => {
    //     //   console.log(msg);
    //     // })

    //   })
      
      
  return (

    <SocketProvider>
      <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignUp />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
      </UserProvider>
    </SocketProvider>
  )
}

export default App
