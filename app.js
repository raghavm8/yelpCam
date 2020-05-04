var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost/yelp",{useNewUrlParser: true, useUnifiedTopology: true});

var cgShchema = new mongoose.Schema({
    name: String,
    image: String
});
var Campground = mongoose.model('Campground',cgShchema);

/*Campground.create({
    name : "two",
     image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkNrnxCrnSYzkYakAertDUA0-niLEM5GoAvoTpmMaJ8sEW2mT2mg&s"
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

app.get('/campground',function(req,res){
    Campground.find({},(err,all)=>{
        if(err){
            console.log(err);
        }
        else{
             res.render('campground',{campground : all})
        }
    })
})

app.post('/campground',function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = {name:name , image:image}
    Campground.create(newCamp,(err,newCreate)=>{
        res.redirect('/campground');
    })
})

app.get('/campground/new',function(req,res){
    res.render('new');
})

app.listen(PORT, () => {
    console.log('server has started');
})