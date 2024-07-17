const express = require('express');
const { ObjectId } = require('mongodb');
const dbo = require('../db/conn');

const indexRoutes = express.Router();

indexRoutes.route('/').get(function(req,res){
    let db_connect = dbo.getDb();
    db_connect
        .collection('blogAppData')
        .find({})
        .toArray(function(err,result){
            if (err) throw err;
            res.render('index', {
                blogs : result, 
                loggedin : req.session.loggedin, 
                username : req.session.username });
        });
});

indexRoutes.route('/blogs/:id').get(function(req,res){
    let id = req.params.id;
    if (ObjectId.isValid(id)){
        let db_connect = dbo.getDb();
        let blog = db_connect 
            .collection('blogAppData')
            .findOne({ _id : ObjectId(id)}, function(err,result){
                if (err) res.redirect('/404');
                res.render('viewBlog', {
                    blog : result, 
                    loggedin : req.session.loggedin,
                    username : req.session.username
                });
            });
    }else{
        res.redirect('/404');
    }
});

indexRoutes.route('/delete/:id').get(async function(req,res){
    try {
        let db_connect = dbo.getDb();
        // console.log(req.params.id, req.session.username);
        const deleteResult = await db_connect
            .collection('blogAppData')
            .deleteOne({_id : ObjectId(req.params.id), authorName : req.session.username})
        // console.log(deleteResult);
        if(deleteResult.deleteCount == 1)
        {
            
            res.send('<script>alert("blog deleted!!); window.href.location="/";</script>');
            // res.end();
        }
        res.redirect('/');
    } catch(err){
        console.error(err);
        res.redirect('/');
    } finally {
        res.end();
    }
})

indexRoutes.route('/deleteAcc').get(async function(req,res){
    try {
        let db_connect = dbo.getDb();   
        const deleteResult = await db_connect   
            .collection('users')
            .deleteOne({username: req.session.username});
        req.session.loggedin = false;
        req.session.username = null;
        // res.redirect('/');
        res.send(`<script>alert("User ${username} deleted!!"); window.href.location="/logout";</script>`);
        res.end();
    } catch(err) {
        console.error(err);
    } finally {
        res.redirect('/');
        res.end();
    }
})


module.exports = indexRoutes;