
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
import Settings from './components/Settings';
import ProfileDetail from './components/ProfileDetail';
import MyPostHeader from './components/Feed/MyPostHeader';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';

function App() {
  return (
    <div className={styles.body}>
    <BrowserRouter>
    <Switch>
      <Route path="/signup" exact component={Signup} />
      <Route path="/login" exact component={Login} />
      <Route path="/intro" exact component={Intro} key="intro" />
      <Route path="/tos" exact component={TermsOfService} key="terms" />
      <Route path="/privacy" exact component={PrivacyPolicy} key="privacypolicy" />
      <Route path="/" exact component={Home} key="home-home" />
      <Route path="/latest" exact component={Home} key="latest-home" />
      <Route path="/popular" exact component={Home} key="popular-home" />
      <Route path="/popular/:time" exact component={Home} key="popular-time-home" />
      <Route path="/search" exact component={Home} key="search-home" />
      <Route path="/posts/:post_id" component={PostDetail} />
      <Auth>
          <Header></Header>
          <Route path="/profile" exact component={ProfileDetail} />
          <Route path="/profile/feed/myposts" exact component={MyPostHeader} key="myposts-home" />
          <Route path="/profile/feed/voted" exact component={MyPostHeader} key="voted-home" />
          <Route path="/settings" exact component={Settings} key="settings" />
      </Auth>
    </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;