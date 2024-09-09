import express,{urlencoded} from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import userRouter from './routes/userRouter.js';
import issuseRouter from './routes/issueRouter.js';
import proposalRouter from './routes/proposalRouter.js';
import taskRouter from './routes/taskRouter.js';
import authenticateUser from './middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: '20kb'}));
app.use(express.urlencoded({extended: true, limit: '20kb'}));
app.use(express.static('public'));
app.use(cookieparser());

app.use('/user',userRouter);
app.use('/issue',authenticateUser,issuseRouter);
app.use('/proposal',authenticateUser,proposalRouter);
app.use('/task',authenticateUser,taskRouter);

export default app;