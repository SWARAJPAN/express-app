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

app.post("/api/users", async (req, res) => {
  try {
    const Upeople = new Users(req.body);
    const Speople = await Upeople.save();
    res.send(Speople);
    console.log(res.body);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/users", (req, res) => {
  // try {
  //   const data = await Users.find();
  //   res.json(data);
  // } catch (error) {
  //   console.log("error");
  // }

  Users.find(eval("(" + req.query.where + ")"))
    .select(eval("(" + req.query.select + ")"))
    .sort(eval("(" + req.query.sort + " )"))
    // .sort(eval(req.query.sort))
    // .populate('tasks')
    .exec((error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.json({ message: "success", data });
      }
    });
});
app.get("/api/user/:id", async (req, res) => {
  try {
    const data = await Users.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "error.message" });
  }
});

app.put("/api/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body.pendingTasks;
    const options = { new: true };
    const findUserData = await Users.findById(id);
    const availpending = findUserData.pendingTasks.filter((task_id) => {
      return task_id == updatedData;
    });
    console.log(availpending.length);
    if (availpending.length > 0) {
      res.send("The task is already assigned to this user");
    } else {
      const result = await Users.findByIdAndUpdate(
        id,

        { $push: { pendingTasks: updatedData } },
        options
      );
      try {
        const pendingTaskId = req.body.pendingTasks;
        // const updatedData = req.body.assignedUser;
        // const options = { new: true };
        const findTask = await Tasks.findById(pendingTaskId);
        if (findTask.complete === true) {
          const updatedTask = await Tasks.findByIdAndUpdate(
            pendingTaskId,

            { $set: { assignedUser: id, completed: false } },
            options
          );
          console.log(updatedTask);
        } else if (!findTask.complete) {
          res.send("This task is already assigned to another.");
        }

        // res.send(taskresult);
      } catch (error) {
        // res.status(400).send("already ass");
      }
    }

    //res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Users.findByIdAndDelete(id);
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const UTask = new Tasks(req.body);
    const STask = await UTask.save();
    res.send(STask);
    console.log(res.body);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const data = await Tasks.find();
    res.json(data);
  } catch (error) {
    console.log("error");
  }
});

app.get("/api/task/:id", async (req, res) => {
  try {
    const data = await Tasks.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/task/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Tasks.findByIdAndDelete(id);
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log("started");
});
