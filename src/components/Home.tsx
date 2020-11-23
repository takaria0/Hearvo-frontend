import React from 'react';

// import NewPostContent from './Feed/NewPostContent';
import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'

const Home = (props: any) => {
  return (
    <div>
      <Link to="/intro" style={{margin:10, padding: 10, textAlign: "center", marginRight: "auto", marginLeft: "auto"}}>はじめに</Link>
    
    <div className={styles.body}>
      <BaseHeader keyword={props.match.params.keyword}></BaseHeader>
    </div>
    </div>
  )
}

export default Home;