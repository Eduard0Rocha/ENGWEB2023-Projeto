var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken')
var passport = require('passport')

var userModel = require('../models/user')
var auth = require('../auth/auth')

var user = require("../controllers/user");

router.post('/', function(req, res) {

  userModel.register(new userModel({
    // TODO
  }))

  // TODO: gerar token
  user.createUser(req.body)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(erro => {
      res.status(601).json({"error": erro});
    });
});

router.get("/:nome", function(req,res) {

  // TODO: proteger esta route

  user.getUserByName(req.params.nome)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(erro => {
      res.status(500).json(erro);
    })
})

module.exports = router;