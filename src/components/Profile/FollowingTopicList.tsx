import React, { useState, useEffect } from 'react';
import axios from '../Api';
import * as styles from '../css/Home.module.css';
import { Link } from 'react-router-dom'
import { getJwt } from '../../helpers/jwt';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import Feed from '../Feed/Feed';
import TopicFollowButtonLoaded from '../Topic/TopicFollowButtonLoaded';
import i18n from "../../helpers/i18n";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';


const FollowingTopicList = (props: any) => {
  const jwt = getJwt();
  let options = {};
  if (!jwt) {
    options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
  } else {
    options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
  }
  const [topicList, setTopicList] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`/topics/users?id=${props.userInfoId}`, options)
      .then(res => {
        setTopicList(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      })
  }, []);

  if(isLoading) {
    const skeletonList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    return (
      <div>
        {skeletonList.map((elem: any) => (
          <SkeletonTheme color="#FFFFFF" highlightColor="#E2E2E2">
            <p style={{ border: 'solid', borderWidth: 1, borderRadius: 6 }}><Skeleton duration={0.8} height={50} /></p>
          </SkeletonTheme>
        ))}
      </div>
    )}

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


export default FollowingTopicList;