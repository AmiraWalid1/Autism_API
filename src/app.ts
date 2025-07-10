require('dotenv').config();
import express from 'express';
import config from 'config'
import dbConnection from './utils/dbConnection';
import log from './utils/logger';
import router from './routes';
import deserializeUser from './middleware/deserializeUser';

// import morgan from 'morgan';


const app=express();
const cors = require("cors");


app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Use environment variable or fallback to '*'
    credentials: true, // Enable if sending cookies or authentication
}));

// Middlewares
app.use(express.json());

app.use(deserializeUser);

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
