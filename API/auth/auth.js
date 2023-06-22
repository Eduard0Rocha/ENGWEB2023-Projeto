var jwt = require('jsonwebtoken')

module.exports.verificaAcesso = function (req, res, next){
    
    var token = req.headers.authorization;

    if(token){

      token = token.replace("Bearer ", "");

      jwt.verify(token, "gfich", function(e, payload){
        if(e){
          res.status(401).jsonp({error: e})
        }
        else{
          req.user = payload;
          next()
        }
      })
    }
    else{
      res.status(401).jsonp({error: "Token inexistente!"})
    }
  }

