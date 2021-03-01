const express =require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose')

const placesRoutes=require('./routes/places-routes');
const userRoutes=require('./routes/users-routes');
const HttpError=require("./models/http-error");
const app=express();
app.use(bodyParser.json());
app.use('/api/places',placesRoutes);
app.use('/api/users',userRoutes);
// error handling route for all un existing routes
app.use((req,res,next)=>{

    const error=new HttpError("Could not find this route",404);
    throw error
});



app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code||500);
    res.json({message:error.message ||"An unknown error has occuered"})
})
mongoose
// Correct the mongodb url here 
.connect('<ADD_MONGODB_URL>', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(5000);
})
.catch(err=>{
    console.log(err);
});

