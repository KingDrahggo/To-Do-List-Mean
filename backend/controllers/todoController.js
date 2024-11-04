const express = require("express");
var ObjectID = require('mongoose').Types.ObjectId;
const app = express();

var { ToDo } = require("../models/todo");

// Get all todos
app.get("/", (req, res) => {
  ToDo.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log("Error in Retrieving ToDos:", JSON.stringify(err, undefined, 2));
    }
  });
});

// Get a single todo by ID
app.get('/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`No record with given id: ${req.params.id}`);
  }

  ToDo.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log("Error in Retrieving ToDo:", JSON.stringify(err, undefined, 2));
    }
  });
});

// Create a new todo
app.post("/", (req, res) => {
  var tdl = new ToDo({
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
  });
  tdl.save((err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log("Error in Saving ToDo:", JSON.stringify(err, undefined, 2));
    }
  });
});

// Update an existing todo
app.put('/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`No record with given id: ${req.params.id}`);
  }

  const updatedTodo = {
    name: req.body.name,
    description: req.body.description,
    date: req.body.date
  };

  ToDo.findByIdAndUpdate(req.params.id, { $set: updatedTodo }, { new: true }, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log("Error in Updating ToDo:", JSON.stringify(err, undefined, 2));
      res.status(500).send("Error updating the to-do");
    }
  });
});

// Delete a todo
app.delete('/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`No record with given id: ${req.params.id}`);
  }

  ToDo.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.send(doc);
    } else {
      console.log("Error in Deleting ToDo:", JSON.stringify(err, undefined, 2));
    }
  });
});

module.exports = app;
