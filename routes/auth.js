const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const rateLimiter = require("express-rate-limit");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many requests from this IP, please try again after 15 minutes later..",
  },
});

const {
  signupUser,
  loginUser,
  deleteUser,
  updateUser,
} = require("../controller/auth");

router.post("/register", apiLimiter, signupUser);
router.post("/login", apiLimiter, loginUser);
router.put("/updateuser/:id", authMiddleware, updateUser);
router.delete("/deleteuser/:id", authMiddleware, deleteUser);

module.exports = router;
