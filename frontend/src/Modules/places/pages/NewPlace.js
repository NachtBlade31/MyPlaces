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
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

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
            },
            image:{
                value:null,
                isValid: false
            }
        },false)

    
        const history=useHistory();
    const placeSubmitHandler=async event=>{
        event.preventDefault();
        try{
            const formdata=new FormData()
            formdata.append('title',formState.inputs.title.value)
            formdata.append('description',formState.inputs.description.value)
            formdata.append('address',formState.inputs.address.value)
            formdata.append('image',formState.inputs.image.value)
            
            await sendRequest("http://localhost:5000/api/places",
       "POST",
       formdata,
       {
           Authorization:'Bearer '+auth.token
       }
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
                <ImageUpload id="image" onInput={inputHandler} errorText="Please Provide an image" />
                <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
            </form>


    </React.Fragment>
    
}

export default NewPlace;