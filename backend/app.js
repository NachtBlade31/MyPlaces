const express =require('express');
const bodyParser=require('body-parser');

const placesRoutes=require('./routes/places-routes');
const userRoutes=require('./routes/users-routes');
const HttpError=require("./models/http-error");
const app=express();
app.use(bodyParser.json());
app.use('/api/places',placesRoutes);
app.use('/api/users',userRoutes);
// error handling route for all un existing routes
app.use((req,res,next)=>{

    const error=new Error("Could not find this route",404);
    throw error
});



app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code||500);
    res.json({message:error.message ||"An unknown error has occuered"})
})
app.listen(5000);