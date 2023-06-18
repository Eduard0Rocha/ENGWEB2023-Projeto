var file = require("../models/file");

module.exports.createFile = f => {

    f.file = f.file+"d";

    return file.create(f)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

module.exports.deleteFile = id => {

    return file.deleteOne({"_id" : id})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}