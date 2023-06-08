var user = require("../models/user");

module.exports.createUser = u => {

    // TODO: nao permitir criar utilizadores que nao sejam produtor ou consumidor

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

    return user.findOne({"nome": nome})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}