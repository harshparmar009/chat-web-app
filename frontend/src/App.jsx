import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Chat from './page/Chat';
import Home from './page/Home.jsx';
import Login from './page/Login.jsx';
import SignUp from './page/SignUp.jsx'
import ProfilePage from './page/ProfilePage.jsx'
import ProtectedRoute from './routes/ProtectedRoutes.jsx';
import Dashboard from './page/Dashboard.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from './service/socket.js'
import { getOnlineUsers } from './features/auth/authSlice.js';

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route> 

        </Routes>
      </Router>
  )
}

export default App
