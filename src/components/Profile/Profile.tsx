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
import { DialogTitle, Dialog, DialogContent, TextareaAutosize } from '@material-ui/core';


const EditProfile = (props: any) => {
  const [modal, setModal] = useState(false);
  const [profileName, setProfileName] = useState(props.user.profile_name);
  const [description, setDescription] = useState(props.user.description);

  const onSubmit = () => {
    // axios.put();
  }

  return (
    <div>
      <button onClick={() => setModal(true)} style={inlineStyles.editProfile}>{i18n.t("profile.editProfile")}</button>

      <Dialog open={modal} onClose={() => setModal(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <div style={inlineStyles.editProfileItem}>
            <div>Name</div>
            {props.user.first_name} {props.user.middle_name} {props.user.last_name}
          </div>
          <div style={inlineStyles.editProfileItem}>
            <div>User Name</div>
            <input style={inlineStyles.editProfileTextArea} value={profileName} onChange={(e) => setProfileName(e.target.value)}></input>
          </div>
          <div style={inlineStyles.editProfileItem}>
            <div>Bio</div>
            <TextareaAutosize style={inlineStyles.editProfileTextArea} rows={5} value={description} onChange={(e) => setDescription(e.target.value)}></TextareaAutosize>
          </div>
          <div style={inlineStyles.editProfileItem}>
            <button>Save</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


const Profile = (props: any) => {
  const jwt = getJwt();
  let options = {};
  if (!jwt) {
    options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
  } else {
    options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
  }
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const keywordArray = window.location.pathname.split("/");


  useEffect(() => {
    // setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    console.log("props.match", props.match);
    axios.get(`/users?name=${props.match.params.name}`, options)
      .then(res => {
        setUser(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      })
  }, []);

  if (isLoading) {
    return (<span><Header></Header>
      <div className={styles.body}>
        <div className={styles.feed}></div>
        <div className={styles.side_bar}><SideBar></SideBar></div></div>
    </span>)
  }

  return (
    <div>
      <Header></Header>
      <div className={styles.body}>
        <div className={styles.feed}>
          <div style={inlineStyles.realName}>{user.first_name} {user.middle_name} {user.last_name}</div>
          {user.myprofile ? <EditProfile user={user}/> : "" }
          <div style={inlineStyles.profileName}>@{user.profile_name}</div>


          {user.myprofile ? 
            <div>

              <span><Link style={{ textDecoration: 'none' }} to={"/profile/" + user.name + "/following"}>{i18n.t("profile.following")} {user.num_of_following_topics}</Link></span>&nbsp;&nbsp;&nbsp;

              <span><Link style={{ textDecoration: 'none' }} to={"/profile/" + user.name + "/voted"}>{i18n.t("profile.numOfVotes")} {user.num_of_votes}</Link></span>

              <div style={{ float: 'right', textAlign: 'right' }}><small>{i18n.t("profile.joined")} {user.created_at.slice(0, 10)}</small></div>

              <Switch>
                <Route path={props.match.url + "/"} key="myposts" component={ProfileDetail} />
                <Route path={props.match.url + "/myposts"} key="myposts" component={ProfileDetail} />
                <Route path={props.match.url + "/voted"} key="voted" component={ProfileDetail} />
                <Route path={props.match.url + "/following"} key="following" component={ProfileDetail} />
              </Switch>
            </div>

          : 

            <div>
              <span>{i18n.t("profile.following")} {user.num_of_following_topics}</span>&nbsp;&nbsp;&nbsp;

              <span>{i18n.t("profile.numOfVotes")} {user.num_of_votes}</span>

              <div style={{ float: 'right', textAlign: 'right' }}><small>{i18n.t("profile.joined")} {user.created_at.slice(0, 10)}</small></div>
            </div>
          }
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
  },
  editProfile: {
    // border: '',
    fontSize: 16,
    transform: 'translateY(-20px)',
    backgroudColor: 'blue',
    float: 'right' as const,
    textAlign: 'right' as const,
  },
  editProfileItem: {
    margin: 10,
    padding: 10,
    width: '40ch'
  },
  editProfileTextArea: {
    width: '80%'
  }
}


export default Profile;