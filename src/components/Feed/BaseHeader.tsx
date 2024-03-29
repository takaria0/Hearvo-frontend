import React, { ReactComponentElement } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';

import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, TextField, Fab, Input, Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import * as styles from '../../css/PostContent.module.css';
import PostContent from './PostContent';
import CloseIcon from '@material-ui/icons/Close';
import TodayIcon from '@material-ui/icons/Today';

import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import NewReleasesOutlinedIcon from '@material-ui/icons/NewReleasesOutlined';
import AddBoxIcon from '@material-ui/icons/AddBox';
import i18n from "../../helpers/i18n";



export interface BaseHeaderProps extends RouteComponentProps<{}> {
  // keyword: string;
}
 
export interface BaseHeaderState {
  edit: boolean;
  anchorEl: any;
  searchValue: string;
  isLogin: boolean;
  isLoading: boolean;
  userObj: any;
}

function timeout(delay: number) {
  return new Promise(res => setTimeout(res, delay));
}
class BaseHeader extends React.Component<BaseHeaderProps, BaseHeaderState> {

  constructor(props: any) {
    super(props);

    this.state = {
      edit: false,
      anchorEl: 0,
      searchValue: "",
      isLogin: false,
      isLoading: true,
      userObj: {},
    }
  }

  searchTime =() =>{
    const pathaName = window.location.pathname.split("/");
    let searchTime = pathaName.pop();

    switch (searchTime){
      case "now":
        searchTime= i18n.t("feed.now");
        break;
      case "today":
        searchTime= i18n.t("feed.today");
        break;
      case "week":
        searchTime= i18n.t("feed.thisWeek");
        break;
      case "month":
        searchTime= i18n.t("feed.thisMonth");
        break;
      default:
        searchTime= i18n.t("feed.thisWeek");
    }
    return searchTime;
  } 

  componentDidMount = () => {
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.get(`/users`, options).then((res: any) => {
      this.setState({
        isLogin: true,
        isLoading: false,
      });
    }).catch((err: any) => {
      this.setState({
        isLoading: false,
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
    this.props.history.push(`/popular/${val}`);
  };


  editHandle = (e: any, edit: boolean) => {
    e.preventDefault();
    const element = document.getElementById('form');
    if(this.state.isLogin) {
      this.setState({
        edit: edit,
      })
    } else {
      this.props.history.push("/login");
    }
    element?.blur();　//inputのfocusをはずす
  }

   

  headerJSX = () => {
    const usualStyle = {
      border: 'none', color: 'black', borderRadius: "100px",
      backgroundColor: "white", outline: 'none', textTransform: 'none'
    } as React.CSSProperties;
    const pushedStyle = {
      border: 'none', color: 'black', borderRadius: "100px",
      backgroundColor: "#ebebeb", outline: 'none', textTransform: 'none'
    } as React.CSSProperties;
      return (
        <div className={styles.mini_header}>
          <div className={styles.header_box} onClick={e => this.editHandle(e, true)}>
            <input placeholder={i18n.t("newPost.create")} type='text' id='form'></input>
          </div>
          <div className={styles.mini_header_inside}>
            <span　className={styles.mini_header_item}>
                <Button href="/latest" 
                style={window.location.pathname.includes("latest") ? pushedStyle : usualStyle }
                disableRipple={true}><NewReleasesOutlinedIcon/>&nbsp;{i18n.t("feed.latest")}</Button>

                &nbsp;{this.state.userObj ? <Button href="/recommend"
                style={window.location.pathname.includes("recommend") ? pushedStyle : usualStyle }
                disableRipple={true}><PersonOutlineIcon/>&nbsp;{i18n.t("feed.recommend")}</Button> : ""}

                &nbsp;<Button href="/popular" 
                style={window.location.pathname.includes("popular") ? pushedStyle : usualStyle }
                disableRipple={true}><TrendingUpIcon/>&nbsp;{i18n.t("feed.popular")}</Button> 
                &nbsp; 
            </span>

            {(window.location.pathname.split("/")[1] === "popular") ?
              <b><Button 
                onClick={this.handleClick} 
                disableRipple={true}
                style={pushedStyle}
              >
                 {this.searchTime()}   {/* default = thisWeek */}
              </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  keepMounted
                  open={Boolean(this.state.anchorEl)}
                  onClose={e => this.handleClose(e, "")}
                >
                  <MenuItem onClick={e => this.handleClose(e, "now")}>{i18n.t("feed.now")}</MenuItem>
                  <MenuItem onClick={e => this.handleClose(e, "today")}>{i18n.t("feed.today")}</MenuItem>
                  <MenuItem onClick={e => this.handleClose(e, "week")}>{i18n.t("feed.thisWeek")}</MenuItem>
                  <MenuItem onClick={e => this.handleClose(e, "month")}>{i18n.t("feed.thisMonth")}</MenuItem>
                </Menu></b>
            : ""}
            
            {/* {this.state.edit ? 
              <span style={{ float: "right", textAlign: "right" }}><button onClick={e => this.editHandle(e, false)}><CloseIcon style={{ fontSize: 16 }}></CloseIcon></button></span>
              :
              <span style={{ float: "right", textAlign: "right" }}>
                <button onClick={e => this.editHandle(e, true)}><CreateIcon style={{ fontSize: 16 }}></CreateIcon></button></span>
              } */}
          </div>
        </div>
      )
  }

  render() { 
    return ( 
      <div>
        {/* <span >New<Link to="/help"> Hearvoとは何か</Link></span> */}

        <div>{this.headerJSX()}</div>
        <PostContent isLogin={this.state.isLogin} edit={this.state.edit} editParentHandle={this.editHandle}></PostContent>
      </div>
     );
  }
}

  export default withRouter(BaseHeader);
