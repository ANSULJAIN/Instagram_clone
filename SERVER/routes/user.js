const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const middleware = require('../middleware/requreLogin');
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:id', middleware, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .then(posts => {
                    res.json({ user, posts }); // Sending user and posts
                })
                .catch(err => {
                    res.status(404).json({ error: err });
                });
        })
        .catch(err => {
            return res.status(404).json({ error: err });
        });
});
router.put('/follow', middleware, async (req, res) => {
    try {
        // Update the followers array of the user being followed
        const followedUser = await User.findByIdAndUpdate(
            req.body.followId,
            {
                $push: { followers: req.user._id }
            },
            { new: true }
        );

        if (!followedUser) {
            return res.status(422).json({ error: "User not found" });
        }

        // Update the following array of the logged-in user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $push: { following: req.body.followId }
            },
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});




router.put('/unfollow',middleware, async (req, res) => {
    try {
        // Update the followers array of the user being unfollowed
        const unfollowedUser = await User.findByIdAndUpdate(
            req.body.unfollowId,
            {
                $pull: { followers: req.user._id }
            },
            { new: true }
        );

        if (!unfollowedUser) {
            return res.status(422).json({ error: "User not found" });
        }

        // Update the following array of the logged-in user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { following: req.body.unfollowId }
            },
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});
router.put('/updatepic', middleware, (req, res) => {
    User.findByIdAndUpdate(
        req.user._id, 
        { $set: { pic: req.body.pic } }, 
        { new: true }
    )
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });
});




module.exports = router;
