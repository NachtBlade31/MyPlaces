import React ,{useEffect,useState,useContext} from 'react';
import {useParams,useHistory} from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import  {VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from '../../shared/utils/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hooks';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {AuthContext} from '../../shared/context/auth-context';

import './PlaceForm.css';

const UpdatePlace=props=>{
    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    const [loadedPlaces,setLoadedPlaces]=useState();
    const placeId=useParams().placeId;
    const auth=useContext(AuthContext);
    const history=useHistory();
    

    const [formState,inputHandler,setFormData]=useForm({
        title:{
            value:'',
            isValid:false
        },
        description:{
            value:'',
            isValid:false
        }
    },false)
    
   useEffect(()=>{
       const fetchPlace=async ()=>{
           try{
            const responseData=await sendRequest(process.env.REACT_APP_BACKEND_URL+`/places/${placeId}`)
            setLoadedPlaces(responseData.place);
             setFormData({
         title:{
            value:responseData.place.title,
            isValid:true
        },
        description:{
            value:responseData.place.description,
            isValid:true
        }
    },true);
        }
           catch(err){
               console.log(err)
           }
            
       }
       fetchPlace()
   },[sendRequest,placeId,setFormData])
        

    
    const placeUpdateSubmitHandler=async event=>{
        event.preventDefault();
        try{
            await sendRequest(process.env.REACT_APP_BACKEND_URL+`/places/${placeId}`
            ,'PATCH',
            JSON.stringify({
                title:formState.inputs.title.value,
                description:formState.inputs.description.value,
            }),
            {
              'Content-Type':'application/json',
              Authorization:'Bearer '+auth.token  
            }
            )
            history.push("/"+auth.userId+"/places");
        }
        catch(err){
            console.log(err)
        }
        
    }
    if(isLoading){
        return <div className="center"><LoadingSpinner/></div>
    }

    if(!loadedPlaces &&!error){
        return <div className="center">
            <Card>
            <h2>Couldn't find the place. Sorry :(</h2>
            </Card>
            </div>
    }

    
    return <React.Fragment>   
         <ErrorModal error={error} onClear={clearError}/>
        { !isLoading && loadedPlaces &&<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input id='title' element="input" type="text" label="Title" validators={[VALIDATOR_MINLENGTH(5),VALIDATOR_REQUIRE()]} errorText="Please enter a valid Title" onInput={inputHandler} initialValue={loadedPlaces.title} initialValid={true}/>

        <Input id='description' element="textarea"  label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid Description (min 5 letters)" onInput={inputHandler} initialValue={loadedPlaces.description} initialValid={true}/>

        <Button type="submit" disabled={!formState.isValid}>Update Place</Button>
    </form>}
    </React.Fragment>

}

export default UpdatePlace;