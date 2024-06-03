const mongoose = require("mongoose");

const password = '6z0EOKLVLxPBjM48';
const connectDB = (url) => {
  return mongoose.connect(url)
};

module.exports = connectDB;
