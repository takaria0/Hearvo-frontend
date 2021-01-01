import React from 'react';
import axios from './Api';
// import * as styles from '../css/Settings.module.css';
import { Button, Input } from '@material-ui/core';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';



interface SettingsProps {

}

interface SettingsState {
  isAccountDelete: boolean;
}

class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);

    this.state = {
      isAccountDelete: false,
    }
    document.title = "Settings";
  }

  componentDidMount() {

  }

  // submit(e: any) {
  //   e.preventDefault();
  //   const jwt = getJwt();
  //   // console.log("postObj", postObj);
  //   axios.delete("/users", { headers: { Authorization: `Bearer ${jwt}` } })
  //     .then((res: any) => {
  //       // console.log("success res",res)
  //       this.setState({
  //         editSuccess: true,
  //       })
  //     }).catch((res: any) => {
  //       // console.log("failed res", res)
  //     });
  // }

  boolChange(e: any, field: string) {
    e.preventDefault();
    const value = eval('this.state.' + field);
    this.setState({
      [field]: !value,
    } as unknown as SettingsState)

  }

  click(e: any, value: boolean) {
    e.preventDefault();
    // this.setState({
    //   edit: value,
    // })
  }

  renderPasswordChange = () => {
    return (
      <div>
        <form>
        <div style={{  margin: '10px'}}>
          <input type='password' placeholder='現在のパスワード' style={{ width: '200px', padding: '5px' }}></input>
        </div>
        <div style={{  margin: '10px' }}>
          <input type='password' placeholder='変更後のパスワード' style={{ width: '200px', padding: '5px' }}></input>
        </div>
        <div style={{  margin: '10px' }}>
          <input type='password' placeholder='変更後のパスワード（確認用）' style={{ width: '200px', padding: '5px' }}></input>
        </div>
        <button>変更</button>
        </form>
      </div>
    )
  }

  renderAccountDelete = () => {
    return (
      <div style={{ textAlign: 'left', margin: '10px' }}>
        Hearvoのアカウントを削除します。<b style={{color: 'red'}}>削除されたアカウントは、二度と復旧することができません。</b>削除する際にはよく確認してください。アカウントを削除した後のデータの扱いについては、<Link to='/privacy'>プライバシーポリシー</Link>をご覧ください。
        <form style={{textAlign: 'center'}}>
          <button style={{ border: 'none', color: 'white', backgroundColor: 'red', marginTop: '10px', padding: '10px', borderRadius: '5px' }}><b>アカウントを削除する</b></button>
        </form>
      </div>
    )
  }


  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <ul style={{ margin: '10px', padding: 0, textDecoration: "none"}}>

          <li style={{ textDecoration: "none" }}><h2>パスワード変更</h2></li>
          {this.renderPasswordChange()}
          <li style={{ textDecoration: "none" }} onClick={e => this.boolChange(e, 'isAccountDelete')}><h2>アカウント削除</h2></li>
          {this.renderAccountDelete()}
        </ul>
        <div>
          {/* {this.state.isAccountDelete ? this.renderAccountDelete() : ''} */}
        </div>
      </div>
    )
  }
}




export default Settings;