const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const middleware = require('../middleware/requreLogin');
const Post = mongoose.model('Post');

// Route to get all posts
router.get('/allpost', (req, res) => {
    Post.find()
        .populate('postedBy', '_id nameusers')
        .populate('comments.postedBy', '_id nameusers')
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching posts' });
        });
});
router.get('/getsubpost', middleware, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate('postedBy', '_id nameusers')
        .populate('comments.postedBy', '_id nameusers')
        .sort('-createdAt') // Sort posts by createdAt descending
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching posts' });
        });
});

// Route to get user's posts
router.get('/mypost', middleware, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate('postedBy', '_id nameusers')
        .populate('comments.postedBy', '_id nameusers') // Populate comments for mypost as well
        .then(posts => {
            res.json({ posts });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching your posts' });
        });
});

// Route to create a new post
router.post('/createpost', middleware, (req, res) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) {
        return res.status(400).json({ error: 'Please fill all the fields' });
    }

    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    });

    post.save()
        .then(result => {
            res.json({ post: result });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while creating the post' });
        });
});

// Route to like a post
router.put('/like', middleware, (req, res) => {
    const postId = req.body.postId;
    const userId = req.user._id;

    Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } }, // Ensure userId is ObjectId of the user
        { new: true }
    )
    .populate('postedBy', '_id nameusers')
    .populate('comments.postedBy', '_id nameusers') // Correct populate field

    .then(result => {
        if (!result) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(result);
    })
    .catch(err => {
        console.error('Error liking post:', err);
        res.status(422).json({ error: err.message });
    });
});

// Route to unlike a post
router.put('/unlike', middleware, (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.user._id } },
        { new: true }
    )
    .populate('postedBy', '_id nameusers')
    .populate('comments.postedBy', '_id nameusers') // Correct populate field

    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.error(err);
        res.status(422).json({ error: err.message });
    });
});

// Route to add a comment
router.put('/comment', middleware, (req, res) => {
    const postId = req.body.postId;
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    };

    Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true }
    )
    .populate('postedBy', '_id nameusers')
    .populate('comments.postedBy', '_id nameusers') // Correct populate field
     .then(result => {
        if (!result) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(result);
    })
    .catch(err => {
        console.error('Error commenting on post:', err);
        res.status(422).json({ error: err.message });
    });
});
router.delete('/deletepost/:postId', middleware, (req, res) => {
    Post.findOne({ _id:req.params.postId })
        .populate("postedBy", "_id")
        .then(result => {
            if (!result) {
                return res.status(404).json({ error: "Post not found" });
            }
            
            if (result.postedBy._id.toString() === req.user._id.toString()) {
                Post.deleteOne({ _id: req.params.postId })
                    .then(deletionResult => {
                        res.json({ message: "Successfully deleted", _id: req.params.postId });
                        
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err.message });
                    });
            } else {
                return res.status(401).json({ error: "You are not authorized to delete this post" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message });
        });
});
module.exports = router;
