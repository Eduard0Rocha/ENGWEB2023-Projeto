var comentario = require("../models/comentario");

module.exports.addComentario = c => {

    return comentario.create(c)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}

module.exports.getComentariosDoRecurso = idRecurso => {

    return comentario.find({idRecurso: idRecurso})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}

module.exports.deleteComentario = (userName, id) => {

    return comentario.deleteMany({userName: userName, idRecurso:id})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}