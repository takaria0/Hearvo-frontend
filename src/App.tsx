
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'; 
import * as styles from './App.module.css';

import Intro from './components/Intro';
import Home from './components/Home';
import Auth from './components/Auth';
import Login from './components/Login';
import Signup from './components/Signup';
import PostDetail from './components/PostDetail';
import Header from './components/Header';
import Settings from './components/Settings';
import Profile from './components/Profile';
import ProfileDetail from './components/ProfileDetail';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import GroupCreate from './components/GroupCreate';
import GroupInvite from './components/GroupInvite';
import GroupList from './components/GroupList';
import { HomeOutlined } from '@material-ui/icons';
import { Helmet } from "react-helmet";

function App() {
  return (
    <div className={styles.body}>
      <Helmet>
        <title>Hearvo</title>
        <meta name="description" content="Your voice must be heard" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
    <BrowserRouter>
    <Switch>
      <Route path="/signup" exact component={Signup} />
      <Route path="/login" exact component={Login} />
      <Route path="/intro" exact component={Intro} key="intro" />
      <Route path="/tos" exact component={TermsOfService} key="terms" />
      <Route path="/privacy" exact component={PrivacyPolicy} key="privacypolicy" />

        <Route path="/" exact component={Home} />
        <Route path="/latest" exact component={Home}  />
        <Route path="/topic" exact component={Home}  />
        <Route path="/popular" exact component={Home}/>
        <Route path="/popular/:time" exact component={Home} />
        <Route path="/search" component={Home} />
          <Route path="/posts/:post_id" render={(props) => <PostDetail key={Math.random().toString(36)} />} />
      <Auth>
          <Route path="/profile" component={Profile} />
          <Route path="/group/:group_id/feed" exact component={Home} />
          <Route path="/group/list" exact component={GroupList} />
          <Route path="/group/create" exact component={GroupCreate} />
          <Route path="/group/invite/:link" exact component={GroupInvite} />
          <Route path="/settings" exact component={Settings} key="settings" />
      </Auth>
        
    </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;