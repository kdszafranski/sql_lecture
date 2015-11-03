/*  SERVER  */
var express = require('express');
var app = express();

// mount body parser middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

var data = require('./routes/data');
var index = require('./routes/index');

// mount router middleware
app.use("/data", data);
app.use("/", index);



// set node to listen on a port
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log("Server is ready.");
});