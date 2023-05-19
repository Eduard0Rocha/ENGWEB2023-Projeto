var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({

    _idFile: Number,
    _idUser: Number,
    rank: Number,
    comment: Number,
});

module.exports = mongoose.model('comment');