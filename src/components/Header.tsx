import React from 'react';
import HeaderChild from './HeaderChild';
import * as styles from '../css/Header.module.css';



const Header = () => {

  return (
    <div>
    <div className={styles.header}>
      <div className={styles.header_inside}>
        <HeaderChild></HeaderChild>
      </div>
    </div>
    </div>
  )
}

export default Header;