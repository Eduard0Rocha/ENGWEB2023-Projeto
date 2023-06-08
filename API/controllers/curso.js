var curso = require("../models/curso");

module.exports.list = () => {

    return curso.find().sort("nomeDoCurso").sort("universidade")
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}

module.exports.getById = id => {

    return curso.findOne({"_id": id})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}