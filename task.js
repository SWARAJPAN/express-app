const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  deadline: Date,
  completed: {
    type: Boolean,
    default: true,
  },
  assignedUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  assignedUserName: String,
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Tasks = new mongoose.model("tasks", TaskSchema);

module.exports = Tasks;
