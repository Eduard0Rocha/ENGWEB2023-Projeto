var express = require('express');
var router = express.Router();

var axios = require("axios");

router.get("/", function(req,res) {

    var jwtToken = req.cookies.jwt;

    // TODO: enviar o token para a api nos headers

    axios.get("http://localhost:3000/api/users")
        .then(r => {
            console.log(r.data);
        })
        .catch(err => {
            res.render("error", {error: err});
        })
})

module.exports = router;