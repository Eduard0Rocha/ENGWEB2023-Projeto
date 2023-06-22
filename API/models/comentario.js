var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var comentarioSchema = new Schema({

    rank: {
        type: Number,
        required: true
    },
    comentario: {
        type: String,
        required: false,
        default: ""
    },
    idRecurso: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Comentario", comentarioSchema, 'comentarios');