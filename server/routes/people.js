var express = require("express");
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/example_database';

router.post("/add", function(req, res) {
    pg.connect(connectionString, function (err, client, done) {
        // grab data from the http request
        var data = {
            name: req.body.peopleAdd,
            location: req.body.locationAdd
        };

        //SQL Query > Insert Data
        client.query("INSERT INTO people (name, location) VALUES ($1, $2) RETURNING id", [data.name, data.location],
            function(err, result) {
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false)
                }

                res.send(true);
            });
    });
});

router.post("/find", function(req, res) {
    console.log(req);
    var searchFor = req.query.peopleSearch;
    var results = [];

    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT * FROM people WHERE name LIKE \'%" + searchFor + "%\' ");
        console.log("FIND Query: ", query.text);

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

router.delete("/remove", function() {

});

router.get("/", function(req, res) {
    var results = [];

    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("SELECT * FROM people ORDER BY name ASC");

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

module.exports = router;

//INSERT INTO people (name, spirit_animal, city)
//    VALUES ('Clark Kent', 'Eagle', 'Metropolis'),
//        ('Bruce Wayne', 'Bat', 'Gotham City'),
//        ('Professor X', 'Wombat', 'Westchester')
//;