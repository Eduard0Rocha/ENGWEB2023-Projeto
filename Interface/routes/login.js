var express = require('express');
var router = express.Router();

var axios = require("axios");

router.get('/', function(req, res) {

  axios.get("http://localhost:3000/api/cursos")
    .then(r => {
      return res.render("login", {cursos: r.data});
    })
    .catch(err => {
      return res.render("error", {error: err});
    })
});

router.post("/", function(req,res) {

  axios.post("http://localhost:3000/api/users/login", req.body)
    .then(r => {

      if (r.data.error) {

        axios.get("http://localhost:3000/api/cursos")
          .then(r2 => {
              return res.render("login", {cursos: r2.data, message: r.data.error.message});
          })
          .catch(err2 => {
              return res.render("error", {error: err2});
          })
      }

      else {

        token = r.data.token;

        return res.send(`
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
    .catch(err => {
      axios.get("http://localhost:3000/api/cursos")
        .then(r2 => {
            return res.render("login", {cursos: r2.data, message: "Credenciais inválidas"});
        })
        .catch(err2 => {
            return res.render("error", {error: err2});
        })
    })
})

module.exports = router;
