var mongoose = require('mongoose');

var fileSchema = new mongoose.Schema({

    _id: Number,
    nome: String,
    tipo: String,
    tema: [String],
    dataCriacao: Date,
    dataRegisto: Date,
    visibilidade: String,
});

module.exports = mongoose.model('file');