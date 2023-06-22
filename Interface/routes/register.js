var express = require('express');
var router = express.Router();

var axios = require("axios");

router.post("/", function(req,res) {

    var newUser = req.body;

    if (newUser.nivel != "Produtor" && newUser.nivel != "Consumidor") {

        return res.redirect("/login");
    }

    axios.get("http://api_gfich:3000/api/cursos/" + newUser.curso_uni)
        .then(r => {
            delete newUser.curso_uni;
            newUser.curso = r.data.nomeDoCurso;
            newUser.universidade = r.data.universidade;

            axios.post("http://api_gfich:3000/api/users/register", newUser)
                .then(r2 => {

                    if (r2.data.error) {

                        axios.get("http://api_gfich:3000/api/cursos")
                            .then(r3 => {
                                return res.render("login", {cursos: r3.data, message: r2.data.error.message});
                            })
                            .catch(err3 => {
                                return res.render("error", {error: err3});
                            })
                    }

                    else {

                        token = r2.data.token; 
                        
                        res.send(`
                            <html>
                                <body>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js"></script>
                                <script>
                                    Cookies.set('jwt', '${token}',{expires: 3600});
                                    window.location.href = '/index';
                                </script>
                                </body>
                            </html>
                        `)
                    }
                })
                .catch(err2 => {
                    return res.render("error", {error: err2});
                })
            })

        .catch(err => {
            return res.render("error", {error: err});
        });
});

router.get("/", function(req,res) {

    return res.redirect("/login");
});

module.exports = router;