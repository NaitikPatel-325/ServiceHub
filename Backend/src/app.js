import express,{urlencoded} from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import userRouter from './routes/userRouter.js';

const app = express();
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(express.json());
app.use(express.static('public'));

app.use('/user',userRouter);

export default app;