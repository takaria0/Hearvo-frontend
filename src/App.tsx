
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'; 
import * as styles from './App.module.css';

import Intro from './components/Intro';
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
      <Route path="/intro" exact component={Intro} key="intro" />
      <Auth>
          <Header></Header>
            
          <Route path="/" exact component={Home} key="home-home"/>
          <Route path="/latest" exact component={Home} key="popular-home"/>
          <Route path="/popular" exact component={Home} key="latest-home" />
          <Route path="/:user_name/posts/:post_id" component={PostDetail} />
          <Route path="/profile" exact component={ProfileDetail} />
          
      </Auth>
    </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;