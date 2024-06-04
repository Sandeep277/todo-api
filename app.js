const express = require("express");
// const bcrypt = require("bcrypt");
require("dotenv").config();

const { generateToken, verifyToken } = require("./utility/generateToken");
const connectDB = require("./db/connectdb");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();
const port = process.env.PORT || 5000;
const User = require("./model/User");
const Todos = require("./model/Todos");

// routes
const authRouter = require("./routes/auth");
const todoRouter = require("./routes/todos");

// Middleware
app.use(express.json());

//            <----------- ROUTES -------------->
//            <---------- USER AUTH ROUTES ---------->
app.use("/api/v1/auth", authRouter);

//           <------------ TODO ROUTES -------->
app.use("/api/v1/user/todo", todoRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server running on port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
