import React, { useState, useEffect } from 'react';
import axios from '../Api';
import * as styles from '../../css/Home.module.css';
import { Link } from 'react-router-dom'
import { getJwt } from '../../helpers/jwt';
import Header from '../Header/Header';
import SideBar from '../SideBar';
import ProfileDetail from './ProfileDetail';
import TopicFollowButtonLoaded from '../Topic/TopicFollowButtonLoaded';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import i18n from "../../helpers/i18n";


const Profile = (props: any) => {
  const jwt = getJwt();
  let options = {};
  if (!jwt) {
    options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
  } else {
    options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
  }
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const keywordArray = window.location.pathname.split("/");


  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    axios.get("/users?profile_detail=true", options)
      .then(res => {
        setUser(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      })
  }, []);

  // if (isLoading) {
  //   return (<span><Header></Header>
  //     <div className={styles.body}>
  //       <div className={styles.feed}></div>
  //       <div className={styles.side_bar}><SideBar></SideBar></div></div>
  //   </span>)
  // }

  return (
    <div>
      <Header></Header>
      <div className={styles.body}>
        <div className={styles.feed}>
          <div style={inlineStyles.realName}>{user.first_name} {user.middle_name} {user.last_name}</div>
          <div style={inlineStyles.profileName}>@{user.profile_name}</div>

          <span><Link style={{ textDecoration: 'none' }} to="/profile/following">{i18n.t("profile.following")} {user.num_of_following_topics}</Link></span>&nbsp;&nbsp;&nbsp;

          <span><Link style={{ textDecoration: 'none' }} to="/profile/voted">{i18n.t("profile.numOfVotes")} {user.num_of_votes}</Link></span>

          <div style={{ float: 'right', textAlign: 'right' }}><small>{i18n.t("profile.joined")} {user.created_at.slice(0, 10)}</small></div>

          <Switch>
            <Route path={props.match.url + "/myposts"} key="myposts" component={ProfileDetail} />
            <Route path={props.match.url + "/voted"} key="voted" component={ProfileDetail} />
            <Route path={props.match.url + "/following"} key="following" component={ProfileDetail} />
          </Switch>
        </div>

        <div className={styles.side_bar}>
          <SideBar></SideBar>
        </div>
      </div>
    </div>
  )
}


const inlineStyles = {
  realName: {
    fontSize: '1.5em',
    fontWeight: 'bold' as const,
    marginBottom: 1,
  },
  profileName: {
    fontSize: 'small',
    color: 'dimgray',
    marginBottom: 10,
  }
}


export default Profile;