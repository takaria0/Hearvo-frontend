
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'; 
import * as styles from './App.module.css';

import Home from './components/Home';
import Auth from './components/Auth';
import Login from './components/Login';
import Signup from './components/Signup';
import PostDetail from './components/PostDetail';
import Header from './components/Header';
import ProfileDetail from './components/ProfileDetail';

function App() {
  return (
    <div className={styles.body}>
    <BrowserRouter>
    <Switch>
      <Route path="/signup" exact component={Signup} />
      <Route path="/login" exact component={Login} />
      <Auth>
          <Header></Header>
          <Route path="/" component={Home} />
          <Route path="/:keyword"  component={Home} />
          <Route path="/:user_name/posts/:post_id" component={PostDetail} />
          <Route path="/profile" exact component={ProfileDetail} />
      </Auth>
    </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;