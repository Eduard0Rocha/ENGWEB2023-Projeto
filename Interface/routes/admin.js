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

            axios.get("http://localhost:3000/api/users/all", {
                headers: {
                    authorization: "Bearer " + jwtToken
                }
            })
            .then(r2 => {

                var users = r2.data;

                axios.get("http://localhost:3000/api/files/all", {
                    headers: {
                        authorization: "Bearer " + jwtToken
                    }
                })

                .then(r3 => {

                    var recursos = r3.data;

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

                    return res.render("pagAdmin", {username:user.username, users: users, recursos: recursos});
                })

                .catch(err3 => {
                    return res.redirect("/login");
                });
            })
            .catch(err2 => {
                return res.redirect("/login");
            });
        })

        .catch(err => {
            return res.redirect("/login");
        })
});

router.get("/deleteUser", function(req,res) {

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

        if (user.nivel != "Administrador") return res.redirect("/index");

        if (req.query.password != user.password) {

            axios.get("http://localhost:3000/api/users/all", {
                headers: {
                    authorization: "Bearer " + jwtToken
                }
            })
            .then(r2 => {

                var users = r2.data;

                axios.get("http://localhost:3000/api/files/all", {
                    headers: {
                        authorization: "Bearer " + jwtToken
                    }
                })

                .then(r3 => {

                    var recursos = r3.data;

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

                    return res.render("pagAdmin", {username:user.username, users: users, recursos: recursos, wrongPass:true});
                })

                .catch(err3 => {
                    return res.redirect("/login");
                });
            })
            .catch(err2 => {
                return res.redirect("/login");
            });
        }

        axios.delete("http://localhost:3000/api/users/" + req.query.username, {
            headers: {
                authorization: "Bearer " + jwtToken
            }
        })
            .then(r2 => {

                return res.redirect("/admin");
            })
            .catch(err => {

                return res.render("error", {error: err});
            });
    })
    .catch(err => {
        return res.render("error", {error: err});
    });
});

router.get("/deleteRecurso", function(req,res) {

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

        if (user.nivel != "Administrador") return res.redirect("/index");

        if (req.query.password != user.password) {

            axios.get("http://localhost:3000/api/users/all", {
                headers: {
                    authorization: "Bearer " + jwtToken
                }
            })
            .then(r2 => {

                var users = r2.data;

                axios.get("http://localhost:3000/api/files/all", {
                    headers: {
                        authorization: "Bearer " + jwtToken
                    }
                })

                .then(r3 => {

                    var recursos = r3.data;

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

                    return res.render("pagAdmin", {username:user.username, users: users, recursos: recursos, wrongPass:true});
                })

                .catch(err3 => {
                    return res.redirect("/login");
                });
            })
            .catch(err2 => {
                return res.redirect("/login");
            });
        }

        axios.delete("http://localhost:3000/api/files/" + req.query.idRecurso, {
            headers: {
                authorization: "Bearer " + jwtToken
            }
        })
            .then(r2 => {

                return res.redirect('/admin');
            })
            .catch(err => {

                return res.render("error", {error: err});
            });
    })
    .catch(err => {
        return res.render("error", {error: err});
    });
});

module.exports = router;