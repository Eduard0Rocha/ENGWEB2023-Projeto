var User = require('../models/user')

// TODO: testar
module.exports.list = () => {
    return User
        .find()
        .then(dados => {
            return dados;
        })
        .catch(erro => {
            return erro;
        })
}


module.exports.addUser = u => {
    return User.create(u)
        .then(dados => {
            return dados
        })
        .catch(erro => {
            return erro
        })
}