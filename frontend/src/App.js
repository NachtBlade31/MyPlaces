import React from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';

import Users from './Modules/users/pages/Users';
import NewPlace from './Modules/places/pages/NewPlace';
import UserPlaces from './Modules/places/pages/UserPlaces';
import UpdatePlace from './Modules/places/pages/UpdatePlace';
import MainNavigation from './Modules/shared/components/Navigation/MainNavigation';
const App = () => {
  return <Router>
    <MainNavigation/>
    <main>
    <Switch>
      <Route path="/" exact>
        <Users/>
      </Route>
      <Route path='/:userId/places' exact>
      <UserPlaces/>
      </Route>
      <Route path="/places/new" exact>
        <NewPlace/>
      </Route>
      <Route path="/places/:placeId" exact>
        <UpdatePlace/>
      </Route>
      <Redirect to="/"/>
    </Switch>
    </main>
  </Router>
  
   
}

export default App;
