import React from 'react';

// import NewPostContent from './Feed/NewPostContent';
import * as styles from '../css/Home.module.css';
import BaseHeader from './Feed/BaseHeader';

const Home = (props: any) => {
  return (
    <div className={styles.body}>
      <BaseHeader keyword={props.match.params.keyword}></BaseHeader>
    </div>
  )
}

export default Home;