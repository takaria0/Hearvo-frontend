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
import i18n from "../helpers/i18n";

interface GroupInviteProps {

}



const GroupInvite = (props: GroupInviteProps) => {
  const jwt = getJwt();
  const [groupName, setGroupName] = useState("");
  const [success, setSuccess] = useState(false);
  const [groupLink, setGroupLink] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const { link } = useParams<string>();

  const submit = (e: any) => {
    e.preventDefault();
    setSuccess(false); setError(""); setMessage("");
    if (groupName.length < 1) {
      setError(i18n.t('group.enterGroupName'));
      setSuccess(false);
      return
    }
    axios.post(`/groups/users`, { link }, { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY, } })
      .then((res: any) => {
        const title = res.data.title;
        setGroupName(title);
        setMessage(i18n.t('group.joined'));
        setSuccess(true);
      }).catch((res: any) => {
        setError(i18n.t('group.failedToJoin'));
        setSuccess(false);
      });
  };

  useEffect(() => {
    axios.get(`/groups?link=${link}`, { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY, } })
      .then((res: any) => {
        const title = res.data.title;
        setGroupName(title);
        setAlreadyJoined(res.data.already_joined);
        setIsLoading(false);
      }).catch((res: any) => {});
  });

  if(isLoading) {
    return (<div></div>)
  } else {
    return (
      <div>
        <Header></Header>
        <div style={{textAlign: 'center'}}>
          <h1>{i18n.t('group.joinGroup')}</h1>
        <form onSubmit={e => submit(e)}>
            <h2>{i18n.t('group.group')} {groupName}</h2>
            <div>{alreadyJoined ? i18n.t('group.alreadyJoined') : <button>{i18n.t('group.join')}</button>}</div>
        </form>
        <div style={{ color: "red" }}>{error ? error : ""}</div>
        <div style={{ color: "black" }}>{message ? message : ""}</div>
        </div>
      </div>
    )
  }
};

export default GroupInvite;