
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'; 
import './App.css';

import Home from './components/Home';
import Auth from './components/Auth';
import Login from './components/Login';


function App() {
  return (

    <BrowserRouter>
    <Switch>
      <Route path="/login" exact component={Login} />
      <Auth>
          <Route path="/" exact component={Home} />
      </Auth>
    </Switch>
    </BrowserRouter>
      // <Feed service="Hearvo"></Feed>
  );
}

export default App;