const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
// const { v4: uuidv4 } = require("uuid");

const app = express();
// const port = process.env.PORT || 9999;
const fileName = "./tasks.json";

app.use(cors());
app.use(bodyParser.json());

app.get("/api/tasks", (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  const tasks = JSON.parse(fs.readFileSync(fileName));

  const tasksSliced = tasks.slice(offset, offset + limit);

  res.status(200).send({
    data: tasksSliced,
    total: tasks.length,
    offset: Number(offset),
    limit: Number(limit),
  });
});

app.post("/api/tasks", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(fileName));
  const { title, description, deadline } = req.body;
  const newTask = {
    id: tasks[tasks.length - 1].id + 1,
    deadline,
    title,
    description,
    isDone: false,
  };

  tasks.push(newTask);
  const updatedJson = JSON.stringify(tasks, null, 2);

  fs.writeFile(fileName, updatedJson, function (err) {
    if (err) {
      res.status(500).send();
      return console.error(err);
    }
    console.log(updatedJson);
    console.log("updated " + fileName);

    res.status(201).send(newTask);
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const tasks = JSON.parse(fs.readFileSync(fileName));
  const index = tasks.findIndex((task) => task.id === Number(id));

  if (index === -1) {
    res.status(500).send();
    return;
  }

  tasks.splice(index, 1);

  const updatedJson = JSON.stringify(tasks, null, 2);

  fs.writeFile(fileName, updatedJson, function (err) {
    if (err) {
      res.status(500).send();
      return console.error(err);
    }
    // console.log(updatedJson);
    console.log("updated " + fileName);

    res.status(200).send();
  });
});

app.patch("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const tasks = JSON.parse(fs.readFileSync(fileName));
  const index = tasks.findIndex((task) => task.id === Number(id));

  if (index === -1) {
    res.status(500).send();
    return;
  }

  tasks[index] = {
    ...tasks[index],
    ...req.body,
  };

  const updatedJson = JSON.stringify(tasks, null, 2);

  fs.writeFile(fileName, updatedJson, function (err) {
    if (err) {
      res.status(500).send();
      return console.error(err);
    }
    console.log(updatedJson);
    console.log("updated " + fileName);

    res.status(200).send({ status: "success", data: tasks[index] });
  });
});

app.get("/health", (req, res) => {
  return res.sendStatus(200);
});

app.listen(2222, () => {
  console.log(`Example app listening on port ${2222}`);
});
