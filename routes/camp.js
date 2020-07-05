var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

router.get('/campground',function(req,res){
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
router.post('/campground',middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCamp = {name:name , image:image, description:desc,author:author}
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
router.get('/campground/new',middleware.isLoggedIn,function(req,res){
     res.render('campgrounds/new',{currUser:req.user});
})

// show route to get a particular data in detail
router.get('/campground/:id',function(req,res){
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

// edit route = it is for getting the update form
router.get('/campground/:id/edit',middleware.isOwned,function(req,res){
   
        Campground.findById(req.params.id,function(err,found){
            if(err)
            {
                console.log(err);
            }
            else{
               // console.log('RAghav 2')
                    res.render('campgrounds/edit',{campground:found,currUser:req.user});
            }
        }) 
    })  

// update route = it is for saving the updates made 
router.put('/campground/:id',middleware.isOwned,function(req,res){
    // find and update the correct camp
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updated){
        if(err){
            res.redirect('/campground');
        }
        else{
            res.redirect('/campground/' + req.params.id);
        }
    })
    // redirect somewhere 
})

// Delete route
router.delete('/campground/:id',middleware.isOwned,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err,deleted){
        if(err){
            res.redirect('/campground')
        }  
        else
        {
            res.redirect('/campground')
        }
    })
})

//middleware
/*function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else
    {
        res.redirect('/login')
    }
}*/

/*function isOwned (req,res,next)
{
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
}*/

module.exports = router;