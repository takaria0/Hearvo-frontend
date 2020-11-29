import React from 'react';

// import NewPostContent from './Feed/NewPostContent';
import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import Header from './Header';

const Home = (props: any) => {
  return (
    <div>
      <Header></Header>
    <div className={styles.body}>
      <BaseHeader keyword={props.match.params.keyword}></BaseHeader>
    </div>
    </div>
  )
}

export default withRouter(Home);