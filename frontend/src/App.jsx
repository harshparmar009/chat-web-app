import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/Home.jsx';
import Login from './page/Login.jsx';
import SignUp from './page/SignUp.jsx'
import ProfilePage from './page/ProfilePage.jsx'
import ProtectedRoute from './routes/ProtectedRoutes.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from './service/socket.js'
import { getOnlineUsers } from './features/auth/authSlice.js';
import Messages from './page/Messages.jsx';
import Explore from './page/Explore.jsx';
import Notification from './page/Notification.jsx';
import Layout from './components/chat/Layout.jsx';

const App = () => {

  const { isAuthenticated, accessToken,  } = useSelector(state => state.auth)

    const dispatch = useDispatch()
  //   // console.log(isAuthenticaed)

  useEffect(() => {
    if(isAuthenticated && accessToken){
      
      connectSocket(accessToken)
      const socket = getSocket();

        // Online users list
        socket.on("online_users", (users) => {
          console.log("🟢 Online:", users);
          dispatch(getOnlineUsers(users))
          // dispatch({ type: 'auth/getOnlineUsers', payload: users });
        });

        // dispatch(getUsers())
    }else {
      disconnectSocket();
    }
  },[isAuthenticated, accessToken])
  
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        

          {/* <Route path="/chat" element={<Chat />} />

           {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/inbox" element={<Messages />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/notification" element={<Notification />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route> 
        <Route path="/profile" element={<ProfilePage />} />
      </Route> 

        </Routes>
      </Router>
  )
}

export default App
