import {useState,useCallback,useEffect} from 'react';

let logoutTimer;

export const useAuth=()=>{
const [token,setToken]=useState();
  const [userId,setUser]=useState(false);
  const [tokenExpirationDate,setTokenExpirationDate]=useState()

  const login =useCallback((uid,token,expirationDate)=>{
    setToken(token);
    const tokenExprationDate=expirationDate|| new Date(new Date().getTime()+1000*60*60*24)
    setTokenExpirationDate(tokenExprationDate)
    localStorage.setItem('userData',JSON.stringify({
      userId:uid,
      token:token,
      expiration:tokenExprationDate.toISOString()
    }));
    setUser(uid)
  },[]);

  const logout =useCallback(()=>{
    setToken(null);
    setUser(null);
    setTokenExpirationDate(null)
    localStorage.removeItem('userData');
  },[])

  useEffect(()=>{
    if(token && tokenExpirationDate){
      const remainingTiming=tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer=setTimeout(logout,remainingTiming)
    }
    else{
      clearTimeout(logoutTimer);
    }
  },[token,logout,tokenExpirationDate])

  useEffect(()=>{
    const storeData=JSON.parse(localStorage.getItem('userData'));
    if(storeData && storeData.token && new Date(storeData.expiration)>new Date()){
      login(storeData.userId,storeData.token,new Date(storeData.expiration))
    }
  }
  ,[login])

  return {token,login,logout,userId};
}