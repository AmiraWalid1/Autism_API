require('dotenv').config();
import express from 'express';
import config from 'config'
import dbConnection from './utils/dbConnection';
import log from './utils/logger';
import router from './routes';
import deserializeUser from './middleware/deserializeUser';
import { taskRouter } from './routes/taskRoutes';
import { routineRouter } from './routes/routine.routes';
import { consultationRouter } from './routes/consultationRoutes';


// import morgan from 'morgan';


const app=express();
import cors from "cors";


app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Use environment variable or fallback to '*'
    credentials: true, // Enable if sending cookies or authentication
}));

// Middlewares
app.use(express.json());

app.use(deserializeUser);

app.use('/api/task', taskRouter);

app.use('/api/routine', routineRouter);

app.use('/api/consultation', consultationRouter);


// if (process.env.NODE_ENV == "development"){
//     app.use(morgan('dev'));
//     console.log(`mode: ${process.env.NODE_ENV}`);
// }

app.use(router);

const port = config.get('port');

app.listen(port,()=>{
    log.info(`App started at http://localhost:${port}`);
    
    dbConnection();
});
