import React, { useState, useEffect } from 'react';


import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import Header from './Header';
import axios from './Api';
import { getJwt } from '../helpers/jwt';
import i18n from "../helpers/i18n";
import TopicFollowButton from './TopicFollowButton';

const DetailInfo = (props: any) => {

  return (
    <div style={{  marginTop: 20, borderWidth: 2, borderRadius: 5, backgroundColor: 'white', padding: 5}}>
      <small><Link to="/tos">{i18n.t("sidebar.tos")}</Link>  <Link to="/privacy">{i18n.t("sidebar.privacy")}</Link></small>
  </div>
  )
}


const SideBar = (props: any) => {

  const [popularTopic, setPopularTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwt = getJwt();
    axios.get("/topics?sidebar=true", { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
    .then(res => {
      setPopularTopic(res.data);
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
    }) 
    
  }, []);

  if (isLoading) {return (<div><h3>{i18n.t("sidebar.trending")}</h3></div>)}

  return (
    <div>
      <h3>{i18n.t("sidebar.trending")}</h3>
      <div style={{ fontFamily:'monospace, serif', border: 'none', borderWidth: 2, borderRadius: 5, backgroundColor: 'white'}}>
      
        <div style={{padding: 10, paddingTop: 10, paddingBottom: 20}}>
        {popularTopic.map((elem: any, idx: number) => {
          return (
            <div style={{ height: '45px', border: 'none', borderWidth: '1px', paddingRight: 5, paddingBottom: 0, marginBottom: 5, borderRadius: 10, paddingLeft: 5}}>
              <Link to={`/topic?tp=${elem.topic}`} style={{ textDecoration: 'none', }}>
                <span>{idx + 1} {elem.topic}</span></Link> 
              <span style={{float: 'right', textAlign: 'right'}}>
                <TopicFollowButton topicWord={elem.topic}></TopicFollowButton>
                
                </span>
              <div style={{ paddingBottom: 3}}></div>
              <hr></hr>
          </div>)
        })}
        </div>
      </div>
      <DetailInfo></DetailInfo>
    </div>
  )
}

export default SideBar;