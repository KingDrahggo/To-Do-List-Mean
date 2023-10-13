const mongoose = require('mongoose');

// Mongodb Schema
var ToDo = mongoose.model('ToDo', {
    
    name: {type: String},
    description: {type: String},
    date: {type: Number}
});

module.exports = { ToDo };