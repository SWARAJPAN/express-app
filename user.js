const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  pendingTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Users = new mongoose.model("users", UserSchema);
module.exports = Users;
