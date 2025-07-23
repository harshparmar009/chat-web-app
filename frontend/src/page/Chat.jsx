// import React, { useMemo, useState, useEffect, useRef } from 'react'
// import { useContext } from 'react';
// import { UserContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';
// import { useSocket } from '../hook/useSocket.js'
// import { io } from 'socket.io-client';
// import API from '../service/axios.js';

// const Chat = () => {
//     const User = useContext(UserContext);
//     const user = User.user
//     const navigate = useNavigate();
//     const socket = useRef(null);
//     // const socket = useMemo(()=>io("http://localhost:3000"),[])

//     const [value, setValue] = useState("");
//     const [socketId, setSocketId] = useState("");
//     const [roomName, setRoomName] = useState("");
//     const [message, setMessage] = useState([])
//     const [users, setUsers] = useState([])

//     // const handleValue = (e) => {
//     //     e.preventDefault();
//     //     socket.emit("send-msg", {value, socketId});
//     //     setValue("");
//     //     setSocketId("")
//     // }

//     // const handleMsg = (user) => {
//     //   // e.preventDefault();
//     //   const msg = 'hello jazz'
//     //   socket.emit("send-msg", {user, msg})
//     //   console.log(user)
//     // }

//     // const handleCreateRoom = (e) => {
//     //   e.preventDefault();
//     //   socket.emit("custom-room", roomName)
//     //   setRoomName("");
//     // }

//     const handleLogout= async() => {
//       const res = await API.get("/logout")
//       if(res.data.success){
//         console.log("user log out succesfully");
//         // localStorage.removeItem("token");
//         navigate("/")
//       }
//     }
 
//     //call methods here or listening event here
//     useEffect(() => {

//       const verifyUser = async() => {
//        try {
//         const res = await API.get("/me", { withCredentials: true })
//         if(!res.data  || !res.data.success) {
//           navigate("/")
//           return
//         }

//         if(res.data.success){

//           const user = res.data.user

//           socket.current = io("http://localhost:3000", {
//             withCredentials: true,
//             query: {
//               userId: user._id
//             }
//           });

//           setUsers(user)
          
//           socket.current.on("connect", () => {
//             console.log(`you are now connected on ID:${socket.current.id}`);
            
//             console.log(user);
    
//             socket.current.emit("userLogin", {userId: user._id})
//             // socket.emit("privateMessage", {fromUserId: user._id, toUserId: })

//              // Custom events
//             socket.current.on("getOnlineUsers", ({onlineUsers, allUsers}) => {
//               console.log("Online users:", onlineUsers);
//               console.log("All Users:", allUsers);
              
//             });

//         })
//         }
//        } catch (error) {
//         console.log("Auth failed", error);
//         navigate("/")
//        }
//       }

//       verifyUser()
//       return () => {
//         if (socket.current) {
//           socket.current.disconnect();
//           console.log("Socket disconnected");
//         }
//       };

//       },[])

//   return (
//     <div>
//       {`Welcome user: ${users.userName}`}

//       <div>
//         <button onClick={handleLogout} className='p-2 rounded-lg bg-red-200 text-white'>Log Out</button>
//       </div>

//       <div>

//       </div>
//     </div>
//   )
// }

// export default Chat
