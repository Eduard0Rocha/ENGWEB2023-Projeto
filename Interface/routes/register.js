var express = require('express');
var router = express.Router();

var axios = require("axios");

// TODO: eliminar isto

router.post("/", function(req,res) {

    var newUser = req.body;

    axios.get("http://localhost:3000/api/cursos/" + newUser.curso_uni)
        .then(r => {
            delete newUser.curso_uni;
            newUser.curso = r.data.nomeDoCurso;
            newUser.universidade = r.data.universidade;

            axios.post("http://localhost:3000/api/users/register", newUser)
                .then(r2 => {

                    if (r2.data.error) {

                        // TODO: Meter isto numa mensagem no pug de login

                        res.json(r2.data.error);
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
                    res.render("error", {error: err2});
                })
            })

        .catch(err => {
            res.render("error", {error: err});
        });
})

module.exports = router;