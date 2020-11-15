import React from 'react';
import Feed from './Feed/Feed';
import PostContent from './Feed/PostContent';
import * as styles from '../css/Home.module.css';

const Home = (props: any) => {
  return (
    <div className={styles.body}>
      
      <PostContent></PostContent>
      <Feed keyword={props.match.params.keyword}></Feed>
    </div>
  )
}

export default Home;