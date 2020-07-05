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
                res.send("back");
                console.log(err);
            }
            else{
               // console.log('RAghav 2')
               if(found.author.id.equals(req.user.id))
                    next();
                else{
                   res.redirect("back")
                }
            }
        }) 
    }
    else{
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
                res.send("back");
                console.log(err);
            }
            else{
               // console.log('RAghav 2')
               if(found.author.id.equals(req.user.id))
                    next();
                else{
                   res.redirect("back")
                }
            }
        }) 
    }
    else{
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