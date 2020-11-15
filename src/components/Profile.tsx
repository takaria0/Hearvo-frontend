import React from 'react';
import * as styles from '../css/Header.module.css';
import { Button } from '@material-ui/core';
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
        <Link to="/" ><b>Hearvo</b></Link>

        <span style={{ float: "right"} }>
        <Link to='/login' ><Button onClick={e => logout(e)} style={{ textTransform: "lowercase"}}>ログアウト</Button>
        </Link><Link to="/profile">{this.state.user?.name}</Link></span>

      </div>
    )
  }
}

 


export default Profile;