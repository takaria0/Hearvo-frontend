import React from 'react';
import axios from './Api';
// import * as styles from '../css/Settings.module.css';
import { Button, Input } from '@material-ui/core';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';



interface SettingsProps {

}

interface SettingsState {

}

class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);

    this.state = {

    }
    document.title = "Settings";
  }

  componentDidMount() {

  }

  submit(e: any) {
    e.preventDefault();
    const jwt = getJwt();
    // console.log("postObj", postObj);
    axios.delete("/users", { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res: any) => {
        // console.log("success res",res)
        this.setState({
          editSuccess: true,
        })
      }).catch((res: any) => {
        // console.log("failed res", res)
      });
  }

  change(e: any, field: string) {
    e.preventDefault();
    this.setState({
      [field]: e.target.value,
    } as unknown as SettingsState)

  }

  click(e: any, value: boolean) {
    e.preventDefault();
    // this.setState({
    //   edit: value,
    // })
  }




  render() {
    return (
      <div style={{textAlign: "center"}}>
        <ul style={{padding: 0, textDecoration: "none"}}>

          <li style={{ textDecoration: "none" }}>パスワード変更</li>
          <li style={{ textDecoration: "none" }}>アカウント削除</li>
        </ul>
      </div>
    )
  }
}




export default Settings;