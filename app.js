//jshint esversion:6
const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
require('dotenv').config()

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(body_parser.urlencoded({
    extended: true
}))


//-------------------------------------- mongodb connection---------------------------------//
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true}).then(()=>{
    console.log("connected to mongodb successfully");
    
}).catch((err)=>{
    console.log("error in connection",err);
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]}) //encryption

// value of SECRET is in .env file which is local 
// we cannot commit .env file because it has our key value so we ignore it using git ignore

const users = mongoose.model("users",userSchema);

app.post('/register',function(req,res){
   const newUser = new users({
    email:req.body.email,
    password:req.body.password
   })
   newUser.save().then(()=>{
    res.render("secrets");
   }).catch((err)=>{
    console.log("erorr");
   })
})

app.post('/login',function(req,res){
    const useremail = req.body.email;
    const userpassword = req.body.password;

    users.findOne({email:useremail}).then((foundUser)=>{
        if(foundUser){
            if(foundUser.password == userpassword)
            {
                res.render("secrets");
            }
            else
            {
                res.send("incorrect password")
            }
        }
        else
        {
            res.send("user not found");
        }
    }) 
})

app.get("/",function(req,res){
    res.render("home.ejs");
})

app.get("/login",function(req,res){
    res.render("login.ejs");
})

app.get("/register",function(req,res){
    res.render("register.ejs");
})







app.listen(3000,function(req,res){
    console.log("Server is running on port 3000");
})