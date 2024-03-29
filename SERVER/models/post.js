const mongoose = require('mongoose')
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
        default:"no photo"
    },
    postedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
})

mongoose.model("Post",postSchema)