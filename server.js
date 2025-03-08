const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

const dbConnection = require('./config/database');
const authRoutes = require('./routes/auth');

dotenv.config({ path: 'config.env'});

const app=express();

// Connection to Database
dbConnection();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV == "development"){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}



//Routes
app.use('/api/auth/', authRoutes);


const PORT=process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`App running running on port ${PORT}`);
});
