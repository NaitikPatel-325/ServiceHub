import express,{urlencoded} from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import userRouter from './routes/userRouter.js';
import issuseRouter from './routes/issueRouter.js';
import proposalRouter from './routes/proposalRouter.js';
import taskRouter from './routes/taskRouter.js';
import authenticateUser from './middleware/auth.js';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://service-hub-ten.vercel.app/',
    credentials: true
}));

app.use(express.json({limit: '20kb'}));
app.use(express.urlencoded({extended: true, limit: '20kb'}));
app.use(express.static('public'));
app.use(cookieparser());

app.use('/user',userRouter);
app.use('/issue',authenticateUser,issuseRouter);
app.use('/proposal',authenticateUser,proposalRouter);
app.use('/task',authenticateUser,taskRouter);



const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

export { server, app };