import React from 'react';
import * as styles from '../css/Header.module.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
 


type userObject = {
  id: string;
  name: string;
  email: string;
  description: string;
  string_id: string;
  created_at: string;
  updated_at: string;
} 

interface ProfileProps {

}

interface ProfileState {
  user?: userObject;
}
 
class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    const userObj: userObject = JSON.parse(localStorage.getItem("user") || "{}");
    this.state = {
      user: userObj
    }
    
  }

  componentDidMount() {

  }

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

        <span style={{ float: "right", marginRight: 20 }} >
          <Link to="/profile" className={styles.profile} >{this.state.user?.name}<span>&nbsp;&nbsp;&nbsp;</span></Link><Link to='/login' className={styles.profile}><button className={styles.profile} onClick={e => logout(e)} style={{ textTransform: "lowercase" }}>ログアウト</button>
          </Link></span>

        <br></br><br></br>
      </div>
    )
  }
}

 


export default Profile;