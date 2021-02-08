import React, { ReactComponentElement } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';

import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, TextField, Fab, Input, Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import * as styles from '../../css/Feed/PostContent.module.css';
import PostContent from './PostContent';
import CloseIcon from '@material-ui/icons/Close';
import TodayIcon from '@material-ui/icons/Today';

export interface BaseHeaderProps extends RouteComponentProps<{}> {
  keyword: string;
}
 
export interface BaseHeaderState {
  edit: boolean;
  anchorEl: any;
  searchValue: string;
  isLogin: boolean;
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
    }
  }

  componentDidMount = () => {
    const jwt = getJwt();
    axios.get(`/users`, { headers: { Authorization: `Bearer ${jwt}` } }).then((res: any) => {
      this.setState({
        isLogin: true,
      });
    }).catch((err: any) => {

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
    if(this.state.isLogin) {
      this.setState({
        edit: edit,
      })
    } else {
      this.props.history.push("/login");
    }
  }








  headerJSX = () => {
    if (this.state.edit) {
      return (
        <div className={styles.mini_header}>
          {/* <Link to="/intro" style={{margin:10, padding: 10, textAlign: "center", marginRight: "auto", marginLeft: "auto"}}>開発状況</Link> */}
          <div className={styles.mini_header_inside}>
            <Link to="/popular">人気</Link> <Link to="/latest">最新</Link>{"    "} 


            {(window.location.pathname.split("/")[1] === "popular"|| window.location.pathname === "/") ?
              <b><button style={{ textDecoration: "none"}}　aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                 <TodayIcon style={{fontSize: 16}}/>
              </button>
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  keepMounted
                  open={Boolean(this.state.anchorEl)}
                  onClose={e => this.handleClose(e, "")}
                >
                  <MenuItem onClick={e => this.handleClose(e, "now")}>今</MenuItem>
                  <MenuItem onClick={e => this.handleClose(e, "today")}>今日</MenuItem>
                  <MenuItem onClick={e => this.handleClose(e, "week")}>今週</MenuItem>
                  <MenuItem onClick={e => this.handleClose(e, "month")}>今月</MenuItem>
                </Menu></b>
            : ""}
            
            <span style={{ float: "right", textAlign: "right" }}><button onClick={e => this.editHandle(e, false)}><CloseIcon style={{ fontSize: 16 }}></CloseIcon></button></span>
            
          </div>
        </div>
      )
    } else {
      return (
        <div className={styles.mini_header}>
          {/* <Link to="/intro" style={{margin:10, padding: 10, textAlign: "center", marginRight: "auto", marginLeft: "auto"}}>開発状況</Link> */}
          <div className={styles.mini_header_inside}>

            <Link to="/popular" >人気</Link> <Link to="/latest">最新</Link>{"    "} {(window.location.pathname.split("/")[1] === "popular" || window.location.pathname === "/") ? 
              <b><button style={{ textDecoration: "none" }} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                 <TodayIcon style={{fontSize: 16}}/>
              </button>
              <Menu
                id="simple-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={Boolean(this.state.anchorEl)}
                onClose={e => this.handleClose(e, "")}
              >
                <MenuItem onClick={e => this.handleClose(e, "now")}>今</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "today")}>今日</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "week")}>今週</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "month")}>今月</MenuItem>
                </Menu></b>
              : ""}
              

            <span style={{ float: "right", textAlign: "right" }}>

            {/* <form style={{ display: "inline" }} onSubmit={e => this.searchSubmit(e)}> */}

            
              <button onClick={e => this.editHandle(e, true)}><CreateIcon style={{ fontSize: 16 }}></CreateIcon></button>
              
              </span>

          </div>
        </div>
      )
    }
  }

  render() { 
    return ( 
      <div>
        <div>{this.headerJSX()}</div>
        <PostContent isLogin={this.state.isLogin} edit={this.state.edit} editParentHandle={this.editHandle} keyword={this.props.keyword}></PostContent>
      </div>
     );
  }
}

export default withRouter(BaseHeader);
