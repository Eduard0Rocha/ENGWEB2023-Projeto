var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    curso: {
        type: String,
        required: true
    },
    universidade: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        required: true
    },
    dataDeRegisto: {
        type: Date,
        required: true,
        default: new Date() 
    },
    dataDeUltimoAcesso: {
        type: Date,
        required: true,
        default: new Date()
    },
    listaDeTemas: {

        type: [{
            tema: {
                desc: {
                    type: String,
                    required: true
                },
                numeroDePesquisas: {
                    type: Number,
                    required: true
                }
            }}
        ],

        required: true,

        default: []
    } 
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema, 'users');