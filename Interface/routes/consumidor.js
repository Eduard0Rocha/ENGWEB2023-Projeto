var express = require('express');
var router = express.Router();

var axios = require("axios");

function comentar(jwtToken, rank, comentario, file_id,res) {

    axios.post("http://api_gfich:3000/api/comentarios",{

        rank: rank,
        comentario: comentario,
        file_id: file_id
    },
    {
        headers: {
            authorization: "Bearer " + jwtToken
        }
    })

    .then(r => {
        
        return res.redirect("/consumidor");
    })

    .catch(err => {

        console.log("Erro ao adicionar comentário: " + err);
    })
}

function apagarComentario(jwtToken, idRecurso, res) {

    axios.delete("http://api_gfich:3000/api/comentarios/" + idRecurso, {

        headers: {
            authorization: "Bearer " + jwtToken
        }
    })
    .then(data => {

        return res.redirect("/consumidor");
    })
    .catch(err => {

        return res.render("error", {error: err});
    })
}

router.get("/", async function(req,res) {

    var jwtToken = req.cookies.jwt;

    if (!jwtToken) {

        return res.redirect("/login");
    }

    if (req.query.rank) {

        var rank = parseInt(req.query.rank);
        var comentario = req.query.comentario;
        var file_id = req.query.file_id;

        return comentar(jwtToken,rank,comentario,file_id,res);
    }

    else if (req.query.apagarcomentario) {

        return apagarComentario(jwtToken,req.query.apagarcomentario,res);
    }

    else {

        axios.get("http://api_gfich:3000/api/users", {
            headers: {
                authorization: "Bearer " + jwtToken
            }
        })
            .then(r => {

                var user = r.data;

                // Nota: este nao precisa de proteção pois todos os users registados podem aceder

                var isProdutor = (user.nivel == "Produtor" || user.nivel == "Administrador");
                var isAdmin = user.nivel == "Administrador";

                var tema = req.query.tema ? req.query.tema : "";
                var produtor = req.query.produtor ? req.query.produtor : "";

                axios.get("http://api_gfich:3000/api/files/consumidorPageData?tema=" + tema + "&produtor=" + produtor, {
                    headers: {
                        authorization: "Bearer " + jwtToken
                    }
                })

                .then(r2 => {

                    var produtores = r2.data.produtores;
                    var temas = r2.data.temas;
                    var noticias = r2.data.noticias;
                    var recursos = r2.data.recursos;

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

                    recursos.forEach(recurso => {

                        let hasComentario = false;

                        recurso.comentarios.forEach(comentario => {

                            if (comentario.userName == user.username) {

                                hasComentario = true;
                            }
                        })

                        recurso.hasComentario = hasComentario;
                    })

                    return res.render("pagConsumidor", {
                        username: user.username, 
                        isProdutor: isProdutor,
                        isAdmin: isAdmin,
                        produtores: produtores,
                        temas: temas,
                        noticias: noticias,
                        recursos: recursos
                    })
                })

                .catch(err2 => {

                    return res.redirect("/login");
                })
            })

            .catch(err => {

                return res.redirect("/login");
            })
    }
})

module.exports = router;