import React, { Component } from 'react';
import axios from './Api';
import { RouteComponentProps, Link } from 'react-router-dom'
import { Button, TextField, Fab } from '@material-ui/core';
import * as styles from '../css/Login.module.css';
export interface LoginProps extends RouteComponentProps<{}>{
}

export interface LoginState {
  email: string;
  password: string;
}

class Login extends React.Component<LoginProps, LoginState> {

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    document.title = "Login";
  }

  change(e: any, field: string) {

    this.setState({
      [field]: e.target.value,
    } as unknown as LoginState)

  }

  submit(e: any) {
    e.preventDefault();

    axios.post("/login", {
      email: this.state.email,
      password: this.state.password,
    }).then((res: any) => {

      localStorage.setItem("jwt", res.data.token);

      axios.get(`/users`, { headers: { Authorization: `Bearer ${res.data.token}` } }).then((res: any) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        this.props.history.push("/");
      }).catch((err: any) => {
        this.props.history.push("/login");
      })
      
    }).catch((res: any) => {
      this.props.history.push("/login");
    })
  };

  render() {
    return (
      <div className={styles.body}>
        <h1>Hearvo</h1>
        <Link to="/intro">開発状況</Link>
        <div className={styles.body_inside}>
          
        <h2 >Login</h2>
        <form onSubmit={e => this.submit(e)}>
          <div>
            <div>メールアドレス</div>
            <input  className={styles.email} minLength={1} maxLength={300} type="email" name="email"  onChange={e => this.change(e, "email")} value={this.state.email} />
          </div>
          

          <div>
            <div>パスワード</div>
            <input className={styles.password} minLength={8} maxLength={32} type="password" onChange={e => this.change(e, "password")} value={this.state.password} />
          </div>
          

          <div className={styles.button}>
            <Button  type="submit" value="Submit" variant="contained" color="primary" >Login</Button>
          </div>
        </form>
        <div className={styles.footer}>
          <Link to="/signup">アカウント作成</Link>
        </div>
        </div>
      </div>
    );
  }
}

export default Login;