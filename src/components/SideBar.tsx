import React, { useState, useEffect } from 'react';


import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import Header from './Header';
import axios from './Api';
import { getJwt } from '../helpers/jwt';

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

  if(isLoading) {return (<span></span>)}

  return (
    <div>
      <h3>人気のトピック</h3>
      <div style={{ border: 'none', borderWidth: 2, borderRadius: 5, backgroundColor: 'white'}}>
      
        <div>
        {popularTopic.map((elem: any) => {
          return (
          <div style={{paddingLeft: 5, paddingTop: 5}}>
              <Link to={`/topic?tp=${elem.topic}`} style={{ textDecoration: 'none', }}>
                <div>{elem.topic} {elem.num_of_posts}</div>
              </Link>
          </div>)
        })}
        </div>
      </div>
    </div>
  )
}

export default SideBar;