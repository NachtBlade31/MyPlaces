const mongoose=require('mongoose');
const { v4: uuidv4 } = require('uuid');
const {validationResult} =require('express-validator');

const HttpError=require('../models/http-error');
const getCoordsForAddress =require('../utils/location');
const Place=require('../models/place');
const User=require('../models/user');

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

    let userWithPlaces;
    try{
         userWithPlaces=await User.findById(userId).populate('places')
    }
    catch(err){
        const error=new HttpError("Something went wrong.Could not find a place",500);
        return next(error);
    }
    
    if(!userWithPlaces|| userWithPlaces.places.length===0){

        return next(new HttpError("Could not find a places for the provided user id",404)) ;
    }
    
    res.json({places:userWithPlaces.places.map(place=>place.toObject({getters:true}))});
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
        image:"https://images.unsplash.com/photo-1538370965046-79c0d6907d47?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHw%3D&w=1000&q=80",
        creator
    });

    let user;
    try{
        user=await User.findById(creator);
    }
    catch(err){
        const error=new HttpError("Creating place failed. Please try again",500)
        return next(error);
    }

    if(!user){
        const error=new HttpError("Could not find any user for the provided id",404)
        return next(error);
    }

    try{

        const sess=await mongoose.startSession();
        sess.startTransaction();

        await createdPlace.save({session:sess});
        user.places.push(createdPlace);
        await user.save({session:sess})
        await sess.commitTransaction()
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
        
        return next( new HttpError('Invalid input passed, please check your data.',422))
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
        place= await Place.findById(placeId).populate('creator');
    }
    catch(err){
        return next(new HttpError("Something went wrong. Could not Delete the place. Please try again",500)) ;
    }

    if(!place){
        return next(new HttpError("Could not find the place for this id. Please try again",404)) ;
    }

    try{
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session:sess});
        place.creator.places.pull(place);
        await place.creator.save({session:sess})
        await sess.commitTransaction()
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