import React from 'react';

// import PostContent from './Feed/PostContent';
import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import Header from './Header';
import SideBar from './SideBar'
import i18n from "../helpers/i18n";

const Home = (props: any) => {
  return (
    <div>
      <Header></Header>
      <div className={styles.body}>
        <div className={styles.feed}>
          <BaseHeader keyword={props.match.params.keyword}></BaseHeader>
      </div>
        <div className={styles.side_bar}>
          <SideBar></SideBar>
      </div>
    </div>
    </div>
  )
}

export default withRouter(Home);