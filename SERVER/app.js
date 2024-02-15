const express = require('express')
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')
const app = express()
const PORT = 3000;
app.use(express.json())





mongoose.connect(MONGOURI)
const customMiddleware = (req,res,next)=>{
    console.log("middleware coustom");
    next();
}

mongoose.connection.on('connected',()=>{
    console.log("connected to mongo yeahh")
})
mongoose.connection.on('err',()=>{
    console.log("error connecting",err)
})

require('./models/user')
require('./models/post')
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.use(customMiddleware);
app.get('/',(req,res)=>{
    res.send("halow world")
});

app.listen(PORT,()=>{
    console.log("enjoying this masterpiece in " + PORT)
})