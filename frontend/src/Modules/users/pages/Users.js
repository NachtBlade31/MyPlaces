import React,{useEffect,useState} from 'react';

import {useHttpClient} from '../../shared/hooks/http-hooks';

import Userslist from '../components/UsersList';
import ErrorModel from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
const Users=()=>{

    const {isLoading,error,sendRequest,clearError}=useHttpClient();
    const [loadedUsers,setLoadedUsers]=useState();

    useEffect(()=>{
    const sendUserRequest=async ()=>{

        try{
            const resposneData=await sendRequest('http://localhost:5000/api/users');

        setLoadedUsers(resposneData.users);
        }
        catch(err){ 
            console.log(err)
        }
    };

    sendUserRequest();
    },[sendRequest]);
        


    
    return <React.Fragment>
        <ErrorModel error={error} onClear={clearError}/>
        {isLoading &&<div className="center"><LoadingSpinner/></div> }
        {!isLoading && loadedUsers && <Userslist items={loadedUsers}/>};
    </React.Fragment>
    
}

export default Users;