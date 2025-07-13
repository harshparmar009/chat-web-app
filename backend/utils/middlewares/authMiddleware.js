import jwt from "jsonwebtoken";
import { User } from "../../models/userModel.js";

export const isAuthenticated = async(req, res, next) => {
 
  const token = req.cookies.token;

 //for local storage store token
  // const authHeader = req.headers.authorization;

  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  
  // const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)

    req.user = user; // Attach user to request
    // console.log(req.user.userName);
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
