
import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'; 
import * as styles from './App.module.css';

import Intro from './components/Info/Intro';
import Home from './components/Home';
import Auth from './components/Auth/Auth';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import PostDetail from './components/Feed/PostDetail';
import Header from './components/Header/Header';
import Settings from './components/Settings/Settings';
import Profile from './components/Profile/Profile';
import ProfileDetail from './components/Profile/ProfileDetail';
import TermsOfService from './components/Info/TermsOfService';
import PrivacyPolicy from './components/Info/PrivacyPolicy';
import GroupCreate from './components/Group/GroupCreate';
import GroupInvite from './components/Group/GroupInvite';
import GroupList from './components/Group/GroupList';
import CustomizedSnackbars from './components/Alert/Alert'
import Help from './components/Info/Content';
import { HomeOutlined } from '@material-ui/icons';
import { Helmet } from "react-helmet";
import CLOUDFLARE_TO_SUBDOMAIN from './helpers/countryMap';
import CountryContext from './contexts';
import { StylesProvider } from "@material-ui/core/styles";

function App() {
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    fetch("https://www.cloudflare.com/cdn-cgi/trace", { mode: "cors" })
      .then((res: any) => res.text())
      .then(res => {
        const country: string = res.split("\n")[8].split('=')[1].toLowerCase(); // is this correct ?
        console.log(country);
        setCountry(CLOUDFLARE_TO_SUBDOMAIN(country));
      })
      .catch(err => {
      })

  }, [])


  return (

    
      <div className={styles.body}>
        <StylesProvider injectFirst>
        <CountryContext.Provider value={{country}}>
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
            <Route path="/help" exact component={Help} key="help" />
            <Route path="/" exact component={Home} />
            <Route path="/recommend" exact component={Home} />
            <Route path="/latest" exact component={Home}  />
            <Route path="/topic" exact component={Home}  />
            <Route path="/popular" exact component={Home}/>
            <Route path="/popular/:time" exact component={Home} />
            <Route path="/search" component={Home} />
            <Route exact path="/posts/:post_id" render={(props) => <PostDetail key={Math.random().toString(36)} />} />
            <Route path="/posts/:post_id/record/:post_detail_id?" render={(props) => <PostDetail key={Math.random().toString(36)} />} />
            <Auth>
                <Route path="/profile" component={Profile} />
                {/* <Route path="/group/:group_id/feed" exact component={Home} />
                <Route path="/group/list" exact component={GroupList} />
                <Route path="/group/create" exact component={GroupCreate} />
                <Route path="/group/invite/:link" exact component={GroupInvite} /> */}
                <Route path="/settings" exact component={Settings} key="settings" />
            </Auth>
          </Switch>
          </BrowserRouter>
          <CustomizedSnackbars />
        </CountryContext.Provider>
        </StylesProvider>
      </div>
    


  );
}

export default App;