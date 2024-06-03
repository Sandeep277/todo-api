const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { generateToken, verifyToken } = require("./utility/generateToken");
const connectDB = require("./db/connectdb");
const authMiddleware = require("./middleware/authMiddleware")
const app = express();
const port = process.env.PORT || 5000;
const User = require("./model/User");
const Todos = require("./model/Todos");

// Middleware
app.use(express.json());

//            <---------- FOR CREATING USER ---------->
// SignUp User
app.post("/api/v1/user/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please provide all the required fields" });
  }

  try {
    const saltround = 10;
    const hashPassword = await bcrypt.hash(password, saltround);
    const user = await User.create({ name, email, password: hashPassword });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ msg: error.toString() });
  }
});

// Login User
app.post("/api/v1/user/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide all the required fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = generateToken(user);
      res.status(200).json({ token });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).json({ msg: error.toString() });
  }
});

// Delete User
app.delete("/api/v1/user/:id", authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId, email: email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      await User.findByIdAndDelete(userId);
      res.send("User has been deleted");
    } else {
      res.status(401).json({ msg: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Update User
app.put("/api/v1/user/:id", authMiddleware, async (req, res) => {
  try {
    const userID = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userID, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Get Todos
app.get("/api/v1/user/todo/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const todos = await Todos.find({ createdBy: id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ msg: error.toString() });
  }
});

// Create Todo
app.post("/api/v1/user/todo/create/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    req.body.createdBy = id;
    const todo = await Todos.create(req.body);
    res.status(201).json({ todo });
  } catch (error) {
    res.status(500).json({ msg: error.toString() });
  }
});

// Update Todo
app.put("/api/v1/user/todo/:id", authMiddleware, async (req, res) => {
  try {
    const todoID = req.params.id;
    const updateData = req.body;

    const updatedTodo = await Todos.findByIdAndUpdate(todoID, updateData, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Delete Todo
app.delete("/api/v1/user/todo/:id", authMiddleware, async (req, res) => {
  try {
    const todoID = req.params.id;
    const deletedTodo = await Todos.findByIdAndDelete(todoID);

    if (!deletedTodo) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.status(200).json({ msg: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server running on port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();