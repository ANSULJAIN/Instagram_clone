const express = require('express')
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT||5001;
app.use(express.json())

app.use(cors());


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
app.use(require('./routes/user'))

app.use(customMiddleware);
app.get('/',(req,res)=>{
   console.log("happ[")
   res.send("hallo")
});

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(PORT,()=>{
    console.log("enjoying this masterpiece in " + PORT)
})