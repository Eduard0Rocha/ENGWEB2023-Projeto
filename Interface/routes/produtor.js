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

            if (nivel == "Consumidor") {

                return res.redirect("/index");
            }

            axios.get("http://localhost:3000/api/files/produtorPageData", {
                headers: {
                    authorization: "Bearer " + jwtToken
                }
            })
                .then(r => {

                    var recursos = r.data;

                    recursos.forEach(recurso => {
                        
                        let somaRanks = 0;

                        recurso.comentarios.forEach(comentario => {

                            somaRanks += comentario.rank;
                        })

                        if (recurso.comentarios == []) {

                            recurso.mediaRank = null;
                        }

                        else {

                            recurso.mediaRank = somaRanks / recurso.comentarios.length;
                        }
                    });

                    return res.render("pagProdutor", {
                        username:user.username, 
                        isAdmin: nivel=="Administrador",
                        recursos: recursos
                    });
                })
                .catch(err => {

                    return res.render("error",{error: err});
                })
        })

        .catch(err => {

            return res.redirect("/login");
        })
});

router.get("/delete", function(req,res) {

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

        if (user.nivel == "Consumidor") return res.redirect("/index");

        if (req.query.password != user.password) {

            axios.get("http://localhost:3000/api/files/produtorPageData", {
                headers: {
                    authorization: "Bearer " + jwtToken
                }
            })
                .then(r => {

                    var recursos = r.data;

                    recursos.forEach(recurso => {
                        
                        let somaRanks = 0;

                        recurso.comentarios.forEach(comentario => {

                            somaRanks += comentario.rank;
                        })

                        if (recurso.comentarios == []) {

                            recurso.mediaRank = null;
                        }

                        else {

                            recurso.mediaRank = somaRanks / recurso.comentarios.length;
                        }
                    });

                    return res.render("pagProdutor", {
                        username:user.username, 
                        isAdmin: user.nivel=="Administrador",
                        recursos: recursos,
                        wrongPass: true
                    });
                })
                .catch(err => {

                    return res.render("error",{error: err});
                })
        }

        var idRecurso = req.query.idRecurso;

        axios.delete("http://localhost:3000/api/files/" + idRecurso, {
            headers: {
                authorization: "Bearer " + jwtToken
            }
        })

        .then(r => {

            return res.redirect("/produtor");
        })

        .catch(err => {
            return res.render("error", {error: err});
        })
    })

    .catch(err => {
        return res.render("error", {error: err});
    })
});

module.exports = router;