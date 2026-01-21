const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, fallback to local for development
const mongoURI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/TodoList';

mongoose.connect(mongoURI, (err) => {
    if(!err)
    console.log('MongoDB connection succeeded.');
    else
    console.log('Error in DB connection: ' + JSON.stringify(err,undefined,2));

})

module.exports = mongoose