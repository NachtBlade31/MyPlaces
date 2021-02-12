const express =require('express');

const placesController=require('../controllers/places-controller');
const router=express.Router();





router.get("/:pid",placesController.getPlaceById);

router.get("/user/:uid",placesController.getPlacesByUserId);

router.post("/",placesController.createPlace);

router.patch("/:pid",placesController.UpdatePlaceById)

router.delete("/:pid",placesController.deletePlaceById)
module.exports=router;