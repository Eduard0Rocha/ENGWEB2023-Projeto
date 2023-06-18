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

            var nivel = r.data.nivel;

            switch(nivel) {

                case "Consumidor": {

                    return res.redirect("/consumidor");
                }

                case "Produtor": {

                    return res.redirect("/produtor");
                }

                case "Administrador": {

                    return res.redirect("/admin");
                }

                default: {

                    return res.redirect("/index");
                }
            }
        })
        .catch(err => {
            return res.redirect("/login")
        })
});

module.exports = router;