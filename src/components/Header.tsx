import React from 'react';
import Profile from './Profile';
import * as styles from '../css/Header.module.css';



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