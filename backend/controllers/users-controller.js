const HttpError=require('../models/http-error');
const {validationResult} =require('express-validator');

const { v4: uuidv4 } = require('uuid');
const User=require('../models/user');


const getAllUsers=async (req,res,next)=>{
    let users;
    try{
        users=await User.find({},'-password');
    }
    catch(err){
        const error=new HttpError("Fetching users failed.Please try again",500)
        return next(error);
    }
    res.json({users:users.map(user=>user.toObject({getters:true}))})
    
}

const signup=async (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);

        return next( new HttpError('Invalid input passed, please check your data.',422))
    }

    const {name,email, password}=req.body;

    let existingUser;
    try{
        existingUser=await User.findOne({email:email})
    }
    catch(err){
        return next(new HttpError("Signing up failed. please try again later",500)) ;
    }
    if (existingUser){
        return next(new HttpError("User already exists. Please login instead.",422)) ;
    }
    
    const createdUser=new User({
        name,
        email,
        image:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Shaqi_jrvej.jpg/1200px-Shaqi_jrvej.jpg",
        password,
        places:[]
    });

    try{
        await createdUser.save();
    }

    catch(err){
        const error=new HttpError("Sign up failed,please try again",500);
        return next(error);
    }
    res.status(201).json({user:createdUser.toObject({getters:true})});
}

const login=async (req,res,next)=>{
    const {email,password}=req.body;

    let existingUser;
    try{
        existingUser=await User.findOne({email:email})
    }
    catch(err){
        return next(new HttpError("Login failed. please try again later",500)) ;
    }
    if(!existingUser|| existingUser.password!==password){
        const error=new HttpError("Invalid user. Could not log you in.",401)
        return next(error);
    }
    res.json({message:"Logged in",user:existingUser.toObject({getters:true})})

}


exports.getAllUsers=getAllUsers;
exports.signup=signup;
exports.login=login;

