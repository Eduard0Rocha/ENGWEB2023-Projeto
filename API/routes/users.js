var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth')
var user = require("../controllers/user");

router.get("/", auth.verificaAcesso, function(req,res) {

  user.getUserByName(req.user.username)
    .then(data1 => {

      if (!req.query.nome && data1.username == req.user.username) {

        res.status(200).json(data1);
      }

      else {

        if (!req.query.nome) res.status(401).json();

        if (data1.nivel == "Administrador") {

          user.getUserByName(req.query.nome)
            .then(data => {
              res.status(200).json(data);
            })
            .catch(erro => {
              res.status(500).json(erro);
            })
        }
  
        else {
  
          res.status(401).json();
        }
      }
    })

  .catch(err => {
    res.status(500).json(err);
  })
});

router.post('/register', function(req, res) {

  userModel.register(new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cargo: req.body.cargo,
    curso: req.body.curso,
    universidade: req.body.universidade,
    nivel: req.body.nivel
  }),
    req.body.password,
    function(err, user) {

      if (err) {

        res.jsonp({error: err, message: "Register error: " + err});

      }
      else {

        passport.authenticate("local")(req,res,function() {
          
            jwt.sign({
              username: req.body.username,
            },
            "gfich",
            {expiresIn: 3600},
            function(e, token) {
              if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
              else res.status(201).jsonp({token: token})
            });
        });
      }
    }
  );
});

router.post("/login", 
  
  function(req,res) {

    passport.authenticate("local")(req,res,function() {
          
      jwt.sign({
        username: req.body.username,
      },
      "gfich",
      {expiresIn: 3600},
      function(e, token) {
        if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
        else res.status(201).jsonp({token: token})
      }
    )})

    user.updateUltimoAcesso(req.body.username)
      .then(data => {
        console.log("Usuário " + req.body.username + " logado");
      })
      .catch(erro => {
        console.log("Erro ao atualizar a data de último acesso");
      })
  }
);

router.put("/newpass", auth.verificaAcesso, function(req,res) {

  user.changePassword(req.user.username, req.body.novaPassword)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(erro => {
      res.status(500).json(erro);
    })
});

router.delete("/:nome", auth.verificaAcesso, function(req,res) {

  user.getUserByName(req.user.username)
  .then(data1 => {

    if (data1.nivel == "Administrador" || data1.username == req.user.username) {

      user.deleteUser(req.params.nome)
        .then(data => {
          res.status(204).json(data);
        })
        .catch(erro => {
          res.status(500).json(erro);
        })
    }

    else {

      res.status(401).json();
    }
  })

  .catch(err => {
    res.status(500).json(err);
  })
});

module.exports = router;