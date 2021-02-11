const HttpError=require('../models/http-error');

const DUMMY_PLACES=[
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

const getPlaceByUserId=(req,res,next)=>{
    const userId=req.params.uid;
    const user=DUMMY_PLACES.find(u=>{
        return u.creator===userId;
    });
    if(!user){

        return next(new HttpError("Could not find a place for the provided user id",404)) ;
    }
    
    res.json({user});
}

exports.getPlaceById=getPlaceById;
exports.getPlaceByUserId=getPlaceByUserId;