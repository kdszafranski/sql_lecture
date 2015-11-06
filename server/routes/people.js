var express = require("express");
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/example_database';

router.post("/add", function(req, res) {
    // grab data from the http request
    var data = {
        name: req.body.peopleAdd,
        location: req.body.locationAdd
    };

    if(data.name != "") {
        pg.connect(connectionString, function (err, client, done) {
            //SQL Query > Insert Data
            //Uses prepared statements, the $1 and $2 are placeholder variables. PSQL then makes sure they are relatively safe values
            //and then uses them when it executes the query.
            client.query("INSERT INTO people (name, location) VALUES ($1, $2) RETURNING id", [data.name, data.location],
                function(err, result) {
                    if(err) {
                        console.log("Error inserting data: ", err);
                        res.send(false)
                    }

                    res.send(true);
                });
        });
    } else {
        res.send(false);
    }

});

router.post("/find", function(req, res) {
    var searchFor = req.body.peopleSearch;
    var results = [];

    pg.connect(connectionString, function (err, client, done) {
        console.log("Find: ", searchFor);
        var person = "%" + searchFor + "%";
        var query = client.query("SELECT * FROM people WHERE name ILIKE $1", [person]);

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

router.delete("/remove", function(req, res) {
    pg.connect(connectionString, function (err, client, done) {
        var query = client.query("DELETE FROM people WHERE id = $1", [req.body.id],
            function(err, result) {
                if(err) {
                    console.log("Error deleting row: ", err);
                    res.send(false)
                }

                res.send(true);
            });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

// Returns the entire list of people
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

//INSERT INTO people (name, location)
//    VALUES ('Clark Kent', 'Metropolis'),
//        ('Bruce Wayne', 'Gotham City'),
//        ('Professor X', 'Westchester')
//;