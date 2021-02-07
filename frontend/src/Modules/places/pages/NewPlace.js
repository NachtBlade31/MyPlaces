import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/utils/validators';
import {useForm} from '../../shared/hooks/form-hook';

import './PlaceForm.css';



const NewPlace=()=>{

  const [formState,inputHandler] = useForm({
            title:{
                value:'',
                isValid:false
            },
            description:{
                value:'',
                isValid:false
            },
             address:{
                value:'',
                isValid:false
            }
        },false)

    

    const placeSubmitHandler=event=>{
        event.preventDefault();
        console.log(formState.inputs)
        //send to backend later
    }
    return <React.Fragment>
            <form className="place-form" onSubmit={placeSubmitHandler}>
                <Input id="title" onInput={inputHandler} element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText='Please enter valid title'/>

                
                <Input id="description" onInput={inputHandler} element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please enter valid Description (at least 5 characters)'/>

                <Input id="address" onInput={inputHandler} element="input" label="Address" validators={[VALIDATOR_REQUIRE()]} errorText='Please enter valid Address.'/>
                <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
            </form>


    </React.Fragment>
    
}

export default NewPlace;