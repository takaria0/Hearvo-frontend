import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom'; 
import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';
import { withRouter } from 'react-router-dom'
import Header from './Header';
import SideBar from './SideBar'

const Home = (props: any) => {

  return (
    <div>
      <Header></Header>
      <div className={styles.body}>
        <div className={styles.feed}>
          <BaseHeader />
      </div>
        <div className={styles.side_bar}>
          <SideBar></SideBar>
      </div>
    </div>
    </div>
  )
}

export default withRouter(Home);