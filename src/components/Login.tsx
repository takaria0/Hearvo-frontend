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
        <h1>Login</h1>
        <form onSubmit={e => this.submit(e)}>
          <div>
            <TextField type="email" name="email" label="email" onChange={e => this.change(e, "email")} value={this.state.email} />
          </div>
          

          <div>
            <TextField type="password" label="password" onChange={e => this.change(e, "password")} value={this.state.password} />
          </div>
          

          <div>
            <Button type="submit" value="Submit" variant="contained" color="primary" >ログイン</Button>
          </div>
        </form>
        <div>
          <Link to="/signup">Signup</Link>
        </div>
      </div>
    );
  }
}

export default Login;