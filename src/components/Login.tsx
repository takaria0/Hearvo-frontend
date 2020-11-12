import React, { Component } from 'react';
import axios from './Api';
import { RouteComponentProps } from 'react-router-dom'

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

  change(e: React.ChangeEvent<HTMLInputElement>, field: string) {

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
      this.props.history.push("/");
    }).catch((res: any) => {
      this.props.history.push("/login");
    })
  };

  render() {
    return (
      <div>
        <form onSubmit={e => this.submit(e)}>
          <label>email</label><input type="email" name="email" onChange={e => this.change(e, "email")} value={this.state.email}/>
          <label>password</label><input type="password" name="password" onChange={e => this.change(e, "password")} value={this.state.password}/>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Login;