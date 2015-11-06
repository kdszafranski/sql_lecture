/*  SERVER  */
var express = require('express');
var app = express();

var people = require('./routes/people');
var index = require('./routes/index');

// mount body parser middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

// mount router middleware
app.use("/people", people);
app.use("/", index);

// set node to listen on a port
app.set('port', process.env.PORT || 5000);
app.listen(app.get("port"), function() {
    console.log("Server is ready: " + app.get("port"));
});