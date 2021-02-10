import React, { useState, useEffect } from 'react';


import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import Header from './Header';
import axios from './Api';
import { getJwt } from '../helpers/jwt';

const DetailInfo = (props: any) => {

  return (
    <div style={{  marginTop: 20, borderWidth: 2, borderRadius: 5, backgroundColor: 'white', padding: 5}}>
      <small><Link to="/tos">利用規約</Link>  <Link to="/privacy">プライバシーポリシー</Link></small>
  </div>
  )
}


const SideBar = (props: any) => {

  const [popularTopic, setPopularTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwt = getJwt();
    axios.get("/topics?sidebar=true", { headers: { Authorization: `Bearer ${jwt}` } })
    .then(res => {
      setPopularTopic(res.data);
      setIsLoading(false);
    }).catch(err => {
      setIsLoading(false);
    }) 
    
  }, []);

  if (isLoading) {return (<div><h3>人気のトピック</h3></div>)}

  return (
    <div>
      <h3>人気のトピック</h3>
      <div style={{ border: 'none', borderWidth: 2, borderRadius: 5, backgroundColor: 'white'}}>
      
        <div style={{padding: 10, paddingTop: 10, paddingBottom: 20}}>
        {popularTopic.map((elem: any, idx: number) => {
          return (
          <div style={{paddingLeft: 20, paddingTop: 5, marginBottom: 5}}>
              <Link to={`/topic?tp=${elem.topic}`} style={{ textDecoration: 'none', }}>
                <div>{idx+1} {elem.topic} </div>
              </Link>
          </div>)
        })}
        </div>
      </div>
      <DetailInfo></DetailInfo>
    </div>
  )
}

export default SideBar;