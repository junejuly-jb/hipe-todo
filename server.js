const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// middleware
app.use(morgan('combined'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// import database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todos'
};

const db = require('./database/db')(dbConfig);
db.connect(); 

// register our API routes
const userHandler = require('./api/users.handler')(express, db);

// api routes
app.use('/api/v1', userHandler);

const PORT = process.env.PORT || "8080";
app.listen(PORT, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Server is running on PORT: ${PORT}!`);
});


