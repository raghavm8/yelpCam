var mongoose = require('mongoose');
var cgShchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User" // it refers to the model which we will refer with this id
        },
        username : String
    },
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
var Campground = mongoose.model('Campground',cgShchema);

module.exports = Campground