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
          {/* <Switch>
            <Route path={props.match.url} component={BaseHeader} key="home" />
            <Route path={ props.match.url + "latest"}  component={BaseHeader} key="latest-home" />
            <Route path={props.match.url + "topic"} component={BaseHeader} key="topic-home" />
            <Route path={props.match.url + "popular"} component={BaseHeader} key="popular-home" />
            <Route path={props.match.url + "popular/:time"}  component={BaseHeader} key="popular-time-home" />
            <Route path={props.match.url + "search"}  component={BaseHeader} key="search-home" />
          </Switch> */}
      </div>
        <div className={styles.side_bar}>
          <SideBar></SideBar>
      </div>
    </div>
    </div>
  )
}

export default withRouter(Home);