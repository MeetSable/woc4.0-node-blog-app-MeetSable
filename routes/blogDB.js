const express = require('express');

const recordRoutes = express.Router();

const dbo = require('../db/conn');

const ObjectId = require('mongodb').ObjectId;


recordRoutes.route('/blogs').get(function (req, res){
    let db_connect = dbo.getDb();
    db_connect
        .collection('blogAppData')
        .find({})
        .toArray(function(err, result){
            if(err) throw err;
            res.json(result);
        });
});

recordRoutes.route('/blogs/:username').get(function(req, res){
    let db_connect = dbo.getDb();
    db_connect
        .collection('blogAppData')
        .find({username : ObjectId(username)})
        .toArray(function(err, result){
            if(err) throw err;
            res.json(result);
        })
});

recordRoutes.route('/addBlog').post(function(req,response){
    let db_connect = dbo.getDb();
    let newObj = {
        name : req.body.name,
        blog : req.body.blog,
    };
    db_connect
        .collection('blogAppData')
        .insertOne(newObj, function(err, res){
            if (err) throw err;
            response.json(res);
        })
});

recordRoutes.route('/addUser').post(function(req,res){
    let db_connect = dbo.getDb();
    let newObj = {
        username : req.body.name,
        passwd : req.body.passwd
    };
    db_connect
        .collection('users')
        .insertOne(newObj, function(err, res){
            if (err) throw err;
            res.json(res);
        })
})


module.exports = recordRoutes;