import { server } from './app.js';
import connectdb from './db/index.js';
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})
connectdb()
.then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log(process.env.CORS_ORIGIN);
        console.log(`Server is running on port ${process.env.PORT}`);
    }) 
})
.catch((error)=>{
    server.on('error', (error)=>{
        console.error('Error starting server');
        console.error(error);
    })
    console.error('Error connecting to MongoDB');
    console.error(error);
})