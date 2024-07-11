const mongoose = require('mongoose')
const { text } = require('stream/consumers')
const {ObjectId} = mongoose.Schema.Types
const User = mongoose.model('User')
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String ,
        required:true 
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type: mongoose.Schema.Types.ObjectId,ref:"User"}],
    comments:[{text:String,postedBy: { type: ObjectId, ref: "User" }}],
    postedBy:{ type: mongoose.Schema.Types.ObjectId, ref:"User" } 
})

mongoose.model("Post",postSchema)