const passport = require("passport");
var user = require("../models/user");

module.exports.createUser = u => {

    return user.create(u)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}

module.exports.list = () => {

    return user.find()
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

module.exports.getUserByName = nome => {

    return user.findOne({"username": nome})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}

module.exports.updateUltimoAcesso = nome => {

    return user.updateOne({"username": nome},{"dataDeUltimoAcesso": new Date()})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

module.exports.changePassword = (nome, password) => {
    return user.updateOne({"username": nome},{"password": password})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}

module.exports.deleteUser = nome => {

    return user.deleteOne({"username": nome})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}