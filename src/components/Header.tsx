import React from 'react';
import Profile from './Profile';

import { Button } from '@material-ui/core';
import * as styles from '../css/Header.module.css';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'



const Header = () => {

  return (
    <div>
    <div className={styles.header}>
      <div className={styles.header_inside}>
        <Profile></Profile>
      </div>
    </div>
    </div>
  )
}

export default Header;