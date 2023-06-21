var express = require('express');
var router = express.Router();

var auth = require('../auth/auth');

var comentarioController = require('../controllers/comentario');
const comentario = require('../models/comentario');

router.post("/", auth.verificaAcesso, function(req,res) {

    var rank = req.body.rank;
    var comentario = req.body.comentario;
    var idRecurso = req.body.file_id;
    var userName = req.user.username

    comentarioController.addComentario({
        rank: rank,
        comentario: comentario,
        idRecurso: idRecurso,
        userName: userName
    })

    .then(data => {

        return res.send(data);
    })

    .catch(err => {

        return res.sendStatus(500).json(err);
    })
});

router.delete("/:id", auth.verificaAcesso, function(req,res) {

    comentarioController.deleteComentario(req.user.username, req.params.id)
        .then(data => {
            res.status(204).json(data);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

module.exports = router;