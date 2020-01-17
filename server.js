const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

const app = express();

// tell express about hbs.
const partialsPath = path.join(__dirname, 'views/partials');
hbs.registerPartials(partialsPath);

// set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware
app.use(morgan('combined'));
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// register our static assets.(CSS,IMAGES,JS)
app.use(express.static(path.join(__dirname, 'public')));

// import database
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todos'
};

const db = require('./database/db')(dbConfig);
db.connect(); 

// register our API routes.
const userHandler = require('./api/users.handler')(express, db);
const todoHandler = require('./api/todo.handler')(express, db);

// register our regular route handler.
const indexHandler = require('./routes/index.handler')(express);
const todos = require('./routes/todo.handler')(express);

// regular routes
app.use('/', indexHandler);
app.use('/new', todos);


// api routes
app.use('/api/v1', [userHandler, todoHandler]);

const PORT = process.env.PORT || "8080";
app.listen(PORT, (err) => {
    if (err) {
        throw err;
    }
    console.log(`Server is running on PORT: ${PORT}!`);
});