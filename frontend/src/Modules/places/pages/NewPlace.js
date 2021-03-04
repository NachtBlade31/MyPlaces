import React,{useContext} from 'react';
import {useHistory} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/utils/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hooks';
import {AuthContext} from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlaceForm.css';



const NewPlace=()=>{

  const auth=useContext(AuthContext); 
  const {isLoading,error,sendRequest,clearError}=useHttpClient();
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

    
        const history=useHistory();
    const placeSubmitHandler=async event=>{
        event.preventDefault();
        try{
            await sendRequest("http://localhost:5000/api/places",
       "POST",
       JSON.stringify({
           title:formState.inputs.title.value,
           description:formState.inputs.description.value,
           address:formState.inputs.address.value,
           creator:auth.userId

       }),
       {'Content-Type':"application/json"}
       )
       history.push("/")
       //Redirect user to different page
        }
        catch(err){
            console.log(err)
        }
       
        //send to backend later
    }
    return <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading &&<LoadingSpinner asOverlay/>}
                <Input id="title" onInput={inputHandler} element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText='Please enter valid title'/>

                
                <Input id="description" onInput={inputHandler} element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please enter valid Description (at least 5 characters)'/>

                <Input id="address" onInput={inputHandler} element="input" label="Address" validators={[VALIDATOR_REQUIRE()]} errorText='Please enter valid Address.'/>
                <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
            </form>


    </React.Fragment>
    
}

export default NewPlace;