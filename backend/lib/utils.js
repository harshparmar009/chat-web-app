import  jwt  from "jsonwebtoken"

export const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user._id, username: user.userName }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
}

export const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
}