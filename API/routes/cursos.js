var express = require('express');
var router = express.Router();

var curso = require("../controllers/curso");

router.get("/", function(req,res) {

    curso.list()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(erro => {
            res.status(500).json({"error": erro});
        });
});

router.get("/:id", function(req, res) {

    curso.getById(req.params.id)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(erro => {
            res.status(500).json({"error": erro});
        });
});

module.exports = router;