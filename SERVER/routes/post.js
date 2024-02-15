const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const middleware = require('../middleware/requreLogin')
const Post = mongoose.model('Post')


router.get('/allpost',(req,res)=>{
    Post.find()
    .populate('postedBy','_id nameusers')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router('/mypost',middleware,(req,res)=>{
    const username = 
    Post.find({postedBy:req.user._id})
    .populate('postedBy','_id nameusers')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        res.json({err})
    })
})
router.post('/createpost',middleware,(req,res)=>{
    const {title,body} = req.body ;
    if(!title || !body){
        res.json({error:"please fill all the input"})
    }
console.log(req.user)
    const post = new Post({
        title,
        body,
        postedBy:req.user,
    })

    post.save().then(result=>{
        res.json({post:result})
    })
})



module.exports = router ;