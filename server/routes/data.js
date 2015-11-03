var express = require("express");
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/example_database';

router.get("/", function(req, res) {
    pg.connect(connectionString, function (err, client, done) {
        var results = [];

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM people ORDER BY name DESC");

        // Stream results back one row at a time
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

//router.post("/add", function(req, res) {
//
//SQL Query > Insert Data
//client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);
//});


module.exports = router;

//INSERT INTO people (name, spirit_animal, city)
//    VALUES ('Clark Kent', 'Eagle', 'Metropolis'),
//        ('Bruce Wayne', 'Bat', 'Gotham City'),
//        ('Professor X', 'Wombat', 'Westchester')
//;