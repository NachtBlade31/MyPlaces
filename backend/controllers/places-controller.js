const { v4: uuidv4 } = require('uuid');
const {validationResult} =require('express-validator');

const HttpError=require('../models/http-error');
const getCoordsForAddress =require('../utils/location');
const Place=require('../models/place');

const getPlaceById= async (req,res,next)=>{
    const placeId=req.params.pid
    let place;
    try{
        place=await Place.findById(placeId);
    }
    catch(err){
        const error=new HttpError("Something went wrong.Could not find a place",500);
        return next(error);
    }
    
    if(!place){

        const error= new HttpError("Could not find a place for the provided id",404);
        return next(error);
    }
    res.json({place:place.toObject({getters:true}) });

}

const getPlacesByUserId= async (req,res,next)=>{
    const userId=req.params.uid;
    let users;
    try{
         users=await Place.find({creator:userId}); 
    }
    catch(err){
        const error=new HttpError("Something went wrong.Could not find a place",500);
        return next(error);
    }
    
    if(!users|| users.length===0){

        return next(new HttpError("Could not find a places for the provided user id",404)) ;
    }
    
    res.json({places:users.map(place=>place.toObject({getters:true}))});
}

const createPlace= async (req,res,next)=>{

    const errors=validationResult(req);
    let coordinates;
    if(!errors.isEmpty()){
       return next (new HttpError('Invalid input passed, please check your data.',422))
    }
    const {title,description,address,creator}=req.body;

    try{
        coordinates=await getCoordsForAddress(address)
    }
    catch(error){
       return next(error);
    }
    
    const createdPlace=new Place({
        title,
        address,
        description,
        location:coordinates,
        image:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fnature%2F&psig=AOvVaw1rXNR0ystpHU3XiF8zJLEi&ust=1613761060815000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJiArMiO9O4CFQAAAAAdAAAAABAD",
        creator
    });

    try{
        await createdPlace.save();
    }
    catch(err){
        const error=new HttpError("Creating place failed,please try again",500);
        return next(error);
    }
    
    res.status(201).json({createdPlace});
}

const UpdatePlaceById=async (req,res,next)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        
        throw new HttpError('Invalid input passed, please check your data.',422)
    }

    const placeId=req.params.pid;
    const {title,description}=req.body;

    let place;

    try{
        place=await Place.findById(placeId);
    }
    catch(err){
        return next(new HttpError("Something went wrong. Could not update the place. Please try again",500)) ;
    }
    place.title=title;
    place.description=description;

    try{
        await place.save();
    }
    catch(err){
        return next(new HttpError("Something went wrong. Could not update the place. Please try again",500)) ;
    }


    res.status(200).json({place:place.toObject({getters:true})});


}

const deletePlaceById=async (req,res,next)=>{
    const placeId=req.params.pid;
    let place;
    try{
        place=await Place.findById(placeId);
    }
    catch(err){
        return next(new HttpError("Something went wrong. Could not Delete the place. Please try again",500)) ;
    }

    try{
        await place.remove();
    }
    catch(err){
        return next(new HttpError("Something went wrong. Could not Delete the place. Please try again",500)) ;
    }

    res.status(200).json({message:"Deleted Place."});

}

exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.UpdatePlaceById=UpdatePlaceById;
exports.deletePlaceById=deletePlaceById;