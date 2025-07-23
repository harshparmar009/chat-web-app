import { io } from "socket.io-client";

let socket = null
export const connectSocket = (accessToken) => {
    if(!socket){
        try {
            socket = io(import.meta.env.VITE_SERVER_URL,{auth:{token: accessToken}})

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
              });
          
            socket.on("disconnect", () => {
                console.log("Socket disconnected");
            });        
        } catch (error) {
            console.log("socket connection failed:", error)
        }
    }

}

export const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

export const getSocket = () => socket  