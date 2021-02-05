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

  const copy = (e: any, value: string) => {
    navigator.clipboard.writeText(value);
  };
  

  useEffect(() => {
    axios.get(`/groups?order_by=latest`, { headers: { 'Authorization': `Bearer ${jwt}`, } })
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
      <div style={{ paddingLeft: 20, wordWrap: "break-word"}}>

      
        <h1>グループ一覧</h1>
        {groupList.map((elem: any) => {
          const baseLink = window.location.hostname === "localhost" ?
            window.location.protocol + "//" + window.location.hostname + ":3000" + "/group/invite/" : window.location.protocol + "//" + window.location.hostname + "/group/invite/"
          return (
            <div style={{ padding: 10,marginBottom: 5,borderStyle: "solid", borderRadius: 5, borderWidth: 1}}>
              <Link to={`/group/${elem.id}/feed`}><b>{elem.title}</b></Link> 
              <div><span>ユーザー数 {elem.num_of_users} 投稿数 {elem.num_of_posts}&nbsp;&nbsp;</span>
                <span style={{ float: "right", textAlign: "right" }}>
              <button onClick={e => copy(e, baseLink + elem.link)}>招待リンクをコピー</button>&nbsp;&nbsp;
               <button onSubmit={e => submit(e, elem.id)}>退出する</button>
              </span>
              </div>
               </div>
          )
        })}
        </div>
      </div>
    )
  }
};

export default GroupList;