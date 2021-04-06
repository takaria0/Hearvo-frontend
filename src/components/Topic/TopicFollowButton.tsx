import React, { useState, useEffect } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import i18n from "../../helpers/i18n";


const TopicFollowButton = (props: any) => {

  const jwt = getJwt();
  const [isFollowed, setIsFollowed] = useState(false);
  const [topicId, setTopicId] = useState(0);
  const [resData, setResData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  let options = {};
  if (!jwt) {
    options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
  } else {
    options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
  }
  useEffect(() => {
    
    axios.get(`/topics/users?topic_word=${props.topicWord}`, options)
      .then(res => {
        setIsFollowed(false);
        if(res.data.following) {
          setIsFollowed(true);
        }
        setTopicId(res.data.topic_id);
        setResData(res.data);
        setIsLoading(false);
      }).catch(err => {
        setIsLoading(true);
      })

  }, [props.topicWord]);

  const follow = (e: any) => {
    axios.post("/topics/users", { topic_id_list: [topicId] }, options)
    .then(res => {
      setIsFollowed(true);
    })
    .catch(err => {

    })
  }

  const unfollow = (e: any) => {
    axios.delete("/topics/users", { data: { topic_id_list: [topicId] }, ...options })
      .then(res => {
        setIsFollowed(false);
      })
      .catch(err => {

      })
  }

  if (isLoading) { return (<span></span>) }
  const unfollowButtonStyle = { marginTop: 0, fontSize: 16, border: 'solid', color:'white', backgroundColor: '#01B1F8', borderWidth: 1, borderRadius: 5, paddingTop: 2, paddingBottom: 2 };
  const followButtonStyle = { marginTop: 0, fontSize: 16, border: 'solid', color: '#01B1F8', borderColor:'#01B1F8', backgroundColor: 'white', borderWidth: 1, borderRadius: 5, paddingTop: 2, paddingBottom: 2 };
  if(isFollowed) {
    return (
      <span>&nbsp;&nbsp;&nbsp;
        <button style={unfollowButtonStyle} onClick={e => unfollow(e)}>{i18n.t("topicFollow.unfollow")}</button>
        {/* {resData.num_of_posts} | {resData.num_of_users} */}
      </span>
    )
  }

  return (
    <span>&nbsp;&nbsp;&nbsp;
      <button style={followButtonStyle} onClick={e => follow(e)}>{i18n.t("topicFollow.follow")}</button>
      {/* {resData.num_of_posts} | {resData.num_of_users} */}
    </span>
  )
}

export default TopicFollowButton;