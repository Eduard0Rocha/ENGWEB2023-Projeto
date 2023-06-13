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

            var nivel = user.nivel;

            if (nivel == "Consumidor") {

                res.redirect("/index");

                return;
            }

            res.render("pagProdutor");
        })

        .catch(err => {

            res.render("error", {error: err});
        })
})

module.exports = router;