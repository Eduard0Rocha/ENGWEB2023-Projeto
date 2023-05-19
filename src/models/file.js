var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({

    _id: Number,
    nome: String,
    tipo: String,
    tema: [String],
    dataCriacao: String,
    dataRegisto: String,
    visibilidade: String,
});

module.exports = mongoose.model('file');