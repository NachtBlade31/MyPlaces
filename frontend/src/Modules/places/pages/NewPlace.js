import React,{useCallback,useReducer} from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/utils/validators';

import './NewPlace.css';

const formReducer=(state,action)=>{

    switch(action.type){
        case 'INPUT_CHANGE':
            let formIsValid=true;
            for (const inputId in state.inputs){
                if(inputId===action.inputId){
                    formIsValid=formIsValid &&action.isValid;
                }
                else{
                    formIsValid=formIsValid && state.inputs[inputId].isValid;
                }
            }
            return{
                ...state,
                input:{
                    ...state.inputs,
                    [action.inputId]:{value:action.value,isValid:action.isValid}
                },
                isValid:formIsValid
            }

        default:
            return state;
    }
}

const NewPlace=()=>{

   const[formState,dispatch]= useReducer(formReducer,{
        inputs:{
            title:{
                value:'',
                isValid:false
            },
            description:{
                value:'',
                isValid:false
            }
        },
        isValid:false
    });


    const inputHandler=useCallback((id,value,isValid)=>{
        dispatch({type:'INPUT_CHANGE',value:value,isValid:isValid,inputId:id})
    },[])

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