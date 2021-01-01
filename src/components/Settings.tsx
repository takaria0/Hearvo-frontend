import React from 'react';
import axios from './Api';
// import * as styles from '../css/Settings.module.css';
import { Button, Input } from '@material-ui/core';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';
import Dialog from '@material-ui/core/Dialog';



interface SettingsProps extends RouteComponentProps<{}>{

}

interface SettingsState {
  isAccountDelete: boolean;
  confirmToggle: boolean;
  confirmPassword: string;
  responseMessage: string;
}

class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);

    this.state = {
      isAccountDelete: false,
      confirmToggle: false,
      confirmPassword: '',
      responseMessage: '',
    }
    document.title = "Settings";
  }

  componentDidMount() {

  }


  submitAcccountDelete(e: any) {
    e.preventDefault();
    const jwt = getJwt();
    const confirmPassword = this.state.confirmPassword;

    if (confirmPassword.length === 0) {
      this.setState({
        responseMessage: 'パスワードを入力してください'
      })
      return
    }


    if (confirmPassword.length < 8) {
      this.setState({
        responseMessage: 'パスワードは8文字以上です'
      })
      return
    }


    axios.delete("/users?", { headers: { Authorization: `Bearer ${jwt}`, confirmPassword: confirmPassword } })
      .then((res: any) => {
        this.setState({
          responseMessage: 'アカウントを削除しました'
        })
        localStorage.clear();
        this.props.history.push("/login");
      }).catch((res: any) => {
        this.setState({
          responseMessage: 'アカウントを削除できませんでした'
        })
      });
  }

  boolChange(e: any, field: string) {
    e.preventDefault();
    const value = eval('this.state.' + field);
    this.setState({
      [field]: !value,
    } as unknown as SettingsState)

  }

  change(e: any, field: string) {
    e.preventDefault();
    this.setState({
      [field]: e.target.value,
    } as unknown as SettingsState)
  }

  openConfirm = (e: any) => {
    e.preventDefault();
    this.setState({
      confirmToggle: true
    })
  }

  closeConfirm = (e: any) => {
    e.preventDefault();
    this.setState({
      confirmToggle: false,
      responseMessage: '',
      confirmPassword: ''
    })
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

// <form onSubmit={openConfirmationModal}
//    // ... form
// </ form>
    return (
      <div style={{ textAlign: 'left', margin: '10px' }}>
        Hearvoのアカウントを削除します。<b style={{color: 'red'}}>削除されたアカウントは、二度と復旧することができません。</b>削除する際にはよく確認してください。アカウントを削除した後のデータの扱いについては、<Link to='/privacy'>プライバシーポリシー</Link>をご覧ください。
        <form style={{textAlign: 'center'}} onSubmit={e => this.openConfirm(e)}>
          <button style={{ border: 'none', color: 'white', backgroundColor: 'red', marginTop: '10px', padding: '10px', borderRadius: '5px' }}><b>アカウントを削除する</b></button>
        </form>

        <Dialog  open={this.state.confirmToggle}>
          <div style={{ marginTop: '10px', textAlign: 'center'}}>
            確認のためにパスワードを入力してください。
            <form>
              <input style={{ padding: '10px', margin: '5px'}} type="password" value={this.state.confirmPassword} onChange={e => this.change(e, 'confirmPassword')}></input>
            </form>
          </div>
          <div style={{ fontSize: '20px', padding:'20px', margin:'5px'}}>本当にアカウントを削除しますか？二度と復旧は出来ません。</div>
          <div style={{textAlign: 'center', marginBottom: '10px'}}>
            <span>
              <button style={{ border: 'none', borderRadius: '5px', color: 'white', backgroundColor: 'red', width: '100px', padding: '10px', marginRight: '50px' }} onClick={e => this.submitAcccountDelete(e)}>はい</button>
          </span>
          <span>
              <button style={{ border: 'none', borderRadius: '5px', width: '100px', padding: '10px' }} onClick={e => this.closeConfirm(e)}>いいえ</button>
          </span>
          <div style={{ color: 'red', padding: '10px'}}>
            {this.state.responseMessage ? this.state.responseMessage : ''}
          </div>
          </div>
          </Dialog>

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