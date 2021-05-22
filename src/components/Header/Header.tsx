import React from "react";
import HeaderChild from "./HeaderChild";
import * as styles from "../../css/Header.module.css";

const Header = () => {
  return (
    <div>
      <div className={styles.header}>
        <HeaderChild></HeaderChild>
      </div>
    </div>
  );
};

export default Header;
