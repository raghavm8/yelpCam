var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var PORT = 4000;
var Campground = require('./models/campground');
//var seed = require('./seeds');
var Comment = require('./models/comment')
var passport = require('passport');
var localStrategy = require('passport-local');
var user = require('./models/user');
var expressSession = require('express-session');
var campRoutes = require('./routes/camp');
var commentRoutes = require('./routes/comment');
var authRoutes = require('./routes/auth');
var methodOverride = require('method-override');
var flash = require('connect-flash');

//seed();
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/yelp",{useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

/*app.use(function(req,res,next){
    console.log(req.user)
    res.locals.currUser = req.user;
    next(); 
})*/

// passport configuration 
app.use(expressSession({
    secret:'avengers assemble',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser()); 
passport.deserializeUser(user.deserializeUser());

app.use(campRoutes);
app.use(authRoutes);
app.use(commentRoutes);

app.listen(PORT, () => {
    console.log('server has started');
})