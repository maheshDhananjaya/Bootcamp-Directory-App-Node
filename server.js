const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path:'./config/config.env'});
const bootcamp = require("./routes/bootcamp");

const app = express();
app.use('/api/v1/bootcamps',bootcamp);

const port = process.env.PORT || 5002
app.listen(port, ()=>console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`));


