const express = require('express');
const dbo = require('../db/conn');
const ObjectId = require('mongodb').ObjectId;
const registerRouter = express.Router();

registerRouter.get('/', function(req,res){
    res.render('register');
});

registerRouter.post('/',function(req, res){
    let db_connect = dbo.getDb();
    db_connect.collection("users").findOne({username: req.body.username}, function(err, result) {
        if(err) throw err;
        if(result != null)
        {
            if(req.body.newUser == 'on'){
                res.send("<script>alert('Username already exists!!'); window.location.href='/register'</script>");
                res.end();
            } else if(result.passwd == req.body.passwd){
                req.session.loggedin = true;
                req.session.username = req.body.username;
                res.redirect('/');
            } else {
                res.send("<script>alert('Incorrect password or username!'); window.location.href='/register'</script>");
                res.end();
            }
        } else {
            if (req.body.newUser == 'on')
            {
                let db_connect = dbo.getDb();
                let newObj = {
                    username : req.body.username,
                    passwd : req.body.passwd
                }
                db_connect
                    .collection('users')
                    .insertOne(newObj, function(err, response){
                        if(err) throw err;
                        console.log(response);
                        req.session.loggedin = true;
                        req.session.username = req.body.username;
                        res.redirect('/');
                    })

            }
            else
            {
                res.send("<script>alert('Incorrect password or username!'); window.location.href='/register'</script>");
                res.end();
            }
        }
        // res.redirect("/");
    });
})

module.exports = registerRouter;