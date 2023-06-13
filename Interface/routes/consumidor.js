var express = require('express');
var router = express.Router();

var axios = require("axios");

router.get("/", function(req,res) {

    var jwtToken = req.cookies.jwt;

    if (!jwtToken) {

        res.redirect("/login");

        return;
    }

    axios.get("http://localhost:3000/api/users", {
        headers: {
            authorization: "Bearer " + jwtToken
        }
    })
        .then(r => {

            // TODO: usar este valor
            var user = r.data;

            // Nota: este nao precisa de proteção pois todos os users registados podem aceder

            res.render("pagConsumidor");
        })

        .catch(err => {

            res.render("error", {error: err});
        })
})


module.exports = router;