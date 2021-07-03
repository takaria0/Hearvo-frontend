
import React, { useState, useEffect } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import i18n from "../../helpers/i18n";
import styled from 'styled-components';
import MiniProfileIcon from '../utils/MiniProfileIcon';
import UserFollowButton from '../utils/UserFollowButton';

interface UserListProps {
  userInfoId: number;
  feedType: "following" | "follower";
}

const UserList = (props: UserListProps) => {

  const jwt = getJwt();
  const [userList, setUserList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  let options = {};
  if (!jwt) {
    options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
  } else {
    options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
  }
  useEffect(() => {
    axios.get(`/users/followings?id=${props.userInfoId}`, options)
    .then(res => {
      setUserList(res.data);
      setIsLoading(false);
    })
    .catch(err => {
      setIsLoading(false);
    })
  }, []);

  if (isLoading) return (<span></span>);

  if(props.feedType === "following") {
    return (
      <UserListDiv>
        {userList.followings.map(((user: any) => {
          return (
          <ItemDiv>
            <ItemInnerDiv>
              <MiniProfileIcon imgUrl={user.user_info.profile_img_url} />
              <UserNameSpan>{user.user_info.profile_name}</UserNameSpan>
              <UserFollowButtonSpan>
                <UserFollowButton hasFollowed={true} userInfoId={user.user_info.id}/>
              </UserFollowButtonSpan>
            </ItemInnerDiv>
          </ItemDiv>
          )
        }))}
      </UserListDiv>
    )
  }

  if(props.feedType === "follower") {
    return (
      <UserListDiv>
        {userList.followers.map(((user: any) => {
          return (
          <ItemDiv>
            <ItemInnerDiv>
              <MiniProfileIcon imgUrl={user.user_info.profile_img_url} />
              <UserNameSpan>{user.user_info.profile_name}</UserNameSpan>
              <UserFollowButtonSpan>
                <UserFollowButton hasFollowed={true} userInfoId={user.user_info.id}/>
              </UserFollowButtonSpan>
            </ItemInnerDiv>
          </ItemDiv>
          )
        }))}
      </UserListDiv>
    )
  }

  return (<div></div>)
}


const UserNameSpan = styled.span`
margin-left: 10px;
`

const UserFollowButtonSpan = styled.span`
text-align: right;
float: right;
`

const UserListDiv = styled.div`
`

const ItemDiv = styled.div`
border: solid 1px black;
border-width: 0px 0px 1px 0px;
font-size: 20px;
display: block;
`

const ItemInnerDiv = styled.div`
padding: 10px 10px 10px 10px;
`


export default UserList;