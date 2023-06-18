var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var fileSchema = new Schema({

    titulo: {
        type: String,
        required: true
    },
    subtitulo: {
        type: String,
        required: false
    },
    tipo: {
        type: String,
        required: true
    },
    temas: {
        type: [String],
        required: true,
        default: []
    },
    visibilidade: {
        type: String,
        required: true
    },
    curso_uni: {
        type: String,
        required: false
    },
    produtor: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("File", fileSchema, 'files');