require('dotenv').config();
import express from 'express';
import config from 'config'
import dbConnection from './utils/dbConnection';
import log from './utils/logger';
import router from './routes';

// import morgan from 'morgan';

// const authRoutes = require('./routes/auth');


const app=express();


// // Middlewares
app.use(express.json());

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
