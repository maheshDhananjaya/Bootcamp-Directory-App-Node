const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const connectDB = require('./config/db');

dotenv.config({path:'./config/config.env'}); // load env vars
connectDB(); //connect db;
const bootcamp = require("./routes/bootcamp");
const errorHandler = require("./middleware/error");


const app = express();
app.use(express.json());
// app.use(logger)
app.use('/api/v1/bootcamps',bootcamp);
app.use(errorHandler);

const port = process.env.PORT || 5002
const server = app.listen(port, ()=>console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`));

// handle unHandle promise rejection
process.on('unhandledRejection', (err) => {
    console.error(`error: ${err}`);
    server.close(()=>process.exit(1));
})



