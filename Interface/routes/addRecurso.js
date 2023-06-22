var express = require('express');
var router = express.Router();

var axios = require("axios");
var fs = require("fs");
var multer = require('multer');

var upload = multer({dest: "uploads/"});

router.get("/", function(req,res) {

    var jwtToken = req.cookies.jwt;

    if (!jwtToken) {

        return res.redirect("/login");
    }

    axios.get("http://api_gfich:3000/api/users", {
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

            axios.get("http://api_gfich:3000/api/cursos")
                .then(r => {
                    return res.render("addRecurso", {cursos: r.data});
                })
                .catch(err => {
                    return res.render("error", {error: err});
                })
        })

        .catch(err => {

            return res.redirect("/index");
        })
});

function removeEmptyStrings(lista) {
    const novaLista = [];
  
    lista.forEach((elemento) => {
      if (typeof elemento === 'string' && elemento.length > 0) {
        novaLista.push(elemento);
      }
    });
  
    return novaLista;
  }

function createFileInfo(reqBody, username, filename) {

    var newFile = reqBody;

    if (newFile.subtitulo == "") {

        delete newFile.subtitulo;
    }

    if (newFile.temas == "") {

        newFile.temas = [];
    }

    else {

        newFile.temas = newFile.temas.split(/\s+/);

        newFile.temas = removeEmptyStrings(newFile.temas);
    }

    if (newFile.curso_uni == "N/A") {

        delete newFile.curso_uni;
    }

    newFile.produtor = username;

    newFile.filename = filename;

    return newFile;
}

router.post("/", upload.single('pacote'), function(req,res) {

    var jwtToken = req.cookies.jwt;

    if (!jwtToken) {

        return res.redirect("/login");
    }

    axios.get("http://api_gfich:3000/api/users", {
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

            var fileInfo = createFileInfo(req.body, user.username, req.file.filename);

            axios.post("http://api_gfich:3000/api/files/addRecurso", fileInfo, {

                headers: {
                    authorization: "Bearer " + jwtToken,
                }
            })

            .then(r2 => {

                console.log("Relatório de ingestão recebido");

                axios.get("http://api_gfich:3000/api/cursos")
                    .then(r3 => {
                        return res.render("addRecurso", {cursos: r3.data, relatorio: r2.data});
                    })
                    .catch(err3 => {
                        return res.render("error", {error: err3});
                    })
            })

            .catch(err2 => {

                console.log("Erro: Metadados do ficheiro não recebidos pela API");
            });
        })

        .catch(err => {

            return res.redirect("/index");
        });
});

// esta rota é protegida por uma chave que apenas é conhecida pelos servidores

router.get("/download", function(req,res) {

    var key = req.query.key;

    if (key != "key") res.sendStatus(401);

    var file = req.query.file;

    var fileStream = fs.createReadStream('uploads/' + file)

    res.setHeader('Content-Type', 'application/zip');

    fileStream.pipe(res);

    res.on('close', () => {

        fs.unlink("uploads/" + file, (err) => {

            if (err) {

                console.log("Erro ao eliminar o ficheiro");
            }

            else {

                console.log("Ficheiro enviado para a API e removido da Interface");
            }
        })
    })
});

module.exports = router;