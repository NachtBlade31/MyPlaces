import React from 'react';
import {useParams} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import  {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/utils/validators';
import {useForm} from '../../shared/hooks/form-hook';

import './PlaceForm.css';
const PLACES=[
    {
     id:"p1",
     title:"Empire State Building",
     description:"One of the most famous building in the world",
     imageUrl:"https://www.history.com/.image/t_share/MTU3ODc3NjU2NzUxNTgwODk1/this-day-in-history-05011931---empire-state-building-dedicated.jpg",
     address:"20 W 34th St, New York, NY 10001, United States",
     location:{
         lat:40.7484405,
         lng:-73.9878531
     },
     creator:"u1"
    },
    {
     id:"p2",
     title:"Empire State Building",
     description:"One of the most famous building in the world",
     imageUrl:"https://www.history.com/.image/t_share/MTU3ODc3NjU2NzUxNTgwODk1/this-day-in-history-05011931---empire-state-building-dedicated.jpg",
     address:"20 W 34th St, New York, NY 10001, United States",
     location:{
         lat:40.7484405,
         lng:-73.9878531
     },
     creator:"u2"
    }
]

const UpdatePlace=props=>{
    const placeId=useParams().placeId;
    const identifiedPlace=PLACES.find(p=>p.id===placeId)

    const [formState,inputHandler]=useForm({
        title:{
            value:identifiedPlace.title,
            isValid:true
        },
        description:{
            value:identifiedPlace.description,
            isValid:true
        }
    },true)
    
    const placeUpdateSubmitHandler=event=>{
        event.preventDefault();
        console.log(formState.inputs);
    }

    if(!identifiedPlace){
        return <div className="center"><h2>Couldn't find the place. Sorry :(</h2></div>
    }
    return <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input id='title' element="input" type="text" label="Title" validators={[VALIDATOR_MINLENGTH(5),VALIDATOR_REQUIRE()]} errorText="Please enter a valid Title" onInput={inputHandler} initialValue={formState.inputs.title.value} initialValid={formState.inputs.title.isValid}/>

        <Input id='description' element="textarea"  label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid Description (min 5 letters)" onInput={inputHandler} initialValue={formState.inputs.description.value} initialValid={formState.inputs.description.isValid}/>

        <Button type="submit" disabled={!formState.isValid}>Update Place</Button>
    </form>
}

export default UpdatePlace;