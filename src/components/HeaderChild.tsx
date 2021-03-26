import React from 'react';
import * as styles from '../css/Header.module.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import ListIcon from '@material-ui/icons/List';
import i18n from "../helpers/i18n";

import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import HelpIcon from '@material-ui/icons/Help';

type userObject = {
  id: string;
  name: string;
  email: string;
  description: string;
  string_id: string;
  created_at: string;
  updated_at: string;
} 

interface HeaderChildProps extends RouteComponentProps<{}> {

}

interface HeaderChildState {
  user: any;
  anchorEl: any;
  isLogin: boolean;
  isLoaded: boolean;
  searchValue: string;
  mediaQuery: any;
}
 
class HeaderChild extends React.Component<HeaderChildProps, HeaderChildState> {
  constructor(props: HeaderChildProps) {
    super(props);

    this.state = {
      user: {},
      anchorEl: 0,
      isLogin: false,
      isLoaded: false,
      searchValue: "",
      mediaQuery: {},
    }
    
  }
  

  searchSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.searchValue !== "" && window.location.pathname !== "/search") {
      const searchWord = this.state.searchValue;
      this.props.history.push({
        pathname: '/search',
        search: `?q=${searchWord}`
      })
      this.setState({ searchValue: "" });
    }

    if (window.location.pathname === "/search") {
      const searchWord = this.state.searchValue;
      this.props.history.push({
        pathname: '/search',
        search: `?q=${searchWord}`
      })
      this.setState({ searchValue: "" });
    }
  }

  searchChange = (e: any) => {
    this.setState(
      { searchValue: e.target.value }
    )
  }

  componentDidMount = () => {
    this.setState({ mediaQuery: window.matchMedia('(min-width: 800px)')});
    const jwt = getJwt();
    let userObj = {};
    if (typeof window !== 'undefined') { userObj = JSON.parse(localStorage.getItem("user") || "{}") };
    this.setState({ user: userObj});
    axios.get(`/users`, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }).then((res: any) => {
      this.setState({
        isLogin: true,
        isLoaded: true
      });
    }).catch((err: any) => {
      this.setState({
        isLogin: false,
        isLoaded: true
      });
    })
  }

  handleClick = (event: any) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  };

  handleClose = (e: any, val: any) => {

    this.setState({
      anchorEl: 0
    })


    const url = window.location.pathname.split("/");
    // hearvo.com/posts/777 => url = { ,posts,777}

    if(val === "/login") {
      if (typeof window !== 'undefined') {localStorage.removeItem("jwt")};
      if (typeof window !== 'undefined') {localStorage.removeItem("user")};

      if (url[1] === ""){
        this.props.history.push(`${val}`);
      } else if (url[2] != null){
        this.props.history.push(`${val}`+"?destination="+url[1]+'&value='+url[2]);
      } else {
        this.props.history.push(`${val}`);
      }
      return
    }

    if (val !== "none") {
      if (url[1]===""){
        this.props.history.push(`${val}`);
      }else if (url[2] != null){
        this.props.history.push(`${val}`+"?destination="+url[1]+'&value='+url[2]);
      } else {
        this.props.history.push(`${val}`);
      }
      return
    }
  };

  searchBar = () => {
    const display = this.state.mediaQuery.matches ? "inline" : "none";
    // const searchWidth = this.state.mediaQuery.matches ? "60ch" : "60%" ;
    return (
      <form onSubmit={e => this.searchSubmit(e)}>
        <span style={{ display: display, border: 'solid', borderWidth: 1, backgroundColor: 'white', borderRadius: 10, padding: 6}}>
          {/* <SearchIcon style={{padding: 0}} /> */}
        <input maxLength={50} type="text" 
            style={{ border: 'none', width: "60ch", outline: 'none', backgroundColor: 'white' }}
         className={styles.search_bar} value={this.state.searchValue} onChange={e => this.searchChange(e)} placeholder={i18n.t("header.search")}
        ></input>
        </span>
      </form>
    )
  }

  listBar = () => {
    return (
      <b>
      {
        this.state.isLogin
          ?
          <b><Button className={styles.profile} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
              <ListIcon style={{ padding: 0 }} ></ListIcon>
          </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={e => this.handleClose(e, "none")}>
                <MenuItem onClick={e => this.handleClose(e, "/profile/following")}><AccountCircleIcon />&nbsp;{i18n.t('settingBar.profile')}</MenuItem>
                {/* <MenuItem onClick={e => this.handleClose(e, "/group/list")}>{i18n.t('settingBar.groupList')}</MenuItem> */}
                {/* <MenuItem onClick={e => this.handleClose(e, "/group/create")}>{i18n.t('settingBar.groupCreate')}</MenuItem> */}
                <MenuItem onClick={e => this.handleClose(e, "/help")}><HelpIcon />&nbsp;{i18n.t('settingBar.help')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/tos")}><DescriptionIcon />&nbsp;{i18n.t('settingBar.tos')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/privacy")}><AssignmentIndIcon />&nbsp;{i18n.t('settingBar.privacy')}</MenuItem>
                {/* <MenuItem onClick={e => this.handleClose(e, "/settings")}><SettingsIcon />&nbsp;{i18n.t('settingBar.settings')}</MenuItem> */}
                <MenuItem onClick={e => this.handleClose(e, "/login")}><ExitToAppIcon />&nbsp;{i18n.t('settingBar.logout')}</MenuItem>
            </Menu>
          </b>
          :
            <b><Button className={styles.profile} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
            <ListIcon ></ListIcon>
          </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={e => this.handleClose(e, "none")}>
                <MenuItem onClick={e => this.handleClose(e, "/help")}><HelpIcon />&nbsp;{i18n.t('settingBar.help')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/tos")}><DescriptionIcon />&nbsp;{i18n.t('settingBar.tos')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/privacy")}><AssignmentIndIcon />&nbsp;{i18n.t('settingBar.privacy')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/login")}><AccountCircleIcon />&nbsp;{i18n.t('settingBar.login')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/signup")}><PersonAddIcon />&nbsp;{i18n.t('settingBar.signup')}</MenuItem>
            </Menu>
          </b>
          // <Link to='/login' className={styles.profile}>ログイン</Link>
      }
      </b>
    )
  }

  beforeLoginListbar = () => {
    return (
      <b><Button className={styles.profile} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
        <ListIcon style={{padding: 0}}></ListIcon>
      </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={e => this.handleClose(e, "none")}>
        </Menu>
      </b>
    )
  }

  render() {

    return (
      <div style={{ transform: 'translateY(10px)' }}>
        <span style={{height: '10px'}}></span>
        <span style={{ display: 'flex', justifyContent: 'space-between'}}>
          <span>
          <Link to="/" className={styles.hearvo}>
            <b style={{ fontSize: 20, marginLeft: 10 }}>{i18n.t("header.title")}</b>
          </Link><span>&nbsp;&nbsp;&nbsp;</span><small className={styles.remark} >{i18n.t("header.subtitle")}</small></span>

          {/* <span style={{ float: "right", textAlign: 'right', marginTop: -4 }} > */}
          <span style={{ transform: 'translateY(5px)'}}>
            {this.searchBar()}
          </span>
          <span style={{ transform: 'translateY(-3px)' }}>
            {this.state.isLoaded ? this.listBar() : this.beforeLoginListbar()}
          </span>
        </span>
        {/* </span> */}
      </div>
    )
  }
}

 


export default withRouter(HeaderChild);