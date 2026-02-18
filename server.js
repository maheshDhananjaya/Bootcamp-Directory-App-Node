const express = require("express");
const dotenv = require("dotenv");
// const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const {xss} = require("express-xss-sanitizer");
const {rateLimit} = require("express-rate-limit")
const cors = require("cors");
const hpp = require("hpp");
// const {xss} = require("xss");
const cookieParser = require("cookie-parser");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const path = require("path");

dotenv.config({ path: "./config/config.env" }); // load env vars
connectDB(); //connect db;
const bootcamp = require("./routes/bootcamp");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const user = require("./routes/user");
const review = require("./routes/review");
const errorHandler = require("./middleware/error");

const limiter = rateLimit({
    windowMs: 10*60*1000,
    max: 10
})

const app = express();
app.use(express.json());


// app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors({
    origin: "https://localhost:3000",
    credentials: true
}));

app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser())
// app.use(logger)
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/review", review);
app.use(errorHandler);

const port = process.env.PORT || 5002;
const server = app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`),
);

// handle unHandle promise rejection
process.on("unhandledRejection", (err) => {
  console.error(`error: ${err}`);
  server.close(() => process.exit(1));
});
