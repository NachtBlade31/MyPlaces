const express =require('express');

const router=express.Router();

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





module.exports=router;