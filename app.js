var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var PORT = 4000;
var Campground = require('./models/campground');
var seed = require('./seeds');
var Comment = require('./models/comment')

seed();
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost/yelp",{useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
    res.render('landing')
    console.log('landing route')
}); 

// index rouute which shows all the data
app.get('/campground',function(req,res){
    Campground.find({},(err,all)=>{
        if(err){
            console.log(err);
        }
        else{
             res.render('campgrounds/index',{campground : all})
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
     res.render('campgrounds/new');
})

// show route to get a particular data in detail
app.get('/campground/:id',function(req,res){
    var i = req.params.id
    Campground.findById(i).populate("comments").exec(function(err,found){
        if(err){
            console.log(err)
        }else{
            //console.log(found)
            res.render('campgrounds/show',{campground:found})
        }
    })
})

// this is the comments form 
app.get('/campground/:id/comments/new',function(req,res){
    Campground.findById(req.params.id,function(err,cg){
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render('comments/new',{campground:cg})
        }
    })
})

app.post("/campground/:id/comments",function(req,res){
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
    // create  a new comment

    // connect new comment to campground

    // redirect campground show page

})

app.listen(PORT, () => {
    console.log('server has started');
})