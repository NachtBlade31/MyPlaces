import React,{useState,useCallback} from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';

import Users from './Modules/users/pages/Users';
import NewPlace from './Modules/places/pages/NewPlace';
import UserPlaces from './Modules/places/pages/UserPlaces';
import UpdatePlace from './Modules/places/pages/UpdatePlace';
import Auth from './Modules/users/pages/Auth.js';
import MainNavigation from './Modules/shared/components/Navigation/MainNavigation';
import {AuthContext} from './Modules/shared/context/auth-context';
const App = () => {

  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [userId,setUser]=useState(false);
  const login =useCallback((uid)=>{
    setIsLoggedIn(true);
    setUser(uid)
  },[]);

  const logout =useCallback(()=>{
    setIsLoggedIn(false);
    setUser(null)
  },[])

  let routes;

  if (isLoggedIn){
    routes=(
      <Switch>
      <Route path="/" exact>
        <Users/>
      </Route>
      
      <Route path="/places/new" exact>
        <NewPlace/>
      </Route>
      <Route path="/places/:placeId" exact>
        <UpdatePlace/>
      </Route>
       <Route path='/:userId/places' exact>
      <UserPlaces/>
      </Route>
      <Redirect to="/"/>
      </Switch>
    );
  }
  else{
    routes=(<Switch>
      <Route path="/" exact>
        <Users/>
      </Route>
       <Route path='/:userId/places' exact>
      <UserPlaces/>
      </Route>
       <Route path="/auth" exact>
        <Auth/>
      </Route>
      <Redirect to="/auth"/>
      </Switch>
    )
  }
  return( 
  <AuthContext.Provider value={{isLoggedIn:isLoggedIn,userId:userId,login:login,logout:logout}}>
  <Router>
    <MainNavigation/>
    <main>
      {routes}
    </main>
  </Router>
  </AuthContext.Provider>

  )
   
}

export default App;
