if (process.env.NODE_ENV !== "production") {require('dotenv').config();}

//Libraries
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const http = require('http').createServer(app);
const favicon = require('serve-favicon');

//Access gallery, request and tutorial routes
const indexRoutes = require('./routes/index');
const requestRoutes = require('./routes/requests');
const galleryRoutes = require('./routes/gallery');
const tutorialRoutes = require('./routes/tutorial');

//Connect to database
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//Set up libraries
app.use(favicon(__dirname + '/public/media/favicon.ico'));
app.use(express.static(__dirname + "/public")); //Sets all styles/js/media to /public
app.use(bodyParser.urlencoded({extended: true})); //Allows us to read info from EJS pages
app.set('view engine', "ejs"); //Sets view engine to EJS
app.use(methodOverride('_method')); //Allows us to use PUT and DELETE
app.use(flash()); //Flash messages to the screen

//Session middleware
app.use(session({
  cookie: {maxAge: 86400000},
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => { //Setting up flash messages
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//Import other route files
app.use('/', indexRoutes);
app.use('/request', requestRoutes);
app.use('/gallery', galleryRoutes);
app.use('/tutorial', tutorialRoutes);
app.get('*', (req, res) => {res.redirect('/');});

//Runs server
let port = process.env.PORT || 8000;

http.listen(port, process.env.IP, () => {
	console.log(":: App listening on port " + port + " ::");
});
