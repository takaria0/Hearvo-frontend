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
    if(
        this.state.password.length >= 8
        && this.state.passwordVerify.length >= 8
        && this.state.password === this.state.passwordVerify
      ) {

        axios.post("/signup", {
          user_name: this.state.userName,
          email: this.state.email,
          password: this.state.password,
        }).then((res: any) => {
          localStorage.setItem("jwt", res.data.token);
          this.setState({
            signupSuccessMessage: "success",
          })
          this.props.history.push("/login");
        }).catch((res: any) => {
          this.props.history.push("/signup");
          this.setState({
            signupSuccessMessage: "failed",
          })
        })
      } else {
        // console.log("Not Valid password")
      }
    }

  render() {
    return (
      <div className={styles.body}>
        <h1>Signup</h1>
        <form onSubmit={e => this.submit(e)}>
          <div>ユーザーネーム
            <input minLength={1} maxLength={32} type="string" onChange={e => this.change(e, "userName")} value={this.state.userName} />
          </div>
          <div>メールアドレス
            <input minLength={1} maxLength={300} type="email" onChange={e => this.change(e, "email")} value={this.state.email} />
          </div>


          {/* <label>email</label><input type="email" name="email" onChange={e => this.change(e, "email")} value={this.state.email}/>*/}

          <div>パスワード
            <input minLength={8} maxLength={32} type="password" onChange={e => this.change(e, "password")} value={this.state.password} />
          </div>

          <div>パスワード確認
            <input minLength={8} maxLength={32} type="password" onChange={e => this.change(e, "passwordVerify")} value={this.state.passwordVerify} />
          </div>

          {/* <label>password</label><input type="password" name="password" onChange={e => this.change(e, "password")} value={this.state.password}/>*/}
          <div>
            <Button type="submit" value="Submit" variant="contained" color="primary" >Signup</Button>
          </div>

          {/* <input type="submit" value="Submit" /> */}
        </form>
        <div>
          {this.state.signupSuccessMessage}
        </div>
      <div>
          <Link to="/login">Login</Link>
      </div>
      </div>
    );
  }
}

export default Signup;