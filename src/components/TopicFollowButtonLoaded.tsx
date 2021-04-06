import React, { useState, useEffect } from 'react';
import axios from './Api';
import { getJwt } from '../helpers/jwt';
import i18n from "../helpers/i18n";

interface TopicFollowButtonLoadedProps {
  isFollowed: boolean;
  topicWord: string;
}

const TopicFollowButtonLoaded = (props: TopicFollowButtonLoadedProps) => {

  const jwt = getJwt();
  const [isFollowed, setIsFollowed] = useState(props.isFollowed);
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
        if (res.data.following) {
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
    axios.delete("/topics/users", { data: { topic_id_list: [topicId] }, ...options})
      .then(res => {
        setIsFollowed(false);
      })
      .catch(err => {

      })
  }

  const unfollowButtonStyle = { marginTop: 0, fontSize: 16, border: 'solid', color: 'white', backgroundColor: '#01B1F8', borderWidth: 1, borderRadius: 5, paddingTop: 2, paddingBottom: 2 };
  const followButtonStyle = { marginTop: 0, fontSize: 16, border: 'solid', color: '#01B1F8', borderColor: '#01B1F8', backgroundColor: 'white', borderWidth: 1, borderRadius: 5, paddingTop: 2, paddingBottom: 2 };




  switch (isFollowed) {
    case true:
      return (
        <span>&nbsp;&nbsp;&nbsp;
          <button style={unfollowButtonStyle} onClick={e => unfollow(e)}>{i18n.t("topicFollow.unfollow")}</button>
          {/* {resData.num_of_posts} | {resData.num_of_users} */}
        </span>
      )
      break;

    case false:
      return (
        <span>&nbsp;&nbsp;&nbsp;
          <button style={followButtonStyle} onClick={e => follow(e)}>{i18n.t("topicFollow.follow")}</button>
          {/* {resData.num_of_posts} | {resData.num_of_users} */}
        </span>
      )
      break;
  }
}


export default TopicFollowButtonLoaded;