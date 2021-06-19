import React from 'react';
import * as styles from '../../css/Header.module.css';
import { Button, Menu, MenuItem, Paper, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { getJwt } from '../../helpers/jwt';
import axios from '../Api';
import ListIcon from '@material-ui/icons/List';
import i18n from "../../helpers/i18n";

import BaseHeader from '../Feed/BaseHeader';
import PostContent from '../Feed/PostContent';

import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import HelpIcon from '@material-ui/icons/Help';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import NewReleasesOutlinedIcon from '@material-ui/icons/NewReleasesOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';



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
  edit: boolean;
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
      edit: false,
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
    this.setState({ mediaQuery: window.matchMedia('(min-width: 800px)') });
    const jwt = getJwt();
    let userObj = {};
    if (typeof window !== 'undefined') { userObj = JSON.parse(localStorage.getItem("user") || "{}") };
    this.setState({ user: userObj });

    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.get(`/users`, options).then((res: any) => {
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

    if (val === "/login") {
      if (typeof window !== 'undefined') { localStorage.removeItem("jwt") };
      if (typeof window !== 'undefined') { localStorage.removeItem("user") };

      if (url[1] === "") {
        this.props.history.push(`${val}`);
      } else if (url[2] != null) {
        this.props.history.push(`${val}` + "?destination=" + url[1] + '&value=' + url[2]);
      } else {
        this.props.history.push(`${val}`);
      }
      return
    }

    if (val !== "none") {
      if (url[1] === "") {
        this.props.history.push(`${val}`);
      } else if (url[2] != null) {
        this.props.history.push(`${val}` + "?destination=" + url[1] + '&value=' + url[2]);
      } else {
        this.props.history.push(`${val}`);
      }
      return
    }
  };

  editHandle = (e: any, edit: boolean) => {
    e.preventDefault();
    if (this.state.isLogin) {
      this.setState({
        edit: edit,
      })
    } else {
      this.props.history.push("/login");
    }
  }

  searchBar = () => {
    const display = this.state.mediaQuery.matches ? "inline" : "none";
    // const searchWidth = this.state.mediaQuery.matches ? "60ch" : "60%" ;
    return (
      <form onSubmit={e => this.searchSubmit(e)}>
        <span style={{ display: display, border: 'solid', borderWidth: 1, backgroundColor: 'white', borderRadius: 5, padding: 6, marginLeft: '10px' }}>
          {/* <SearchIcon style={{padding: 0}} /> */}
          <input maxLength={50} type="text"
            style={{ border: 'none', width: "100%", outline: 'none', backgroundColor: 'white' }}
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
                <button style={inlineStyles.profileSection} onClick={e => this.handleClose(e, "/profile/" + this.state.user.name + "/posts")}>
                  <div style={inlineStyles.realName}>{this.state.user.first_name} {this.state.user.middle_name} {this.state.user.last_name}</div>
                  <div style={inlineStyles.profileName}>@{this.state.user.profile_name}</div>
                </button>
                {/* <MenuItem onClick={e => this.handleClose(e, "/profile/following")}><AccountCircleIcon />&nbsp; */}
                {/* <div>{this.state.user.profile_name}</div> / {this.state.user.first_name} {this.state.user.middle_name} {this.state.user.last_name}</MenuItem> */}
                {/* <MenuItem onClick={e => this.handleClose(e, "/group/list")}>{i18n.t('settingBar.groupList')}</MenuItem> */}
                {/* <MenuItem onClick={e => this.handleClose(e, "/group/create")}>{i18n.t('settingBar.groupCreate')}</MenuItem> */}
                {/* <MenuItem onClick={e => this.handleClose(e, "/help")}><HelpIcon />&nbsp;{i18n.t('settingBar.help')}</MenuItem> */}
                <MenuItem onClick={e => this.handleClose(e, "/tos")}><DescriptionIcon />&nbsp;{i18n.t('settingBar.tos')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/privacy")}><AssignmentIndIcon />&nbsp;{i18n.t('settingBar.privacy')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/settings")}><SettingsIcon />&nbsp;{i18n.t('settingBar.settings')}</MenuItem>
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
                {/* <MenuItem onClick={e => this.handleClose(e, "/help")}><HelpIcon />&nbsp;{i18n.t('settingBar.help')}</MenuItem> */}
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
        <ListIcon style={{ padding: 0 }}></ListIcon>
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
        <span style={{ height: '10px' }}></span>
        <div style={{ display: 'flex', flexWrap: 'nowrap', marginRight: '100px' }}>
          <div style={{ zIndex: 3 }}>
            <Link to="/" className={styles.hearvo}>
              <b style={{ fontSize: 20, marginLeft: 10 }}>{i18n.t("header.title")}</b>
            </Link><span>&nbsp;&nbsp;&nbsp;</span><small className={styles.remark} >{i18n.t("header.subtitle")}</small></div>
          {/* <span style={{ float: "right", textAlign: 'right', marginTop: -4 }} > */}
          <div style={{ display: 'flex', position: 'fixed', right: '0px' }}>
            <div style={{ transform: 'translateY(5px)', marginRight: '4vw', paddingRight: '4vw', width: '25vw' }}>
              {this.searchBar()}
            </div>
            <div className={styles.header_items}>
              <Button href="/latest" className={window.location.pathname === "/latest" ? styles.now : styles.normal} disableRipple={true}>
                <NewReleasesOutlinedIcon />
              </Button>
              <Button href="/recommend" className={window.location.pathname.includes("recommend") ? styles.now : styles.normal} disableRipple={true}>
                <PersonOutlineIcon />
              </Button>
              <Button href="/popular" className={window.location.pathname.includes("popular") ? styles.now : styles.normal} disableRipple={true}>
                <TrendingUpIcon />
              </Button>
            </div>
            {/* <Button>
            <CreateIcon style={{transform: 'translateY(-4px)'}}></CreateIcon>
            </Button> */}
            <span style={{ transform: 'translateY(-3px)' }}>
              {this.state.isLoaded ? this.listBar() : this.beforeLoginListbar()}
            </span>
          </div>
        </div>
        {/* </span> */}
      </div>
    )
  }
}


const inlineStyles = {
  profileSection: {
    margin: 10,
    backgroundColor: 'white',
    border: 'none',
    textAlign: 'left' as const,
    outline: 'none'
  },
  realName: {
    fontSize: '1.5em',
    fontWeight: 'bold' as const,
    marginBottom: 1,
  },
  profileName: {
    fontSize: 'small',
    color: 'dimgray',
    marginBottom: 10,
  }
}

export default withRouter(HeaderChild);