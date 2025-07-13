import jwt from "jsonwebtoken";
import cookie from "cookie"; // to parse raw headers
import { User } from "../../models/userModel.js";

const socketAuth = async(socket, next) => {
  try {
    const token = socket.handshake.auth.token; // sent from client manually after login
    if (!token) {
      return next(new Error("Authentication failed: No token provided"));
    }

    const decoded = jwt.verify(token, 'janksdashdbfawue');
    const user = await User.findById(decoded.userId).select("-password -userName -email");

    if (!user) {
      return next(new Error("Authentication failed: User not found"));
    }

    socket.user = user; // Attach user to socket instance
    next();
  } catch (err) {
    console.error("Socket auth error:", err);
    next(new Error("Authentication failed"));
  }
};

export default socketAuth;
