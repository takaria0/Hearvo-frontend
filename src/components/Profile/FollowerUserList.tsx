
import React, { useState, useEffect } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import i18n from "../../helpers/i18n";
import styled from 'styled-components';

interface FollowerUserListProps {
  userInfoId: number;
}

const FollowerUserList = (props: FollowerUserListProps) => {

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

  return (
    <UserListDiv>
      Follower User List
      {userList.followers.map(((user: any) => {
        return (<ItemDiv>{user.user_info.profile_name}</ItemDiv>)
      }))}
    </UserListDiv>
  )
}


const UserListDiv = styled.div`
border: none;
font-size: 20px;
text-align: left;
`

const ItemDiv = styled.div`
`


export default FollowerUserList;