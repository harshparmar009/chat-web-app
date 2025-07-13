import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'
import authRoute from './routes/authRoute.js' 
import { dbConnection } from './dbConnection.js'
import { User } from './models/userModel.js'
import socketAuth from './utils/middlewares/socketAuth.js'
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000

const server = createServer(app)
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

server.listen(port, ()=>{
    console.log(`Server is listneing on port ${port}`);
    dbConnection();
})

const corsOpt = {
    origin: "http://localhost:5173",
    // methods: ["GET", "POST"],
    credentials: true
}

//middlewares
app.use(cors(corsOpt));
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser());

//API ROUTES
app.use("/api/v1/auth", authRoute)


// io.use(async(socket, next) => {
//   try {
//     const token = socket.handshake.auth.token; // sent from client manually after login
//     if (!token) {
//       return next(new Error("Authentication failed: No token provided"));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select("-password -userName -email");

//     if (!user) {
//       return next(new Error("Authentication failed: User not found"));
//     }

//     socket.user = user; // Attach user to socket instance
//     next();
//   } catch (err) {
//     console.error("Socket auth error:", err);
//     next(new Error("Authentication failed"));
//   }
// });


let users = {}
io.on("connect", (socket)=>{

  // Example: map userId to socket.id
  const userId = socket.handshake.query.userId;;
  users[userId] = socket.id;

  console.log("user id:", userId);
  
    console.log(`You are connected on ID:${socket.id}`);

    User.findByIdAndUpdate(userId, {socketId: socket.id}).then(() => {
      sendOnlineUsers()
    })
    console.log(`Socket ID ${socket.id} assigned to user ${userId}`);

    async function sendOnlineUsers() {
      const allUsers = await User.find({}, "userName _id socketId");
      const onlineUsers = allUsers.filter((u) => u.socketId);
      io.emit("getOnlineUsers", { onlineUsers, allUsers });
    }

    // Handle private message
  // socket.on('privateMessage', async ({ fromUserId, toUserId, message }) => {
  //   try {
  //     // const recipient = await User.findById(toUserId);

  //    console.log(`📨 Message sent from ${fromUserId} to ${toUserId}`);

  //     if (recipient?.socketId) {
  //       io.to(recipient.socketId).emit('privateMessage', {
  //         from: fromUserId,
  //         message,
  //       });
  //       console.log(`📨 Message sent from ${fromUserId} to ${toUserId}`);
  //     } else {
  //       console.log(`❌ Recipient ${toUserId} not connected`);
  //     }
  //   } catch (err) {
  //     console.error('❌ Error in privateMessage', err);
  //   }
  // });

  // Handle disconnect
  socket.on('disconnect', async () => {
    try {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null }
      );
      if (user) console.log(`🔌 User ${user._id} disconnected`);
    } catch (err) {
      console.error('❌ Disconnect error:', err);
    }
  });

})
