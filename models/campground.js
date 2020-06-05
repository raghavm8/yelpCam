var mongoose = require('mongoose');
var cgShchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
var Campground = mongoose.model('Campground',cgShchema);

module.exports = Campground