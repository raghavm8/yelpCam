var express = require('express');
var router = express.Router({mergeParams:true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware')

// comments new 
router.get('/campground/:id/comments/new',middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,cg){
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('comments/new',{campground:cg,currUser:req.user,error:req.flash("error"),success:req.flash('success')})
        }
    })
})

// comments create 
router.post("/campground/:id/comments",middleware.isLoggedIn,function(req,res){
    // look campground using id
    Campground.findById(req.params.id,function(err,cg){
        if(err)
        {
            console.log(err)
            req.flash('error',"Operation failed");
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
                    // add username and id of the user
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save();
                    cg.comments.push(comment)
                    cg.save()
                    req.flash('success',"Successfully Added your comment!!!!");
                    res.redirect('/campground/' + cg._id);
                }
            })
        }
    })
})

// edit route for comments 
router.get('/campground/:id/comments/:comment_id/edit',middleware.checkComment,function(req,res){
    Comment.findById(req.params.comment_id,function(err,found){
        if(err){
            res.redirect('back');
        }
        else{
            res.render('comments/edit',{campground_id : req.params.id,currUser:req.user,comment:found,error:req.flash("error"),success:req.flash('success')});
        }
    })   
})

// Update route
router.put('/campground/:id/comments/:comment_id',middleware.checkComment,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updated){
        if(err){
            req.flash('error',"Operation failed");
            res.redirect('back');
        }
        else{
            req.flash('success',"Comment Updated !!!!");
            res.redirect('/campground/'+req.params.id);  
        }
    })
})

// Delete route
router.delete('/campground/:id/comments/:comment_id',middleware.checkComment,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err,deleted){
        if(err){
            req.flash('error',"Operation failed");
            res.redirect('back');
        }
        else{
            req.flash('success',"Comment Deleted !!!!");
            res.redirect('/campground/'+req.params.id);  
        }
    })
})

module.exports = router;
