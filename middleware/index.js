// all the middle wares go here
var middleWare = {};
var Comment = require('../models/comment');
var Campground = require('../models/campground');

middleWare.isOwned = function(req,res,next){
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,function(err,found){
            if(err)
            {
                req.flash('error','Campground not found !!!!');
                res.redirect("back");
                console.log(err);
            }
            else{
               // console.log('RAghav 2')
               if(found.author.id.equals(req.user.id))
                    next();
                else{
                    req.flash('error','Not permitted !!!!');
                   res.redirect("back")
                }
            }
        }) 
    }
    else{
        req.flash('error',"You need to be logged in !!!!")
       res.redirect("back");
    }
}

middleWare.checkComment = function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id,function(err,found){
            if(err)
            {
                req.flash('error',"Operation failed");
                res.send("back");
                console.log(err);
            }
            else{
               // console.log('RAghav 2')
               if(found.author.id.equals(req.user.id))
                    next();
                else{
                    req.flash('error',"You are not permitted !!!!");
                   res.redirect("back")
                }
            }
        }) 
    }
    else{
        req.flash('error',"you need to be logged in !!!!");
       res.redirect("back");
    }
}

middleWare.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else
    {
        req.flash('error','Please login first !!!!')
        res.redirect('/login')
    }
}

module.exports = middleWare