import React from 'react';
import NewFeed from './Feed/NewFeed';
import PostContent from './Feed/PostContent';
import * as styles from '../css/Home.module.css';

const Home = (props: any) => {
  return (
    <div className={styles.body}>
      
      <PostContent></PostContent>
      <NewFeed keyword={props.match.params.keyword}></NewFeed>
    </div>
  )
}

export default Home;