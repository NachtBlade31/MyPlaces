import React,{useEffect,useState} from 'react';

import Userslist from '../components/UsersList';
import ErrorModel from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
const Users=()=>{

    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState();
    const [loadedUsers,setLoadedUsers]=useState();

    useEffect(()=>{
    const sendRequest=async ()=>{
        setIsLoading(true)

        try{
            const response=await fetch('http://localhost:5000/api/users');
        const resposneData=await response.json();

        if(!response.ok){
            throw new Error(resposneData.message);
        }
        setLoadedUsers(resposneData.users);
        }
        catch(err){ 
            setError(err.message);
        }
        setIsLoading(false);
    };

    sendRequest();
    },[]);

    const errorHandler=()=>{
        setError(null);
    }
        


    
    return <React.Fragment>
        <ErrorModel error={error} onClear={errorHandler}/>
        {isLoading &&<div className="center"><LoadingSpinner/></div> }
        {!isLoading && loadedUsers && <Userslist items={loadedUsers}/>};
    </React.Fragment>
    
}

export default Users;