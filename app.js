var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost/yelp",{useNewUrlParser: true, useUnifiedTopology: true});

var cgShchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model('Campground',cgShchema);

/*Campground.create({
    name : "four",
     image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkNrnxCrnSYzkYakAertDUA0-niLEM5GoAvoTpmMaJ8sEW2mT2mg&s",
     description: 'this is a new campground'
},(err,campground)=>{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log('data added');
        console.log(campground);
    }
})*/

app.set('view engine','ejs');

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
             res.render('index',{campground : all})
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
     res.render('new');
})

// show route to get a particular data in detail
app.get('/campground/:id',function(req,res){
    var i = req.params.id
    Campground.findById(i,function(err,found){
        if(err){
            console.log(err)
        }else{
            res.render('show',{campground:found})
        }
    })
})



app.listen(PORT, () => {
    console.log('server has started');
})