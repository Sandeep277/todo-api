const Todos = require('../model/Todos')

const getTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todos = await Todos.find({ createdBy: id });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ msg: error.toString() });
  }
};

const postTodo = async (req, res) => {
  const { id } = req.params;

  try {
    req.body.createdBy = id;
    const todo = await Todos.create(req.body);
    res.status(201).json({ todo });
  } catch (error) {
    res.status(500).json({ msg: error.toString() });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todoID = req.params.id;
    const updateData = req.body;

    const updatedTodo = await Todos.findByIdAndUpdate(todoID, updateData, {
      new: true,
    });
    if (!updatedTodo) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteTodo = async (req, res) => {
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
};

module.exports = {
  getTodo,
  postTodo,
  updateTodo,
  deleteTodo,
};
