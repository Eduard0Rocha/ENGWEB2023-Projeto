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

module.exports.getProdutores = () => {

    return user.find({nivel: {$nin: ["Consumidor"]}}, {username:1,_id:0})
        .sort({username:1})
        .then(res => {

            resList = [];

            res.forEach(elem => {

                resList.push(elem.username);
            })

            return resList;
        })
        .catch(err => {
            return err;
        })
}