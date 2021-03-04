import React,{useState,useContext} from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import  {VALIDATOR_MINLENGTH,VALIDATOR_MAXLENGTH, VALIDATOR_EMAIL,VALIDATOR_REQUIRE} from '../../shared/utils/validators';
import {useForm} from '../../shared/hooks/form-hook';
import {useHttpClient} from '../../shared/hooks/http-hooks';
import {AuthContext} from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './Auth.css';
const Auth=props=>{

    const auth=useContext(AuthContext);
    const [isLoginMode,setIsLoginMode]=useState(true);
    const {isLoading,error,sendRequest,clearError}=useHttpClient();

    const [formState,inputHandler,setFormData]=useForm({
        email:{
            value:'',
            isValid:false
        },
        password:{
            value:'',
            isValid:false
        }
    },false)
    
    const switchModeHandler=event=>{
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name:undefined
            },
            formState.inputs.email.isValid&&formState.inputs.password.isValid);
        }
        else{
            setFormData({
                ...formState.inputs,
                name:{
                    value:'',
                    isValid:false
                }

            },false);
        }
        setIsLoginMode(prevMode=>!prevMode);
    }

    const authSubmitHandler=async event=>{
    event.preventDefault();

    if(isLoginMode){

        try{
           const responseData= await sendRequest('http://localhost:5000/api/users/login'
        ,"POST"
        ,JSON.stringify({
           email:formState.inputs.email.value,
           password:formState.inputs.password.value
       }),
        {
            'Content-Type':'application/json'
       } 
    );
    auth.login(responseData.user.id);
}
catch(err){
    console.log(err)
}

    }
    else{
        try{
        const responseData=await sendRequest('http://localhost:5000/api/users/signup','POST',JSON.stringify({
           name:formState.inputs.name.value,
           email:formState.inputs.email.value,
           password:formState.inputs.password.value
       }),
       {
            'Content-Type':'application/json'
       } 
    );
    auth.login(responseData.user.id);

        }
        catch(err){
           console.log(err) 
        }
        
    }
    
    
}
    return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
        <Card className="authentication">
    {isLoading &&<LoadingSpinner asOverlay/>}
    <h2>Login Required</h2>
    <hr/>
    <form onSubmit={authSubmitHandler}>
        {!isLoginMode &&<Input  element="input" id="name" type="text" label="Name" validators={[VALIDATOR_REQUIRE()]} errorText="Please Enter the Name" onInput={inputHandler} />}
        <Input id='email' element="input" type="email" label="EMAIL" validators={[VALIDATOR_EMAIL()]} errorText="Please enter a valid EMAIL address" onInput={inputHandler}  />

        <Input id='password' element="input" type="password" label="PASSWORD" validators={[VALIDATOR_MINLENGTH(6),VALIDATOR_MAXLENGTH(16)]} errorText="Please enter a Password (min 6 , max 16)" onInput={inputHandler} />

        <Button type="submit" disabled={!formState.isValid}>{isLoginMode? 'Login':'Signup'}</Button>
    </form>

        <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode?'Signup':'Login'}</Button>
</Card>

        </React.Fragment>
    )
}

export default Auth;