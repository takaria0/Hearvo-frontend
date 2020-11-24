import React from 'react';
import * as styles from '../css/Header.module.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { withRouter, RouteComponentProps, Link, Redirect } from 'react-router-dom'
 


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
}
 
class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    const userObj: userObject = JSON.parse(localStorage.getItem("user") || "{}");
    this.state = {
      user: userObj,
      anchorEl: 0,
    }
    
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
    if (val !== "none") {
      this.props.history.push(`${val}`);
    }
  };

  render() {
    const logout = (e: any) => {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      <Redirect to="/login" />
      return;
    };

    return (
      <div style={{textAlign: "left"}}>
        <br></br>
          {/* <MenuItem component={Link} to={'/'}>Hearbo</MenuItem> */}

        <Link to="/" className={styles.hearvo} ><b style={{ fontSize: 20, marginLeft: 10, marginTop: 20 }}>Hearvo</b></Link><span>&nbsp;&nbsp;&nbsp;</span><small>your voice must be heard</small>

        <span style={{ float: "right", marginRight: 10, marginLeft: 10 }} >

            {/* <Link to="/profile" className={styles.profile} >{this.state.user?.name}<span>&nbsp;&nbsp;&nbsp;</span></Link>
            <Link to="/profile/feed/myposts" className={styles.profile} >自分の投稿<span>&nbsp;&nbsp;&nbsp;</span></Link>
            <Link to="/profile/feed/voted" className={styles.profile} >投票した投稿<span>&nbsp;&nbsp;&nbsp;</span></Link> */}

          <b><Button className={styles.profile} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
             プロフィール
              </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={e => this.handleClose(e, "none")}
            >
              <MenuItem onClick={e => this.handleClose(e, "/profile")}>{this.state.user?.name}</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/profile/feed/myposts")}>自分の投稿</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/profile/feed/voted")}>投票した投稿</MenuItem>
            </Menu></b>

          
          <Link to='/login' className={styles.profile}><button className={styles.profile} onClick={e => logout(e)} style={{ textTransform: "lowercase" }}>ログアウト</button>
          </Link></span>

        <br></br><br></br>
      </div>
    )
  }
}

 


export default withRouter(Profile);