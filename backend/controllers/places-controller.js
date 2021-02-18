const { v4: uuidv4 } = require('uuid');
const {validationResult} =require('express-validator');

const HttpError=require('../models/http-error');
const getCoordsForAddress =require('../utils/location');
const Place=require('../models/place');
let DUMMY_PLACES=[
    {
        id:'p1',
        title:'Empire State Building',
        description:'One of the famous sky scrapper in the world',
        location:{
            lat:40.7484474,
            lng:-73.9871516
        },
        address:'20 W 34th St, New York, NY10001',
        creator:'u1'
    }
]

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

const getPlacesByUserId=(req,res,next)=>{
    const userId=req.params.uid;
    const users=DUMMY_PLACES.filter(u=>{
        return u.creator===userId;
    });
    if(!users|| users.length===0){

        return next(new HttpError("Could not find a places for the provided user id",404)) ;
    }
    
    res.json({users});
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
        console.log(err)
        const error=new HttpError("Creating place failed,please try again",500);
        return next(error);
    }
    
    res.status(201).json({createdPlace});
}

const UpdatePlaceById=(req,res,next)=>{
    
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        
        throw new HttpError('Invalid input passed, please check your data.',422)
    }

    const placeId=req.params.pid;
    const {title,description}=req.body;
    const updatePlace={...DUMMY_PLACES.find(p=>p.id===placeId)};
    const placeIndex=DUMMY_PLACES.findIndex(p=>p.id===placeId)
    updatePlace.title=title;
    updatePlace.description=description;

    DUMMY_PLACES[placeIndex]=updatePlace;
    res.status(200).json({place:updatePlace});


}

const deletePlaceById=(req,res,next)=>{
    const placeId=req.params.pid;
    if (!DUMMY_PLACES.find(p=>p.id===placeId)){
        throw new HttpError("Could not find the place for that id",404);
    }
    DUMMY_PLACES=DUMMY_PLACES.filter(p=>p.id!==placeId);
    res.status(200).json({message:"Deleted Place."});

}

exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.UpdatePlaceById=UpdatePlaceById;
exports.deletePlaceById=deletePlaceById;