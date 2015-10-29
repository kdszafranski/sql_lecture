var express = require("express");
var router = express.Router();
var path = require('path');


router.route("/data")
    .get(function(req, res) {
        res.send("Hello");
    })
    .post(function(req, res) {
        // req.body is provided from body-parser middleware
        res.send({message: "Hello " + req.body.valueInput});
    });

router.get("/*", function(req, res) {
    var file = req.params[0] || "index.html";
    res.sendFile(path.join(__dirname, "../public", file));
});

module.exports = router;