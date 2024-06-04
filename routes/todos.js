const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTodo,
  postTodo,
  updateTodo,
  deleteTodo,
} = require("../controller/todos");

router.get("/:id", authMiddleware, getTodo);
router.post("/create/:id", authMiddleware, postTodo);
router.put("/:id", authMiddleware, updateTodo);
router.delete("/:id", authMiddleware, deleteTodo);

module.exports = router;
