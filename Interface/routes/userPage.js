var express = require('express');
var router = express.Router();

var axios = require("axios");

router.get("/", function(req,res) {

    var jwtToken = req.cookies.jwt;

    if (!jwtToken) {

        return res.redirect("/login");
    }

    axios.get("http://api_gfich:3000/api/users", {
        headers: {
            authorization: "Bearer " + jwtToken
        }
    })
        .then(r => {

            return res.render("userPage", {user: r.data});
        })
        .catch(erro => {

            return res.redirect("/login");
        })
});

router.get("/changePassword", function(req,res) {

    var jwtToken = req.cookies.jwt;

    if (!jwtToken) {

        return res.redirect("/login");
    }

    axios.put("http://api_gfich:3000/api/users/newpass", req.query,{
        headers: {
            authorization: "Bearer " + jwtToken
        }
    })
        .then(r => {

            axios.get("http://api_gfich:3000/api/users", {
                headers: {
                    authorization: "Bearer " + jwtToken
                }
            })
                .then(r2 => {

                    return res.render("userPage", {user: r2.data, changePass: r.data.acknowledged});
                })
                .catch(erro2 => {

                    return res.redirect("/login");
                })
        })

        .catch(erro => {

            return res.render("error", {error: erro});
        })
});

router.get("/delete", function(req,res) {

    var jwtToken = req.cookies.jwt;

    if (!jwtToken) {

        return res.redirect("/login");
    }

    axios.get("http://api_gfich:3000/api/users", {
        headers: {
            authorization: "Bearer " + jwtToken
        }
    })
        .then(r => {

            var user = r.data;

            if (req.query.password == user.password) {

                axios.delete("http://api_gfich:3000/api/users/" + user.username, {
                    headers: {
                        authorization: "Bearer " + jwtToken
                    }
                })
                    .then(r2 => {

                        return res.redirect("/");
                    })
                    .catch(erro2 => {
                        return res.render("error", {error: erro2});
                    }) 
            }

            else {

                return res.render("userPage", {user: r.data, errorDeleting: "Password incorreta"});
            }
        })
        .catch(erro => {

            return res.render("error", {error: erro});
        })
})

module.exports = router;