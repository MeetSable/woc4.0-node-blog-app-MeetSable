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
            res.render('index', {blogs : result});
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
                res.render('viewBlog',{blog : result});
            });
    }else{
        res.redirect('/404');
    }
});



module.exports = indexRoutes;