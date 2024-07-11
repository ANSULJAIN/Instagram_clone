const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { text } = require('stream/consumers')
// const User = mongoose.model('User')

const userSchema = new mongoose.Schema({
    nameusers: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic:{
        type:String,
        default:"data:image/jpeg;base64,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"
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],


})

mongoose.model("User", userSchema);