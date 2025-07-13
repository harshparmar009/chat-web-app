import mongoose from 'mongoose'
import dotenv from 'dotenv'

export const dbConnection = () => {

    dotenv.config();
    // DB Connection
    mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
     }).then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Mongo Error', err));
}