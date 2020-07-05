var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User" // it refers to the model which we will refer with this id
        },
        username: String
    }

});
 
module.exports = mongoose.model("Comment", commentSchema);