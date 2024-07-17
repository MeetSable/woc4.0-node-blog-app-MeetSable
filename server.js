const express = require("express");
const session = require('express-session');
var bodyparser = require('body-parser')


const app = express();
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

const helmet = require("helmet")

app.set('view engine', 'pug');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use('/', express.static('public'));
// app.use(helmet.frameguard({ action: 'sameorigin' }));

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.use('/api',require("./routes/blogDB"));
app.use('/', require('./routes/index'));
app.use('/add', require('./routes/createBlog'));
app.use('/register', require('./routes/register'));
app.use('/myBlog', require('./routes/myBlog'));
app.get('/logout', function(req,res){
  req.session.loggedin = false;
  req.session.username = null;
  res.redirect('/');
});

app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// get driver connectio
const dbo = require("./db/conn");
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err); 
  });
  console.log(`Server is running on:  http://localhost:${port}`);
});