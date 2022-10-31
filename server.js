const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 4004;
const Users = require("./user");
const Tasks = require("./task");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

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
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// console.log(bodyParser);

// app.use(express.json());

app.post("/api/users", async (req, res) => {
  if (!req.body.email == "" && !req.body.name == "") {
    const findEmail = await Users.find({ email: req.body.email });
    // console.log(findEmail);
    if (findEmail.length == 0) {
      try {
        const Upeople = new Users(req.body);
        const data = await Upeople.save();
        res.json({ message: "New User has been created", data });
      } catch (error) {
        res.json({ message: "Server Error" });
      }
    } else {
      res.json({ message: "User already exists" });
    }
  } else {
    res.json({ message: "Please enter email and name" });
  }

  // try {
  //   const Upeople = new Users(req.body);
  //   const Speople = await Upeople.save();
  //   res.send(Speople);
  //   console.log(Speople);
  // } catch (error) {
  //   console.log(error);
  // }
});

app.get("/api/users", async (req, res) => {
  // try {
  //   const data = await Users.find();
  //   res.json(data);
  // } catch (error) {
  //   console.log("error");
  // }
  try {
    let data = await Users.find(eval("(" + req.query.where + ")"))
      // .count(eval("(" + req.query.count + " )"))
      .select(eval("(" + req.query.select + ")"))
      .sort(eval("(" + req.query.sort + " )"))
      .skip(eval("(" + req.query.skip + " )"))
      .limit(eval("(" + req.query.limit + " )"));

    res.json({ message: "success", data, length: data.length });
  } catch (error) {
    res.send(error);
  }

  // if (req.query.count) {
  //   res.status(200).send({
  //     message: "total tasks",
  //     data: data.length,
  //   });
  // } else {
  //   res.send({
  //     message: "sucess",
  //     data: data,
  //   });
  // }
  // if (req.query.count == "true") {
  //   console.log(req.query.count);
  //   Users.find(eval("(" + req.query.where + ")"))
  //     .skip(eval("(" + req.query.skip + " )"))
  //     .limit(eval("(" + req.query.limit + " )"))
  //     .select(eval("(" + req.query.select + ")"))
  //     .sort(eval("(" + req.query.sort + " )"))
  //     .count()
  //     // .count(eval("(" + req.query.count + " )"))

  //     .exec((error, data) => {
  //       if (error) {
  //         res.status(400).send(error);
  //       } else {
  //         res.status(200).json({ message: "Success", data });
  //       }
  //     });
  // } else {
  //   Users.find(eval("(" + req.query.where + ")"))
  //     .select(eval("(" + req.query.select + ")"))
  //     .sort(eval("(" + req.query.sort + " )"))
  //     .skip(eval("(" + req.query.skip + " )"))
  //     .limit(eval("(" + req.query.limit + " )"))

  //     .exec((error, data) => {
  //       if (error) {
  //         res.status(400).send(error);
  //       } else {
  //         res.status(200).json({ message: "success", data });
  //       }
  //     });
  //   // res.status(400).send("Error");
  // }
});
app.get("/api/users/:id", async (req, res) => {
  try {
    const data = await Users.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "error.message" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body.pendingTasks;
    const options = { new: true };
    const findUserData = await Users.findById(id);
    const availablePendingTasks = findUserData.pendingTasks.filter(
      (task_id) => {
        return task_id == updatedData;
      }
    );

    console.log(availablePendingTasks.length);
    if (availablePendingTasks.length > 0) {
      res.status(201).send("The task is already assigned to this user");
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
        if (findTask.completed === true) {
          const updatedTask = await Tasks.findByIdAndUpdate(
            pendingTaskId,

            { $set: { assignedUser: id, completed: false } },
            options
          );
          res.json(updatedTask);
          console.log(updatedTask);
        } else if (!findTask.completed) {
          res.status(200).json("This task is already assigned to another.");
        }

        // res.send(taskresult);
      } catch (error) {
        // res.status(400).send("already ass");
      }
    }

    //res.send(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const data = await Users.findByIdAndDelete(id);
    res.send({ message: `Document with ${data.name} has been deleted..` });
  } catch (error) {
    res.send({ message: error.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  // try {
  //   const UTask = new Tasks(req.body);
  //   const STask = await UTask.save();
  //   res.status(201).json(STask);
  //   console.log(res.body);
  // } catch (error) {
  //   res.status(400).json({ message: error.message });
  //   console.log(error);
  // }
  console.log("1");
  if (req.body.deadline !== "" && req.body.name !== "") {
    const findDeadline = await Users.find({ deadline: req.body.deadline });
    // console.log(findDeadline);
    console.log("2");
    // res.status(201).json({ message: "ok", findDeadline });
    if (findDeadline.length !== 0) {
      try {
        const UTask = new Tasks(req.body);
        const data = await UTask.save();
        res.status(201).json({ message: "ok", data });
      } catch (error) {
        res.status(500).json({ message: "Server Error" });
      }
    }
  } else {
    res.status(500).json({ message: "Please enter name and deadline" });
  }
});

app.get("/api/tasks", async (req, res) => {
  // try {
  //   const data = await Tasks.find();
  //   res.json(data);
  // } catch (error) {
  //   console.log("error");
  // }
  if (req.query.count == "true") {
    Tasks.find(eval("(" + req.query.where + ")"))
      .select(eval("(" + req.query.select + ")"))
      .skip(eval("(" + req.query.skip + " )"))
      .limit(eval("(" + req.query.limit + " )"))
      .sort(eval("(" + req.query.sort + " )"))
      .count()

      .exec((error, data) => {
        if (error) {
          res.status(404).send(error);
        } else {
          res.status(200).json({ message: "success", data });
        }
      });
  } else {
    Tasks.find(eval("(" + req.query.where + ")"))
      .select(eval("(" + req.query.select + ")"))
      .skip(eval("(" + req.query.skip + " )"))
      .limit(eval("(" + req.query.limit + " )"))
      // .sort(eval("(" + req.query.sort + " )"))

      .exec((error, data) => {
        if (error) {
          res.status(404).send(error);
        } else {
          res.status(200).json({ message: "success", data });
        }
      });
  }
});

app.get("/api/tasks/:id", async (req, res) => {
  try {
    const data = await Tasks.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Tasks.findByIdAndDelete(id);
    res.status(200).send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log("started");
});
