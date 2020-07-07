var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');


// root route
router.get('/',function(req,res){
    res.render('landing',{currUser:req.user,error:req.flash("error"),success:req.flash('success') })
    console.log('landing route')
}); 

// register form route 
router.get('/register',function(req,res){
    res.render('register',{currUser:req.user,error:req.flash("error"),success:req.flash('success')});
})

// handle sign up route
router.post('/register',function(req,res){
    var newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            //console.log(err);
            req.flash('error',err.message);
            return res.render('register',{currUser:req.user,error:req.flash("error"),success:req.flash('success')})
        }
        else{  
            passport.authenticate("local")(req,res,function(){
                req.flash('success',"Welcome " + user.username);
                res.redirect('/campground')    
            })
        }
    })
})

// login route 
router.get('/login',function(req,res){
   // req.flash('error',"Operation failed");
    res.render('login',{currUser:req.user,error:req.flash("error"),success:req.flash('success')} );
   // req.flash('error',"Operation failed");
})
 
// router.post(link,middleware,callback)
router.post('/login',passport.authenticate('local',
{
    successRedirect: '/campground',
    failureRedirect: '/login'
}), function(req,res){
    req.flash('success','')
})

// logout route 
router.get('/logout',function(req,res){
    req.logout();
    req.flash('success','Logged you out');
    res.redirect('/campground');
})



module.exports = router;