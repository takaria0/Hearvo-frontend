import React from 'react';
import NewFeed from './Feed/NewFeed';
// import NewPostContent from './Feed/NewPostContent';
import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';

const Home = (props: any) => {
  return (
    <div className={styles.body}>
      <BaseHeader></BaseHeader>
      <NewFeed keyword={props.match.params.keyword}></NewFeed>
    </div>
  )
}

export default Home;