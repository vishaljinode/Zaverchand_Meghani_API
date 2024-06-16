const mongoose = require("mongoose")



const booksSchema = mongoose.Schema({
    bookName : {type : String, index : true },
    title: {type : String ,  index : true},
    description:  {type : String},
    author:  {type : String},
    titleIndex : {type : Number},    
    status :{type : String,default : "Active"},
    bookImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Image'}
},{timestamps : true})


const storySchema = mongoose.Schema({
    bookId : { type : mongoose.Schema.Types.ObjectId, ref : 'Book'},
    title: {type : String ,  index : true},
    description:  {type : String},   
    titleIndex : {type : Number},    
    status :{type : String,default : "Active"},   
},{timestamps : true})



const imageSchema = new mongoose.Schema({
    mediaUrl : String,
    mediaType : String,
    bookId : { type : mongoose.Schema.Types.ObjectId, ref : 'Book'},
    status: {type:String, default:"Active"},
},{timestamps : true});



module.exports.book = mongoose.model("Book",booksSchema);
module.exports.image = mongoose.model("Image",imageSchema);
module.exports.story = mongoose.model("Story",storySchema);