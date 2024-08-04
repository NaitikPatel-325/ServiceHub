import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/ServiceHub`); 
        console.log(`MongoDB connected: ${connection.connection.host}`);
        
    }
    catch(error){
        console.error('Error connecting to MongoDB');
        console.error(error);
    } 
}

export default connectDB; 
