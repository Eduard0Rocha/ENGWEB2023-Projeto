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

            var nivel = user.nivel;

            if (nivel != "Administrador") {

                return res.redirect("/index");
            }

            return res.render("pagAdmin");
        })

        .catch(err => {
            return res.redirect("/login");
        })
});

module.exports = router;