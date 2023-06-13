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

            var nivel = r.data.nivel;

            switch(nivel) {

                case "Consumidor": {

                    res.redirect("/consumidor");
                }

                case "Produtor": {

                    res.redirect("/produtor");
                }

                case "Administrador": {

                    res.redirect("/admin");
                }

                default: {

                    res.redirect("/index");
                }
            }
        })
        .catch(err => {
            res.render("error", {error: err});
        })
});

// TODO: router para user
// TODO: rota de logout
// TODO: rota de mudar palavra pass
// TODO: rota de eliminar conta

module.exports = router;