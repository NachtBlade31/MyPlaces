const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
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
        console.log("here")

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

    let hashedPassword;
    try{
        hashedPassword=await bcrypt.hash(password,12);
    }
    catch(err){
         return next(new HttpError("Could not create the user. Please try again.",500)) ;
    }
    
    
    const createdUser=new User({
        name,
        email,
        image:req.file.path,
        password:hashedPassword,
        places:[]
    });

    try{
        await createdUser.save();
    }

    catch(err){
        const error=new HttpError("Sign up failed,please try again",500);
        return next(error);
    }

    let token;
    try{
        token=jwt.sign({userId:createdUser.id,email:createdUser.email},process.env.JWT_KEY,{expiresIn:'1d'})
    }
    catch(err){
        const error=new HttpError("Sign up failed,please try again",500);
        return next(error);
    }
    
    res.status(201).json({userId:createdUser.id,email:createdUser.email,token:token});
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
    if(!existingUser){
        const error=new HttpError("Invalid user. Could not log you in.",403)
        return next(error);
    }
    let isValidPassword=false
    try{
        isValidPassword=await bcrypt.compare(password,existingUser.password);
    }
    catch(err){
        console.log(err)
        return next(new HttpError("Login failed. please try again later",500)) ;
    }

    if(!isValidPassword){
        const error=new HttpError("Invalid user. Could not log you in.",403)
        return next(error);

    }

    let token;
    try{
        token=jwt.sign({userId:existingUser.id,email:existingUser.email},process.env.JWT_KEY,{expiresIn:'1d'})
    }
    catch(err){
        const error=new HttpError("Sign in failed,please try again",500);
        return next(error);
    }
   

    res.json({userId:existingUser.id,email:existingUser.email,token:token})

}


exports.getAllUsers=getAllUsers;
exports.signup=signup;
exports.login=login;

