import { Group } from "@material-ui/icons"
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from './Api';

import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../helpers/jwt';
import { RouteComponentProps, Link, Redirect, withRouter, useParams } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog';
import { submit_button } from "../css/Feed/PostContent.module.css";
import Header from './Header';

interface GroupListProps {

}



const GroupList = (props: GroupListProps) => {
  const jwt = getJwt();
  const [groupList, setGroupList] = useState([]);
  const [success, setSuccess] = useState(false);
  const [groupLink, setGroupLink] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const { link } = useParams<string>();

  const submit = (e: any, groupId: number) => {
    e.preventDefault();
    // axios.delete("/groups/users", { headers: { 'Authorization': `Bearer ${jwt}`, } })
    // .then(res => {

    // })

  };

  useEffect(() => {
    axios.get(`/groups`, { headers: { 'Authorization': `Bearer ${jwt}`, } })
      .then((res: any) => {
        const groupList = res.data;
        setGroupList(groupList);
        setIsLoading(false);
      }).catch((res: any) => {console.log(res)});
  }, []);

  if(isLoading) {
    return (<div>Loading</div>)
  } else {
    return (
      <div><Header></Header>
        <h1>グループ一覧</h1>
        {groupList.map((elem: any) => {
          const baseLink = window.location.hostname === "localhost" ?
            window.location.protocol + "//" + window.location.hostname + ":3000" + "/group/invite/" : window.location.protocol + "//" + window.location.hostname + "/group/invite/"
          return (<div><Link to={`/group/${elem.id}/feed`}>{elem.title}</Link> ユーザー数 {elem.num_of_users} 投稿数 {elem.num_of_posts} <button onSubmit={e => submit(e, elem.id)}>退出する</button><div>招待リンク {baseLink + elem.link}</div> </div>)
        })}
      </div>
    )
  }
};

export default GroupList;