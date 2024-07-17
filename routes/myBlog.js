const express = require('express');
const { ObjectId } = require('mongodb');
const dbo = require('../db/conn');

const myBlogRoutes = express.Router();

myBlogRoutes.route('/').get(function(req,res){
    let db_connect = dbo.getDb();
    db_connect
        .collection('blogAppData')
        .find({authorName : req.session.username})
        .toArray(function(err, result){
            if(err) throw err;
            res.render('index', {blogs:result, loggedin:req.session.loggedin, username:req.session.username});
        });
});

myBlogRoutes.route('/blogs/:id').get(function(req,res){
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

module.exports = myBlogRoutes