import React, { Component } from 'react';
import axios from './Api';
import { RouteComponentProps, Link } from 'react-router-dom'
import { Button, TextField, Fab } from '@material-ui/core';
import * as styles from '../css/Login.module.css';
export interface SignupProps extends RouteComponentProps<{}> {
}

export interface SignupState {
  userName: string;
  email: string;
  password: string;
  passwordVerify: string;
  signupSuccessMessage: string;
  errorMessage: string;
}

class Signup extends React.Component<SignupProps, SignupState> {

  constructor(props: any) {
    super(props);

    this.state = {
      userName: "",
      email: "",
      password: "",
      passwordVerify: "",
      signupSuccessMessage: "",
      errorMessage: "",
    };
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    document.title = "Signup";
  }

  change(e: any, field: string) {

    this.setState({
      [field]: e.target.value,
    } as unknown as SignupState)

  }

  submit(e: any) {
    e.preventDefault();

    // need more elavorate password verification this.state.password === this.state.passwordVerify
    if(this.state.password.length < 8) {
      this.setState({
        errorMessage: "パスワードは8文字以上に設定してください"
      });
      return
    }

    if (this.state.passwordVerify.length < 8) {
      this.setState({
        errorMessage: "パスワードは8文字以上に設定してください"
      });
      return
    }


    if (this.state.password !== this.state.passwordVerify) {
      this.setState({
        errorMessage: "パスワードが異なっています"
      });
      return
    }

    const letters = /^[0-9a-zA-Z]+$/;
    if (!this.state.userName.match(letters)) {
      this.setState({
        errorMessage: "ユーザーネームには英数字を使用してください"
      });
      return
    }

    if (this.state.userName.length < 1){
      this.setState({
        errorMessage: "ユーザーネームを入力してください"
      });
      return
    }

    axios.post("/signup", {
      user_name: this.state.userName,
      email: this.state.email,
      password: this.state.password,
    }).then((res: any) => {
      localStorage.setItem("jwt", res.data.token);
      this.setState({
        signupSuccessMessage: "アカウントを作成しました",
      })
      function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
      }
      timeout(1000).then(() => { this.props.history.push("/login");})
      
    }).catch((err: any) => {
      // console.log("err.response", err.response)
      const resMessage = err.response.data.message;
      this.props.history.push("/signup");
      this.setState({
        signupSuccessMessage: `${resMessage}`,
      })
    })
    }

  render() {
    return (
      <div className={styles.body}>
        <h1>Hearvo</h1>
        <Link to="/intro">はじめに</Link>
        <div className={styles.body_inside}>
          
        <h2>Signup</h2>
        <form onSubmit={e => this.submit(e)}>
          <div>
            <div>ユーザーネーム</div>
            <input className={styles.email} minLength={1} maxLength={32} type="string" onChange={e => this.change(e, "userName")} value={this.state.userName} />
          </div>
          <div>
            <div>メールアドレス</div>
            <input className={styles.email} minLength={1} maxLength={300} type="email" onChange={e => this.change(e, "email")} value={this.state.email} />
          </div>
          <div>
          <div>パスワード</div>
            <input className={styles.email} minLength={8} maxLength={32} type="password" onChange={e => this.change(e, "password")} value={this.state.password} />
          </div>

          <div>
            <div>パスワード確認</div>
            <input className={styles.email} minLength={8} maxLength={32} type="password" onChange={e => this.change(e, "passwordVerify")} value={this.state.passwordVerify} />
          </div>
          <div className={styles.button} >
            <Button type="submit" value="Submit" variant="contained" color="primary" >Signup</Button>
          </div>

        </form>
        <div className={styles.email}>
          {this.state.errorMessage}
        </div>
        <div>
          {this.state.signupSuccessMessage}
        </div>
          <div className={styles.footer}>
          <Link to="/login">Login</Link>
      </div>
        </div>
      </div>
    );
  }
}

export default Signup;