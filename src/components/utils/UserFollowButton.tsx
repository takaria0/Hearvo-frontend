import React, { useState, useEffect } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import i18n from "../../helpers/i18n";
import styled from 'styled-components';

interface UserFollowButtonProps {
  hasFollowed: boolean;
  userInfoId: number;
}

const UserFollowButton = (props: UserFollowButtonProps) => {

  const jwt = getJwt();
  const [hasFollowed, setIsFollowed] = useState(props.hasFollowed);
  const [resData, setResData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  let options = {};
  if (!jwt) {
    options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
  } else {
    options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
  }
  useEffect(() => {}, []);

  const follow = (e: any) => {
    axios.post("/users/followings", { user_info_id: props.userInfoId }, options)
      .then(res => {
        setIsFollowed(true);
      })
      .catch(err => {

      })
  }

  const unfollow = (e: any) => {
    axios.delete("/users/followings", { data: { user_info_id: props.userInfoId },  ...options})
      .then(res => {
        setIsFollowed(false);
      })
      .catch(err => {

      })
  }

  const unfollowButtonStyle = { marginTop: 0, fontSize: 20, border: 'solid', color: 'white', backgroundColor: '#01B1F8', borderWidth: 1, borderRadius: "100px", paddingTop: 5, paddingBottom: 5, paddingRight: 15, paddingLeft: 15 };
  const followButtonStyle = { marginTop: 0, fontSize: 20, border: 'solid', color: '#01B1F8', borderColor: '#01B1F8', backgroundColor: 'white', borderWidth: 1, borderRadius: "100px", paddingTop: 5, paddingBottom: 5, paddingRight: 15, paddingLeft: 15 };




  switch (hasFollowed) {
    case true:
      return (
        <FollowButtonDiv>
          <button style={unfollowButtonStyle} onClick={e => unfollow(e)}>{i18n.t("topicFollow.unfollow")}</button>
        </FollowButtonDiv>
      )
      break;

    case false:
      return (
        <FollowButtonDiv>
          <button style={followButtonStyle} onClick={e => follow(e)}>{i18n.t("topicFollow.follow")}</button>
        </FollowButtonDiv>
      )
      break;
    default:
      return (<span></span>)
  }
}


const FollowButtonDiv = styled.div`
padding: 10px 0 10px 0;
border: none;
font-size: 20px;
text-align: right;
`


export default UserFollowButton;