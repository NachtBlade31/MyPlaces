const { v4: uuidv4 } = require('uuid');

const HttpError=require('../models/http-error');

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

const getPlaceById=(req,res,next)=>{
    const placeId=req.params.pid
    const place=DUMMY_PLACES.find(p=>{
        return p.id===placeId;
    });
    if(!place){

        throw new HttpError("Could not find a place for the provided id",404);;
    }
    res.json({place});

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

const createPlace=(req,res,next)=>{

    const {title,description,coordinates,address,creator}=req.body;
    const createdPlace={
        id:uuidv4(),
        title,
        description,
        location:coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({createdPlace});
}

const UpdatePlaceById=(req,res,next)=>{

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
    DUMMY_PLACES=DUMMY_PLACES.filter(p=>p.id!==placeId);
    res.status(200).json({message:"Deleted Place."});

}

exports.getPlaceById=getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.UpdatePlaceById=UpdatePlaceById;
exports.deletePlaceById=deletePlaceById;