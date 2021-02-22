import React from 'react';
import * as styles from '../css/Header.module.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import ListIcon from '@material-ui/icons/List';
import i18n from "../helpers/i18n";

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
    this.setState({ mediaQuery: window.matchMedia('(min-width: 500px)')});
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

    if(val === "/login") {
      if (typeof window !== 'undefined') {localStorage.removeItem("jwt")};
      if (typeof window !== 'undefined') {localStorage.removeItem("user")};
      this.props.history.push(`${val}`);
      return
    }

    if (val !== "none") {
      this.props.history.push(`${val}`);
      return
    }
  };

  searchBar = () => {

    const searchWidth = this.state.mediaQuery.matches ? "35ch" : "60%" ;
    return (
      <form style={{ display: "inline", width: '100%' }} onSubmit={e => this.searchSubmit(e)}>
        <span style={{ border: 'solid', borderWidth: 1, backgroundColor: 'white', borderRadius: 10, padding: 6}}>
          {/* <SearchIcon  /> */}
        <input maxLength={50} type="text" 
        style={{ border: 'none', width: searchWidth, outline: 'none', backgroundColor: 'white' }}
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
                <MenuItem onClick={e => this.handleClose(e, "/profile/following")}>{i18n.t('settingBar.profile')}</MenuItem>
                {/* <MenuItem onClick={e => this.handleClose(e, "/group/list")}>{i18n.t('settingBar.groupList')}</MenuItem> */}
                {/* <MenuItem onClick={e => this.handleClose(e, "/group/create")}>{i18n.t('settingBar.groupCreate')}</MenuItem> */}
                <MenuItem onClick={e => this.handleClose(e, "/tos")}>{i18n.t('settingBar.tos')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/privacy")}>{i18n.t('settingBar.privacy')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/settings")}>{i18n.t('settingBar.settings')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/login")}>{i18n.t('settingBar.logout')}</MenuItem>
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
                <MenuItem onClick={e => this.handleClose(e, "/tos")}>{i18n.t('settingBar.tos')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/privacy")}>{i18n.t('settingBar.privacy')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/login")}>{i18n.t('settingBar.login')}</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/signup")}>{i18n.t('settingBar.signup')}</MenuItem>
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
      <div style={{textAlign: "left", display: 'inline', width: '100%'}}>
        <br></br>
        <Link to="/" className={styles.hearvo}>
          <b style={{ fontSize: 20, marginLeft: 10}}>{i18n.t("header.title")}</b>
        </Link><span>&nbsp;&nbsp;&nbsp;</span><small className={styles.remark} >{i18n.t("header.subtitle")}</small>

        <span style={{ float: "right", textAlign: 'right', marginTop: -4 }} >
          <span style={{width: '100%'}}>{this.searchBar()}</span>
          {this.state.isLoaded ? this.listBar() : this.beforeLoginListbar() }
        </span>


        <br></br><br></br>
      </div>
    )
  }
}

 


export default withRouter(HeaderChild);