var express = require('express');
var app = express();
var PORT = 4000;

app.set('view engine','ejs');

app.get('/',function(req,res){
    res.render('landing')
    console.log('landing route')
});

app.get('/campground',function(req,res){
    var campground = [
        {name : "one", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkNrnxCrnSYzkYakAertDUA0-niLEM5GoAvoTpmMaJ8sEW2mT2mg&s"},
        {name : "two", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkNrnxCrnSYzkYakAertDUA0-niLEM5GoAvoTpmMaJ8sEW2mT2mg&s"},
        {name : "three", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkNrnxCrnSYzkYakAertDUA0-niLEM5GoAvoTpmMaJ8sEW2mT2mg&s"},
        {name : "four", image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkNrnxCrnSYzkYakAertDUA0-niLEM5GoAvoTpmMaJ8sEW2mT2mg&s"}
    ]
    res.render('campground',{campground : campground})
    console.log('campGround route')
})

app.listen(PORT, () => {
    console.log('server has started');
})