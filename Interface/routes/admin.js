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

            var user = r.data;

            var nivel = user.nivel;

            if (nivel != "Administrador") {

                return res.redirect("/index");
            }

            // TODO: obter informação de todos os utilizadores
            // TODO: obter informação de todos os recurso
            // TODO: renderizar informação dos utilizadores
            // TODO: renderizar informação dos recursos
            // TODO: funcionalidade de eliminar recurso
            // TODO: funcionalidade de eliminar utilizador

            return res.render("pagAdmin", {username:user.username});
        })

        .catch(err => {
            return res.redirect("/login");
        })
});

module.exports = router;