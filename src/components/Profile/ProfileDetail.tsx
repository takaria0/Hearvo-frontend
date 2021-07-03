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
import CloseUsers from './CloseUsers';


const ProfileDetail = (props: any) => {
  const keywordArray = window.location.pathname.split("/");


  const voteRecordStyle = keywordArray.includes("voted") ?
   { textDecoration: 'underline', } :
   { textDecoration: 'none' }

  const postsStyle = keywordArray.includes("posts") ?
   { textDecoration: 'underline', } :
   { textDecoration: 'none' }

  return (
    <div>
        <CloseUsers userInfo={props.userInfo} />
          <div style={{ marginTop:10, backgroundColor: 'white', borderRadius: 5, border: 'solid', borderWidth: 1, paddingTop: 10, paddingBottom: 10, display: 'flex', justifyContent: 'space-evenly'}}>
            <span style={{backgroundColor: 'white'}}>
          <Link style={voteRecordStyle} to={"/profile/" + keywordArray[2] + "/voted"}>{i18n.t("profile.voteRecord")}</Link>
            </span>&nbsp;
            <span>
              <Link style={postsStyle} to={"/profile/" + keywordArray[2] + "/posts"}>{i18n.t("profile.myPost")}</Link>
            </span>
          </div>

      </div>
  )
}



export default ProfileDetail;