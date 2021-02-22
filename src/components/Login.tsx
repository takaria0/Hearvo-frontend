import React from 'react';
import axios from './Api';
import { RouteComponentProps, Link } from 'react-router-dom'
import { Button } from '@material-ui/core';
import * as styles from '../css/Login.module.css';
import i18n from "../helpers/i18n";

export interface LoginProps extends RouteComponentProps<{}>{
}

export interface LoginState {
  email: string;
  password: string;
  errorMessage: string;
  successMessage: string;
}

class Login extends React.Component<LoginProps, LoginState> {

  constructor(props: any) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorMessage: '',
      successMessage: '',
    };
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    document.title = i18n.t("login.login");
  }

  change(e: any, field: string) {

    this.setState({
      [field]: e.target.value,
    } as unknown as LoginState)

  }

  submit(e: any) {
    e.preventDefault();

    axios.post("/login", { email: this.state.email, password: this.state.password }, { headers: { Country: process.env.REACT_APP_COUNTRY } })
    .then((res: any) => {
      const resMessage = res.data.message;
      this.setState({
        successMessage: resMessage,
      })

      if (typeof window !== 'undefined') {localStorage.setItem("jwt", res.data.token)};
      axios.get(`/users`, { headers: { Authorization: `Bearer ${res.data.token}`, Country: process.env.REACT_APP_COUNTRY } }).then((res: any) => {

      if (typeof window !== 'undefined') {localStorage.setItem("user", JSON.stringify(res.data))};
        this.props.history.push("/");
      }).catch((err: any) => {
        this.props.history.push("/login");
      })
      
    }).catch((err: any) => {
      this.setState({
        errorMessage: i18n.t("login.failedToLogin"),
      })
    })
  };

  render() {
    return (
      <div className={styles.body}>
        <h1>Hearvo</h1>
        <div className={styles.body_inside}>
          <h2 >{i18n.t("login.login")}</h2>
        <form onSubmit={e => this.submit(e)}>
          <div>
              <div>{i18n.t("login.email")}</div>
            <input  className={styles.email} minLength={1} maxLength={300} type="email" name="email"  onChange={e => this.change(e, "email")} value={this.state.email} />
          </div>
          

          <div>
              <div>{i18n.t("login.password")}</div>
            <input className={styles.password} minLength={8} maxLength={32} type="password" onChange={e => this.change(e, "password")} value={this.state.password} />
          </div>
          

          <div className={styles.button}>
              <Button type="submit" value="Submit" variant="contained" color="primary" >{i18n.t("login.login")}</Button>
          </div>
        </form>
        <div className={styles.footer}>
            <Link to="/signup">{i18n.t("login.createAccount")}</Link>
        </div>
        <div style={{ color: 'red', textAlign: 'center', margin: '5px' }}>
            {this.state.errorMessage ? this.state.errorMessage : ''}
        </div>
        <div style={{ color: 'blue', textAlign: 'center', margin: '5px' }}>
          {this.state.successMessage ? this.state.successMessage : ''}
        </div>
        </div>
      </div>
    );
  }
}

export default Login;