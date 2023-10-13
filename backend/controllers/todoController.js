const express = require("express");
var ObjectID = require('mongoose').Types.ObjectId;
const app = express();

var { ToDo } = require("../models/todo");

app.get("/", (req, res) => {
  ToDo.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log(
        "Error in Retriving ToDos:" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

// individual id request
app.get('/:id',(req, res) => {
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('No record with given id : ${req.params.id}');

    ToDo.findById(req.params.id, (err,doc) => {
        if(!err) {res.send(doc);}
        else { console.log(
            "Error in Retriving ToDos:" + JSON.stringify(err, undefined, 2)
          );
        }
    });
})

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
      console.log(
        "Error in Retriving ToDos:" + JSON.stringify(err, undefined, 2)
      );
    }
  });
});

//updating todo
app.put('/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('No record with given id : ${req.params.id}');

    var tdl = new ToDo({
        name: req.body.name,
        description: req.body.description,
        date: req.body.date,
      });
    ToDo.findByIdAndUpdate(req.params.id, {$set: tdl}, {new: true}, (err, doc) =>{
        if (!err) {
            res.send(doc);
          } else {
            console.log(
              "Error in Retriving ToDos:" + JSON.stringify(err, undefined, 2)
            );
          }
    })
});

app.delete('/:id', (req,res) => {
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('No record with given id : ${req.params.id}');

    ToDo.findByIdAndRemove(req.params.id, (err, doc) =>{
        if (!err) {
            res.send(doc);
          } else {
            console.log(
              "Error in Retriving ToDos:" + JSON.stringify(err, undefined, 2)
            );
          }
    })
});

module.exports = app;
