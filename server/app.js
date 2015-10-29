/*  SERVER  */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var index = require('./routes/index');

app.set('port', process.env.PORT || 5000);

// mount body parser middleware
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));

// mount router middleware
app.use("/", index);

// set node to listen on a port
app.listen(app.get('port'), function() {
    console.log("Server is ready.");
});