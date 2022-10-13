const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  deadline: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    default: "",
  },

  assignedUserName: String,
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Tasks = new mongoose.model("tasks", TaskSchema);

module.exports = Tasks;
