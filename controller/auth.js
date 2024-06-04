const bcrypt = require("bcrypt");
const User = require("../model/User");

const { generateToken, verifyToken } = require("../utility/generateToken");

const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide all the required fields" });
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
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide all the required fields" });
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
};

const deleteUser = async (req, res) => {
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
};

const updateUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userID, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  signupUser,
  loginUser,
  deleteUser,
  updateUser,
};
