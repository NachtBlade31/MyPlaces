import {useCallback, useState,useRef,useEffect} from 'react';

export const useHttpClient=()=>{

    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState();

    const activeHttpRequests=useRef([]);

    const sendRequest=useCallback(async (url,method="GET",body=null,headers={})=>{

        setIsLoading(true)
        const httpAbortControler=new AbortController();
        activeHttpRequests.current.push(httpAbortControler);
        try{
            const response=await fetch(url,{
            method,
            body,
            headers,
            signal:httpAbortControler.signal
        });

        const resposneData=await response.json();

        activeHttpRequests.current=activeHttpRequests.current.filter(reqCtrl=>reqCtrl!==httpAbortControler)

        if(!response.ok){
            throw new Error(resposneData.message);
        }
        setIsLoading(false)
        return resposneData;
        }
        catch(err){
            setError(err.message);
            setIsLoading(false)
            throw err;
        }      
    },[])

    const clearError=()=>{
        setError(null);
    }
    useEffect(()=>{
        return ()=>{
            activeHttpRequests.current.forEach(abortCntrl=>abortCntrl.abort());
        };
    },[])
    return {isLoading,error,sendRequest,clearError};
};