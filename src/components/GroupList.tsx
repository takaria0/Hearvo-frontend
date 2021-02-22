import React, { useEffect, useState } from 'react';
import axios from './Api';

import * as styles from '../css/Home.module.css';
import { getJwt } from '../helpers/jwt';
import { Link, useParams } from 'react-router-dom'
import Header from './Header';
import SideBar from './SideBar';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import i18n from "../helpers/i18n";
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
  // const [maxWidth, setMaxWidh] = useState(false);
  const { link } = useParams<string>();

  const submit = (e: any, groupId: number) => {
    e.preventDefault();
    // axios.delete("/groups/users", { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY, } })
    // .then(res => {

    // })

  };

  const copy = (e: any, value: string) => {
    navigator.clipboard.writeText(value);
  };
  
  let maxWidth:any;
  
  useEffect(() => {
    axios.get(`/groups?order_by=latest`, { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY, } })
      .then((res: any) => {
        const groupList = res.data;
        setGroupList(groupList);
        setIsLoading(false);
        // maxWidth = window.matchMedia("(max-width: 700px)")
      }).catch((res: any) => {

      });
  }, []);


  

  if(isLoading) {
    return (<div><Header></Header></div>)
  } else {
    return (
      <div>
        <Header></Header>

      <div className={styles.body}>
        <div className={styles.feed}>

            <div style={{ paddingLeft: 2, wordWrap: "break-word" }}>
              <h1>{i18n.t("group.groupList")}</h1>
              {groupList.map((elem: any) => {
                const baseLink = window.location.hostname === "localhost" ?
                  window.location.protocol + "//" + window.location.hostname + ":3000" + "/group/invite/" : window.location.protocol + "//" + window.location.hostname + "/group/invite/"
                return (
                  <div style={{ padding: 10, paddingBottom:  20, marginBottom: 5, borderStyle: "solid", borderRadius: 5, borderWidth: 1 }}>
                    <Link to={`/group/${elem.id}/feed`}><b>{elem.title}</b></Link>
                    <div><span>{i18n.t("group.usersNum")} {elem.num_of_users} {i18n.t("group.postsNum")} {elem.num_of_posts}&nbsp;&nbsp;</span>
                      <span style={{ float: "right", textAlign: "right" }}>

                        <div>
                            <button onClick={e => copy(e, baseLink + elem.link)}>
                            {maxWidth ? i18n.t("group.groupLinkCopy")  : <FileCopyIcon style={{padding: 0}}></FileCopyIcon>}
                            </button>&nbsp;&nbsp;
                          <button onSubmit={e => submit(e, elem.id)}>{i18n.t("group.left")}</button>
                        </div>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

        </div>
        <div className={styles.side_bar}>
          <SideBar></SideBar>
        </div>
      </div>

      </div>
    )
  }
};

export default GroupList;