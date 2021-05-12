import React, { useState } from 'react';
import axios from '../Api';

import * as styles from '../../css/Home.module.css';
import { getJwt } from '../../helpers/jwt';
import Dialog from '@material-ui/core/Dialog';
import Header from '../Header/Header';
import SideBar from '../SideBar/SideBar';
import i18n from "../../helpers/i18n";
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
        <h1>{i18n.t('group.groupCreateTitle1')}{groupName}{i18n.t('group.groupCreateTitle2')}</h1>
        {i18n.t('group.groupCreateDescription')}
        <div style={{ marginTop: 10, wordWrap: "break-word" }}> {groupLink}<div><button style={{ marginTop: 10, textAlign: 'center' }} onClick={e => copy(e, groupLink)}>{i18n.t('group.groupLinkCopy')}</button></div></div>
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
      setError(i18n.t('group.enterGroupName'));
      setSuccess(false);
      return
    }
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.post("/groups", { title: groupName }, options)
      .then((res: any) => {
        const link = res.data.link;
        const baseLink = window.location.hostname === "localhost" ? 
          window.location.protocol + "//" + window.location.hostname + ":3000" + "/group/invite/" : window.location.protocol + "//" + window.location.hostname + "/group/invite/"

        setGroupLink(baseLink + link);
        setMessage(i18n.t('group.createdGroup'));
        setSuccess(true);
      }).catch((res: any) => {
        setError(i18n.t('group.failedToCreateGroup'));
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
            <h1>{i18n.t("group.createGroup")}</h1>
            <div style={{ border: 'none' }}>{i18n.t("group.createGroupDesc")}</div>
            <form onSubmit={e => submit(e)} style={{textAlign: 'center'}}><br></br>
              <input maxLength={20} style={{ padding: 5, width: 200 }} onChange={e => onChangeGroupName(e)}></input>
              <div style={{ marginTop: 10 }}>
                <button>{i18n.t("group.create")}</button>
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