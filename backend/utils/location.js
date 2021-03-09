const axios=require('axios');
const HttpError=require('../models/http-error');
const API_KEY=process.env.LOCATION_IQ_API_KEY;


const getCoordsForAddress=async address=>{
     const response = await axios.get(`https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(address)}&format=json`);
   const data=response.data[0]

   if( !data || data.status==='ZERO_RESULTS'){
    throw new HttpError("Could not fing location for the specific address",422);
    throw error;
   }
   
//    const coordinates= data.candidates[0].geometry.location
    const coordinates={
        lat:data.lat,
        lng:data.lon
    }

   return coordinates;
}

module.exports=getCoordsForAddress;