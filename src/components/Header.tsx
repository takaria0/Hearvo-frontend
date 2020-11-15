import React from 'react';
import Profile from './Profile';

import { Button } from '@material-ui/core';
import * as styles from '../css/Header.module.css';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'



const Header = () => {

  return (
    <div className={styles.header}>
      
      <Profile></Profile>
    </div>
  )
}

export default Header;