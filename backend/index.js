const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db.js')
var todoController = require('./controllers/todoController.js');

var app = express();
app.use(bodyParser.json());

// Configure CORS to accept both local and production URLs
const allowedOrigins = [
    'http://localhost:4200',
    process.env.FRONTEND_URL || 'http://localhost:4200'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Use environment variable for port, default to 3000
const PORT = process.env.PORT || 3000;

app.use('/todolist', todoController);

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));

