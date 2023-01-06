const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 4000;

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.options("*", cors());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tours", require("./routes/tourRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`App is running on port: ${port}`));
