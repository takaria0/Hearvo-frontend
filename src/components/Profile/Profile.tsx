import React, { useState, useEffect } from 'react';
import axios from '../Api';
import * as styles from '../../css/Home.module.css';
import { Link } from 'react-router-dom'
import { getJwt } from '../../helpers/jwt';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import ProfileDetail from './ProfileDetail';
import TopicFollowButtonLoaded from '../Topic/TopicFollowButtonLoaded';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import i18n from "../../helpers/i18n";
import { DialogTitle, Dialog, DialogContent, TextareaAutosize } from '@material-ui/core';
import { storage } from '../../helpers/firebase';
import UserFollowButton from '../utils/UserFollowButton';
import FollowingUserList from './FollowingUserList';
import FollowerUserList from './FollowerUserList';
import FollowingTopicList from './FollowingTopicList';
import Feed from '../Feed/Feed';


const ProfileImage = (props: any) => {
  return (
      <img width="100px" height="100px" src={props.userInfo.profile_img_url || "http://via.placeholder.com/300"} alt="firebase-image" />
  )
}

const UploadImage = (props: any) => {
  const [image, setImage] = useState<any>({});
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${props.userInfo.id}_${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(`${props.userInfo.id}_${image.name}`)
          .getDownloadURL()
          .then(async url => {
            setUrl(url);
            const jwt = getJwt();
            let options = {};
            if (!jwt) {
              options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
            } else {
              options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
            }
            await axios.put("/users?edit_profile_img=true", { profile_img_url: url }, options)
            .then(res => {
              localStorage.setItem("user", JSON.stringify(res.data));
            })
            .catch(err => {})
          });
      }
    );
  };

  console.log("image: ", image);

  return (
    <div>
      {/* <progress value={progress} max="100" /> */}
      {props.myprofile ? <span><input type="file" accept="image/*" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button></span>
      :
      ""}
      <br></br>
      <img width="100px" height="100px" src={url || props.userInfo.profile_img_url || "http://via.placeholder.com/300"} alt="firebase-image" />
    </div>
  );
};



const EditProfile = (props: any) => {
  const [modal, setModal] = useState(false);
  const [profileName, setProfileName] = useState(props.userInfo.profile_name);
  const [description, setDescription] = useState(props.userInfo.description);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = () => {
    const data = { profile_name: profileName, description: description };
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.put("/users?edit_profile=true", data, options)
    .then(res => {
      setModal(false);
    })
    .catch(err => {
      setErrorMessage(i18n.t("profile.nameInUse"));
    })
  }

  const onClose = () => {
    setModal(false);
    setErrorMessage("");
    setProfileName(props.userInfo.profile_name);
    setDescription(props.userInfo.description);
  }

  useEffect(() => {
  }, [errorMessage])

  return (
    <div>
      <button onClick={() => setModal(true)} style={inlineStyles.editProfile}>{i18n.t("profile.editProfile")}</button>

      <Dialog open={modal} onClose={onClose}>
        <DialogTitle>{i18n.t("profile.editProfile")}</DialogTitle>
        <DialogContent>
          <UploadImage userInfo={props.userInfo}　myprofile={props.userInfo.myprofile}/>

          <div style={inlineStyles.editProfileItem}>
            <div>{i18n.t("profile.realName")}</div>
            {props.userInfo.first_name} {props.userInfo.middle_name} {props.userInfo.last_name}
          </div>
          <div style={inlineStyles.editProfileItem}>
            <div>{i18n.t("profile.userName")}</div>
            <input style={inlineStyles.editProfileTextArea} value={profileName} onChange={(e) => setProfileName(e.target.value)}></input>
          </div>
          <div style={inlineStyles.editProfileItem}>
            <div>{i18n.t("profile.Bio")}</div>
            <TextareaAutosize style={inlineStyles.editProfileTextArea} rows={5} value={description} onChange={(e) => setDescription(e.target.value)}></TextareaAutosize>
          </div>
          <div style={inlineStyles.editProfileItem}>
            <button onClick={onSubmit} style={inlineStyles.saveButton}>{i18n.t("profile.save")}</button>
          </div>
          <div style={inlineStyles.editProfileItemError}>
            {errorMessage}
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
  const [userInfo, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const keywordArray = window.location.pathname.split("/");


  useEffect(() => {
    // setUser(JSON.parse(localStorage.getItem("userInfo") || "{}"));
    axios.get(`/users?name=${props.match.params.name}`, options)
      .then(res => {
        setUser(res.data);
        setIsLoading(false);
        console.log(res.data);
      })
      .catch(err => {
        setIsLoading(false);
      })
  }, [props.match.params.name]);

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
          <ProfileImage userInfo={userInfo}/>
          <div style={inlineStyles.realName}>{userInfo.first_name} {userInfo.middle_name} {userInfo.last_name}</div>
          {userInfo.myprofile ? <EditProfile userInfo={userInfo}/> : "" }
          <div style={inlineStyles.profileName}>@{userInfo.profile_name}</div>
          <div style={inlineStyles.description}>{userInfo.description}</div>
          <div style={inlineStyles.noDescription}>{!userInfo.description && userInfo.myprofile ? i18n.t("profile.enterBio") : ""}</div>
          <div style={{ float: 'right', textAlign: 'right' }}>
            <small>{i18n.t("profile.joined")} {userInfo.created_at.slice(0, 10)}</small>
          </div>

          <div style={{marginTop: 2}}>
            <Link style={{ textDecoration: 'none' }} to={"/profile/" + userInfo.name + "/following"}>
              {userInfo.num_of_following_users} {i18n.t("profile.followingUsers")}
            </Link>&nbsp;&nbsp;&nbsp;
            <Link style={{ textDecoration: 'none' }} to={"/profile/" + userInfo.name + "/followers"}>
              {userInfo.num_of_followers} {i18n.t("profile.followerUsers")} 
            </Link>&nbsp;&nbsp;&nbsp;
            <Link style={{ textDecoration: 'none' }} to={"/profile/" + userInfo.name + "/topics"}>
              {userInfo.num_of_following_topics} {i18n.t("profile.following")} 
            </Link>&nbsp;&nbsp;&nbsp;
            <Link style={{ textDecoration: 'none' }} to={"/profile/" + userInfo.name + "/voted"}>
              {userInfo.num_of_votes} {i18n.t("profile.numOfVotes")} 
            </Link>
          </div>

          {userInfo.myprofile ?　
          <div></div>　:
          <UserFollowButton userInfoId={userInfo.user_info_id} hasFollowed={userInfo.has_followed}/>}

          <ProfileDetail userInfo={userInfo} />

          <Switch>
            <Route path={props.match.url + "/following"} key="following" render={(props) => 
              <FollowingUserList userInfoId={userInfo.user_info_id}  />} 
            />
            <Route path={props.match.url + "/followers"} key="followers" render={(props) => 
              <FollowerUserList userInfoId={userInfo.user_info_id}  />} 
            />
            <Route path={props.match.url + "/topics"} key="topics" render={(props) => 
              <FollowingTopicList userInfoId={userInfo.user_info_id} />} 
            />
            <Route path={props.match.url + "/voted"} key="voted" render={(props) => 
              <Feed isLogin={true} isPosted={false} isPostedHandeler={null}></Feed>} 
            />
            <Route path={props.match.url + "/posts"} key="posts" render={(props) => 
              <Feed isLogin={true} isPosted={false} isPostedHandeler={null}></Feed>} 
            />
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
  },
  description: {
    color: 'black',
    marginTop: 20
  },
  noDescription: {
    color: 'dimgray',
    marginTop: 20
  },
  editProfile: {
    // border: '',
    fontSize: 16,
    borderRadius: 20,
    padding: 5,
    paddingRight: 20,
    paddingLeft: 20,
    border: 'none',
    outline: 'none',
    transform: 'translateY(-20px)',
    backgroundColor: '#3477cc',
    color: 'white',
    float: 'right' as const,
    textAlign: 'right' as const,
  },
  saveButton: {
    // border: '',
    fontSize: 16,
    borderRadius: 20,
    padding: 5,
    paddingRight: 20,
    paddingLeft: 20,
    border: 'none',
    outline: 'none',
    transform: 'translateY(-20px)',
    backgroundColor: '#3477cc',
    color: 'white',
    float: 'left' as const,
    textAlign: 'left' as const,
  },
  editProfileItem: {
    margin: 10,
    padding: 10,
    width: '40ch'
  },
  editProfileItemError: {
    margin: 10,
    padding: 10,
    width: '40ch',
    color: 'red'
  },
  editProfileTextArea: {
    width: '80%'
  }
}


export default Profile;