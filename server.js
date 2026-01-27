const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const path = require("path");

dotenv.config({ path: "./config/config.env" }); // load env vars
connectDB(); //connect db;
const bootcamp = require("./routes/bootcamp");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const errorHandler = require("./middleware/error");

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public")));
// app.use(logger)
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
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
