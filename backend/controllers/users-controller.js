const HttpError=require('../models/http-error');

const { v4: uuidv4 } = require('uuid');

let DUMMY_USERS=[
    {
        id:'u1',
        title:'Kshitiz',
        description:'test@gmail.com',
        password:"testing"
    }
]


const getAllUsers=(req,res,next)=>{
    res.json({users:DUMMY_USERS});
}

const signup=(req,res,next)=>{
    const {name,email, password}=req.body;

    const hasUser=DUMMY_USERS.find(u=>u.email===email)

    if (hasUser){
        throw new Error("User Already exists",422);
    }
    const createdUser={
        id:uuidv4(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser)
    res.status(201).json({user:createdUser});
}

const login=(req,res,next)=>{
    const {email,password}=req.body;

    const identifiedUser=DUMMY_USERS.find(u=>u.email===email);
    if(!identifiedUser || identifiedUser.password!==password){
        throw new Error("Could not verify the user. Wrong credentials.Please try again.",401);
    }

    res.json({message:"Logged in"})

}


exports.getAllUsers=getAllUsers;
exports.signup=signup;
exports.login=login;

