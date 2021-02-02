import { Group } from "@material-ui/icons"
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from './Api';

import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../helpers/jwt';
import { RouteComponentProps, Link, Redirect, withRouter } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog';
import { submit_button } from "../css/Feed/PostContent.module.css";
import Header from './Header';

interface GroupCreateProps {

}

const CreatedMessage = (groupLink: string) => {

  return (
    <Dialog open={true}>
      {/* <form onSubmit={e => submit(e)}><button>戻る</button></form> */}
      <div style={{ margin: '10px', textAlign: 'center' }}>
        <div>招待リンク <div>{groupLink}</div></div>
      </div>
    </Dialog>
  )
}

const GroupCreate = (props: GroupCreateProps) => {

  const [groupName, setGroupName] = useState("");
  const [success, setSuccess] = useState(false);
  const [groupLink, setGroupLink] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: any) => {
    e.preventDefault();
    setSuccess(false);setError("");setMessage("");
    if(groupName.length < 1) {
      setError("グループ名を入力してください");
      setSuccess(false);
      return
    }
    const jwt = getJwt();
    axios.post("/groups",{title: groupName},{headers: {'Authorization': `Bearer ${jwt}`,}})
      .then((res: any) => {
        console.log(res);
        const link = res.data.link;
        const baseLink = window.location.hostname === "localhost" ? 
          window.location.protocol + "//" + window.location.hostname + ":3000" + "/group/invite/" : window.location.protocol + "//" + window.location.hostname + "/group/invite/"

        setGroupLink(baseLink + link);
        setMessage("グループを作成しました");
        setSuccess(true);
      }).catch((res: any) => {
        console.log(res);
        setError("グループの作成に失敗しました");
        setSuccess(false);
      });
  };

  const onChangeGroupName = (e: any) => {
    setGroupName(e.target.value);
  }


  return (
    <div>
      <Header></Header>
      <h1>グループ作成</h1>
      <form onSubmit={e => submit(e)}>
        <input onChange={e => onChangeGroupName(e)}></input>
        <button>作成</button>
      </form>
      <div style={{color: "red"}}>{error ? error : ""}</div>
      <div style={{ color: "black" }}>{message ? message : ""}</div>
      <div>{success ? CreatedMessage(groupLink) : ""}</div>
    </div>
  )

};

export default GroupCreate;