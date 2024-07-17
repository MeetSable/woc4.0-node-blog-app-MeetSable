const express = require('express');
const dbo = require('../db/conn');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/banners')
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
    }
});
const upload = multer({storage: storage});


const createBlogRouter = express.Router();

createBlogRouter.get('/',function(req,res){
        res.render('createBlog', {loggedin : req.session.loggedin, username : req.session.username});
    });
createBlogRouter.post('/', upload.single('bannerImage'),function(req,res){
        let db_connect = dbo.getDb();
        var today = new Date();
        var date = 
            String(today.getDate()).padStart(2, '0') + '/' +
            String(today.getMonth()+1).padStart(2, '0') + '/' +
            String(today.getFullYear());
        var newObj;
        if (req.body.bannerFlag == 'checked'){
            newObj = {
                title : req.body.title,
                authorName : req.session.username,
                blogText : req.body.blogText,
                blogGist : req.body.gistOfBlog,
                banner : req.file.filename,
                createdOn : date,
            };
        }else{
            newObj = {
                title : req.body.title,
                authorName : req.session.username,
                blogText : req.body.blogText,
                blogGist : req.body.gistOfBlog,
                banner : 'default_banner.jpg',
                createdOn : date,
            };
        }
        db_connect
            .collection('blogAppData')
            .insertOne(newObj, function(err,response){
                if(err) throw err;
                console.log(response);
                res.redirect('/');
            });
    })

module.exports = createBlogRouter;