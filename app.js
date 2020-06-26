var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var PORT = 4000;
var Campground = require('./models/campground');
var seed = require('./seeds');
var Comment = require('./models/comment')
var passport = require('passport');
var localStrategy = require('passport-local');
var user = require('./models/user');
var expressSession = require('express-session');

seed();
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/yelp",{useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

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

app.get('/',function(req,res){
    res.render('landing',{currUser:req.user})
    console.log('landing route')
}); 


// index rouute which shows all the data
app.get('/campground',function(req,res){
    Campground.find({},(err,all)=>{
        if(err){
            console.log(err);
        }
        else{
             res.render('campgrounds/index',{campground : all,currUser:req.user})
        }
    })
})

// create route to create a new data
app.post('/campground',function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCamp = {name:name , image:image, description:desc}
    Campground.create(newCamp,(err,newCreate)=>{
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/campground');
        }
    })
})

// new route to get the form for creating new data
app.get('/campground/new',function(req,res){
     res.render('campgrounds/new',{currUser:req.user});
})

// show route to get a particular data in detail
app.get('/campground/:id',function(req,res){
    var i = req.params.id
    Campground.findById(i).populate("comments").exec(function(err,found){
        if(err){
            console.log(err)
        }else{
            //console.log(found)
            res.render('campgrounds/show',{campground:found,currUser:req.user})
        }
    })
})

// this is the comments form 
app.get('/campground/:id/comments/new',isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,cg){
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('comments/new',{campground:cg,currUser:req.user})
        }
    })
})

app.post("/campground/:id/comments",isLoggedIn,function(req,res){
    // look campground using id
    Campground.findById(req.params.id,function(err,cg){
        if(err)
        {
            console.log(err)
            res.redirect('/campgrounds')
        }
        else
        {
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    cg.comments.push(comment)
                    cg.save()

                    res.redirect('/campground/' + cg._id);
                }
            })
        }
    })
})

//Auth Routes

// show register form 
app.get('/register',function(req,res){
    res.render('register',{currUser:req.user});
})

// handle sign up
app.post('/register',function(req,res){
    var newUser = new user({username:req.body.username})
    user.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register',{currUser:req.user})
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/campground')    
            })
        }
    })
})

// login
app.get('/login',function(req,res){
    res.render('login',{currUser:req.user});
})
// app.post(link,middleware,callback)
app.post('/login',passport.authenticate('local',
{
    successRedirect: '/campground',
    failureRedirect: '/login'
}), function(req,res){
    
})

// logout
app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/campground');
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else
    {
        res.redirect('/login')
    }
}

app.listen(PORT, () => {
    console.log('server has started');
})