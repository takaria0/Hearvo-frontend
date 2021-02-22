import React, { useState, useEffect } from 'react';
import axios from './Api';
import * as styles from '../css/Home.module.css';
import { Link } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';
import Header from './Header';
import SideBar from './SideBar';
import Feed from './Feed/Feed';
import TopicFollowButtonLoaded from './TopicFollowButtonLoaded';
import i18n from "../helpers/i18n";



const FollowingTopicList = (props: any) => {
  const jwt = getJwt();
  const [topicList, setTopicList] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/topics/users", { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then(res => {
        setTopicList(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      })
  }, []);

  if(isLoading) {return (<span></span>)}

  return (
    <div>
      {topicList.map((topic: any) => {
        return (
          <div style={{ padding: 10, border: 'solid', borderRadius: 5, borderWidth: 1, backgroundColor: 'white', marginTop: 5 }}>
          <div >
            <span>
            <Link style={{textDecoration: 'none'}} to={`/topic?tp=${topic.topic}`}>{topic.topic}</Link>
            </span>
              <span style={{ textAlign: 'right', float: 'right' }}>
                <TopicFollowButtonLoaded topicWord={topic.topic} isFollowed={true}></TopicFollowButtonLoaded>
              </span>

            <div>
                {/* <PostAddIcon style={{ fontSize: 16 }} /> */}
                {i18n.t("profile.topicPosts")}&nbsp; 
                {topic.num_of_posts} &nbsp;&nbsp; 
                {/* <PersonIcon style={{ fontSize: 16 }} /> */}
                {i18n.t("profile.topicFollowings")}&nbsp; 
                {topic.num_of_users} 
            </div>

          </div>
          
          </div>
        )
      })}
    </div>
  )
};


const ProfileDetail = (props: any) => {
  const jwt = getJwt();
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const keywordArray = window.location.pathname.split("/");



  const voteRecordStyle = keywordArray.includes("voted") ?
   { textDecoration: 'underline', } :
   { textDecoration: 'none' }

  const myPostsStyle = keywordArray.includes("myposts") ?
   { textDecoration: 'underline', } :
   { textDecoration: 'none' }

  return (
    <div>

          <div style={{ marginTop:10, backgroundColor: 'white', borderRadius: 5, border: 'solid', borderWidth: 1, paddingTop: 10, paddingBottom: 10, display: 'flex', justifyContent: 'space-evenly'}}>
            <span style={{backgroundColor: 'white'}}>
              <Link style={voteRecordStyle} to="/profile/voted">{i18n.t("profile.voteRecord")}</Link>
            </span>&nbsp;
            <span>
              <Link style={myPostsStyle} to="/profile/myposts">{i18n.t("profile.myPost")}</Link>
            </span>
          </div>


          <div>
            {keywordArray.includes("following") ?
              <FollowingTopicList></FollowingTopicList>
             : 
             <Feed isLogin={true} isPosted={false} isPostedHandeler={null}></Feed>}
            
          </div>

      </div>
  )
}



export default ProfileDetail;