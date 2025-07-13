import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js"
import bcrypt from 'bcryptjs'

export const signInController = async(req, res) => {
    try {
        const { userName, password} = req.body

        //logic to check username is availablein DB or not
        const user = await User.findOne({userName})

        if(!user) {
           return res.status(401).json({
                message: "Invalid username"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });


        const token = jwt.sign({ userId: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: "development", // set to false in dev if needed
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
          });

        return res.json({ user: { _id: user._id, username: user.userName, email: user.email }, 
            message: "login succesful",
            // token,
            success: true
        });
        

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
} 

export const signUpController = async(req, res) => {
    try {
        const { userName, password, email} = req.body

        //logic for store id pass in DB
        const userCheck = await User.findOne({ userName })

        if(!userName && !password && !email){
           return res.status(400).json({
                message: "Please enter all details",
                success: false
            })
        }

        if(userCheck){
           return res.status(401).json({
                message: "This username is already exist",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       const user = await User.create({
            userName,
            password: hashedPassword,
            email,
        })

        // const token = jwt.sign( user._id , process.env.JWT_SECRET, {
        //     expiresIn: "1d",
        //   });
        
        //   res.cookie("token", token, {
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        //     httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        //     sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        //     secure: "development",
        //   });
        
         
        return res.status(201).json({
            user,
            success: true
        })

    } catch (error) {
       return res.status(400).json({
        message: `Error ${error}`
        })
    }
} 