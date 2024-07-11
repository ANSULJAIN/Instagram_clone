const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} =require("../config/keys")

const requireLogin = require('../middleware/requreLogin')

router.get('/protected',async(req,res)=>{
    try {
        const users = await User.find();
        console.log(users);
    } catch (err) {
        console.error(err);
    }
    res.send("hallo user")
})
router.post('/signup', (req, res) => {
    const { nameusers, email, password,pic } = req.body;

    if (!email || !password || !nameusers) {
        return res.status(422).json({ error: "please add all the fields" });
    }

    User.findOne({ email: email })
        .then((saveUser) => {
            if (saveUser) {
                return res.status(422).json({ error: "user already exists with that email" });
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        nameusers,
                        pic:pic
                    });

                    // Save the user to the database
                    user.save()
                        .then(user => {
                            res.json({ message: "user saved successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: "internal server error" });
                        });
                })
            // Create a new User instance

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "internal server error" });
        });
});
router.post('/singin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "please add all the details" })
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "invalid email or password" })
            }
            console.log(savedUser._Id);
            bcrypt.compare(password, savedUser.password)
                .then((doMatch) => {
                    if (doMatch) { const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                        const {_id,nameusers,email,followers,following,pic}=savedUser;

                res.json({token,user:{_id,nameusers,email,followers,following,pic}}) }
                    else {
                        res.status(422).json({ error: "invalid password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

module.exports = router;
