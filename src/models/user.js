var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({

    _id: Number,
    nome: String,
    email: String,
    filiacao: String,
    nivel: String,
    dataRegisto: Date,
    dataUltimoAcesso: Date,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);