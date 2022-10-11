const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const Users = require("./user");
const Tasks = require("./task");

mongoose
  .connect(
    "mongodb+srv://SWARAJPAN:mongocluster@cluster0.nrtdpzl.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());

app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const Upeople = new Users(req.body);
    const Speople = await Upeople.save();
    res.send(Speople);
    console.log(res.body);
  } catch (error) {
    console.log(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const data = await Users.find();
    res.json(data);
  } catch (error) {
    console.log("error");
  }
});
app.get("/user/:id", async (req, res) => {
  try {
    const data = await Users.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body.pendingTasks;
    const options = { new: true };

    const result = await Users.findByIdAndUpdate(
      id,

      { $push: { pendingTasks: updatedData } },
      options
    );

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  try {
    const id = req.params.id;
    const updatedData = req.body.pendingTasks;
    const options = { new: true };

    const taskresult = await Tasks.findByIdAndUpdate(
      id,

      { $push: { assignedUser: id } },
      options
    );

    res.send(taskresult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Users.findAndDelete(id);
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const UTask = new Tasks(req.body);
    const STask = await UTask.save();
    res.send(STask);
    console.log(res.body);
  } catch (error) {
    console.log(error);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const data = await Tasks.find();
    res.json(data);
  } catch (error) {
    console.log("error");
  }
});

app.listen(port, () => {
  console.log("started");
});
