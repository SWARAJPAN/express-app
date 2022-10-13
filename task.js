const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  taskNames: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  deadline: {
    type: Date,
    // required: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
  assignedUser: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    // default: "",
  },

  assignedUserName: {
    type: String,
    default: "unassigned",
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Tasks = new mongoose.model("tasks", TaskSchema);

module.exports = Tasks;

// "name" - String
// "email" - String
// "pendingTasks" - [String] - The _id fields of the pending tasks that this user has
// "dateCreated" - Date - should be set automatically by server
// Here is the Task Schema:

// "name" - String
// "description" - String
// "deadline" - Date
// "completed" - Boolean
// "assignedUser" - String - The _id field of the user this task is assigned to - default ""
// "assignedUserName" - String - The name field of the user this task is assigned to - default "unassigned"
// "dateCreated" - Date - should be set automatically by server to present date
