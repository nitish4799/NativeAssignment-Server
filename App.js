const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('./UserDetails'); 
const bcrypt = require('bcrypt');
app.use(express.json());

const mongoURL = "mongodb+srv://nitish12015121:lqbFDmlwXkdGLWfo@cluster0.5g3nygp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose
    .connect(mongoURL)
    .then(() =>{
        console.log("db connected")
    })
    .catch((e) =>{
        console.log(e);
    });


app.get("/", (req, res) =>{
    res.send({status: "started"})
})

//lqbFDmlwXkdGLWfo

const User = mongoose.model("UserInfo");


app.post("/login" , async(req, res) =>{
    const {email , password} = req.body;
    console.log(req.body);

    const oldUser = await User.findOne({email: email});

    if ( !oldUser ){
        return res.send({ data: "User doesn't exist"});
    }
    else{
        const isPasswordValid = await bcrypt.compare(password, oldUser.password);
        if ( isPasswordValid ){
            res.send({status: "Login Successfull"});
        }
        else{
            res.send({status: "Incorrect Password"});
        }
    }
})

app.post("/signup", async(req, res) => {
    const {name , email, password} = req.body;

    console.log(req.body);
    const oldUser = await User.findOne({email: email});

    if ( oldUser){
        return res.send({status : "User already exist"});
    }
    const encryptedPassword = await bcrypt.hash(password , 10);
    try {
        await User.create({
            name, email, password: encryptedPassword,
        });
        res.send({ status: "ok", data: "User created"})
    } catch (error) {
        res.send({status: "error" , data: error})
    }
})

app.listen(5000, ()=>{
    console.log("Node js server started");
})