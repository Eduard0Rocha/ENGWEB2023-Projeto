var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var cursoSchema = new Schema({

    "universidade": String,
    "nomeDoCurso": String
});

module.exports = mongoose.model("Curso", cursoSchema, 'cursos');