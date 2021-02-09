import { Group } from "@material-ui/icons"
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from './Api';

import * as styles from '../css/Home.module.css';
import { getJwt } from '../helpers/jwt';
import { RouteComponentProps, Link, Redirect, withRouter } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog';
import { submit_button } from "../css/Feed/PostContent.module.css";
import Header from './Header';
import SideBar from './SideBar';

interface GroupCreateProps {

}



const CreatedMessage = (props: any) => {
  const groupLink = props.groupLink;
  const groupName = props.groupName;

  const [isOpen, setOpen] = useState(true);

  const copy = (e: any, value: string) => {
    navigator.clipboard.writeText(value);
    setOpen(false);
  };


  return (
    <Dialog open={isOpen}>
      {/* <form onSubmit={e => submit(e)}><button>戻る</button></form> */}
      <div style={{ margin: '10px',　padding: 30 }}>
        <h1>新たなグループ、「{groupName}」を作成しました！</h1>
        グループに参加した人だけが投票を見ることができ、グループ内だけでの投票が出来るようになります。
        以下の招待リンクをコピーして、友達を誘ってみましょう！
        <div style={{marginTop: 10, wordWrap: "break-word"}}> {groupLink}<div><button style={{marginTop: 10, textAlign: 'center'}} onClick={e => copy(e, groupLink)}>招待リンクをコピー</button></div></div>
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

      <div className={styles.body}>
        <div className={styles.feed}>

          <div style={{ paddingLeft: 0, wordWrap: "break-word", textAlign: 'left' }}>
            <h1>グループ作成</h1>
            <div style={{ border: 'none' }}>グループを作成すると、グループに参加した人だけが閲覧・投票出来る機能が利用できます。グループを作成すると招待リンクが発行され、メンバーを招待することが可能になります。招待リンクは、グループ一覧ページからも確認できます。</div>
            <form onSubmit={e => submit(e)} style={{textAlign: 'center'}}><br></br>
              <input style={{ padding: 5, width: 200 }} onChange={e => onChangeGroupName(e)}></input>
              <div style={{ marginTop: 10 }}>
                <button>作成</button>
              </div>
            </form>
            <div style={{ color: "red" }}>{error ? error : ""}</div>
            <div style={{ color: "black" }}>{message ? message : ""}</div>
            <div>{success ? <CreatedMessage groupLink={groupLink} groupName={groupName}></CreatedMessage> : ""}</div>
          </div>


        </div>
        <div className={styles.side_bar}>
          <SideBar></SideBar>
        </div>
      </div>

  

    </div>
  )

};

export default GroupCreate;