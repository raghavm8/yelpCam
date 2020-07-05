var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// root route
router.get('/',function(req,res){
    res.render('landing',{currUser:req.user})
    console.log('landing route')
}); 

// register form route 
router.get('/register',function(req,res){
    res.render('register',{currUser:req.user});
})

// handle sign up route
router.post('/register',function(req,res){
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

// login route 
router.get('/login',function(req,res){
    res.render('login',{currUser:req.user, message : req.flash("error")} );
})
 
// router.post(link,middleware,callback)
router.post('/login',passport.authenticate('local',
{
    successRedirect: '/campground',
    failureRedirect: '/login'
}), function(req,res){
    
})

// logout route 
router.get('/logout',function(req,res){
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

module.exports = router;