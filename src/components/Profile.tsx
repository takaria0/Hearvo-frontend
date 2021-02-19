import React from 'react';
import * as styles from '../css/Header.module.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { withRouter, RouteComponentProps, Link, Redirect } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import ListIcon from '@material-ui/icons/List';
// import { useTranslation } from "react-i18next";
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

interface ProfileProps extends RouteComponentProps<{}> {

}

interface ProfileState {
  user?: userObject;
  anchorEl: any;
  isLogin: boolean;
  isLoaded: boolean;
  searchValue: string;
}
 
class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    const userObj: userObject = JSON.parse(localStorage.getItem("user") || "{}");
    this.state = {
      user: userObj,
      anchorEl: 0,
      isLogin: false,
      isLoaded: false,
      searchValue: "",
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
    const jwt = getJwt();
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
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      this.props.history.push(`${val}`);
      return
    }

    if (val !== "none") {
      this.props.history.push(`${val}`);
      return
    }
  };

  searchBar = () => {
    return (
      <form style={{ display: "inline", width: '100%' }} onSubmit={e => this.searchSubmit(e)}>
        <input type="text" style={{ width: '60%', padding: '3px' }} className={styles.search_bar} value={this.state.searchValue} onChange={e => this.searchChange(e)} placeholder={i18n.t("header.search")}
        ></input>
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

 


export default withRouter(Profile);