const jwt=require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports=(req,res,next)=>{
    if(req.method==='OPTIONS'){
        return next();
    }

    try{
        const token=req.headers.authorization.split(' ')[1];// Authorisation:'Bearer Token'
        if(!token){
            throw new Error("Authoirsation failed");
        } 
        const decodedToken=jwt.verify(token,"Super Secret. Dont Share")
        req.userData={userId:decodedToken.userId}
        next();


    }
    catch(err){
        return (next( new HttpError("Authorisation Failed",403)))
    }
    
  


}