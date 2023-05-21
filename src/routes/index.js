var express = require('express');
var router = express.Router();

var userController = require("../controllers/user");

const { hashPassword } = require("../utils/hashpass");

/* GET home page. */
router.get('/', function(req, res) {

    // TODO: receber cookies e perceber se pode começar sessão
    
    res.render('index');
});

router.post('/login', function(req,res) {

    //TODO
});

router.post('/register', function(req,res) {

    const { username, email, password, filiacao, nivel } = req.body;

    // TODO: registo com hashpassword

    //console.log(userController.addUser(req.body));

    //console.log(userController.list());

    //console.log(req.body);

    // TODO: controllers para user

    // TODO: adionar à BD se o nome ainda não existir (e testar)

    // TODO: se exite o user mandar a mensagem de que existe (usar argumetos - bool - no index e reendirecionar)

    // TODO: cookies (enviar cookie)
})

module.exports = router;