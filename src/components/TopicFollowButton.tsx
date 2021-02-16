import React, { useState, useEffect } from 'react';


import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import Header from './Header';
import axios from './Api';
import { getJwt } from '../helpers/jwt';
import { ChangeHistory } from '@material-ui/icons';
import i18n from "../helpers/i18n";


const TopicFollowButton = (props: any) => {

  const jwt = getJwt();
  const [isFollowed, setIsFollowed] = useState(false);
  const [topicId, setTopicId] = useState(0);
  const [resData, setResData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    axios.get(`/topics/users?topic_word=${props.topicWord}`, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
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
    axios.post("/topics/users", { topic_id_list: [topicId] }, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
    .then(res => {
      setIsFollowed(true);
    })
    .catch(err => {

    })
  }

  const unfollow = (e: any) => {
    axios.delete("/topics/users", { data: { topic_id_list: [topicId] },  headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then(res => {
        setIsFollowed(false);
      })
      .catch(err => {

      })
  }

  if (isLoading) { return (<span></span>) }

  const buttonStyle = { marginTop: -10, border: 'solid', borderWidth: 1, borderRadius: 5, paddingTop: 2, paddingBottom: 2 };
  if(isFollowed) {
    return (
      <span>&nbsp;&nbsp;&nbsp;
        <button style={buttonStyle} onClick={e => unfollow(e)}>{i18n.t("topicFollow.unfollow")}</button>
        {/* {resData.num_of_posts} | {resData.num_of_users} */}
      </span>
    )
  }

  return (
    <span>&nbsp;&nbsp;&nbsp;
      <button style={buttonStyle} onClick={e => follow(e)}>{i18n.t("topicFollow.follow")}</button>
      {/* {resData.num_of_posts} | {resData.num_of_users} */}
    </span>
  )
}

export default TopicFollowButton;