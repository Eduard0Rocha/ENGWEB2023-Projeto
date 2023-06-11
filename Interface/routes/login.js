var express = require('express');
var router = express.Router();

var axios = require("axios");

router.get('/', function(req, res) {

  axios.get("http://localhost:3000/api/cursos")
    .then(r => {
      res.render("login", {cursos: r.data});
    })
    .catch(err => {
      res.render("error", {error: err});
    })
});

module.exports = router;
