var express = require('express');
var router = express.Router();

var axios = require("axios");

router.get("/", function(req,res) {

    var jwtToken = req.cookies.jwt;

    if (!jwtToken) {

        return res.redirect("/login");
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

            return res.render("pagConsumidor");
        })

        .catch(err => {

            return res.redirect("/login");
        })
})

module.exports = router;