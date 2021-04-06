import React from 'react';
import axios from '../Api';
import { RouteComponentProps, Link } from 'react-router-dom'
import { Button } from '@material-ui/core';
import * as styles from '../../css/Login.module.css';
import i18n from '../../helpers/i18n';
import { GoogleLogin } from 'react-google-login';
import { Mixpanel } from '../../helpers/mixpanel';
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
    const params = new URLSearchParams(window.location.search);
    const previousUrl = {
      destination: params.get("destination"),
      value: params.get("value"),
    }
    // const previousUrl = {
    //   destination: posts ,
    //   value: 777 ,
    // }
      
    axios.post("/login", { email: this.state.email, password: this.state.password }, { headers: { Country: process.env.REACT_APP_COUNTRY } })
    .then((res: any) => {
      const resMessage = res.data.message;
      this.setState({
        successMessage: resMessage,
      })

      if (typeof window !== 'undefined') {localStorage.setItem("jwt", res.data.token)};
      axios.get(`/users`, { headers: { Authorization: `Bearer ${res.data.token}`, Country: process.env.REACT_APP_COUNTRY } })
      .then((res: any) => {
        if (typeof window !== 'undefined') {localStorage.setItem("user", JSON.stringify(res.data))};

        Mixpanel.identify(res.data.id);
        Mixpanel.track('Successful login', {});
        Mixpanel.people.set({
          name: res.data.name,
        });
        
        if ( previousUrl.destination === null ){
          this.props.history.push("/");
        } else if ( previousUrl.destination !== null && previousUrl.value !== null ){
          this.props.history.push("/"+`${previousUrl.destination}`+"/"+`${previousUrl.value}`);
        } else {
          this.props.history.push("/");
        }


      }).catch((err: any) => {
        Mixpanel.track('Unsuccessful login', {});
        this.props.history.push("/login");
      })
      
    }).catch((err: any) => {
      Mixpanel.track('Unsuccessful login', {});
      this.setState({
        errorMessage: i18n.t("login.failedToLogin"),
      })
    })
  };

  responseGoogle = (res: any) => {

    // send tokenId to backend and get response (get jwt) and save it to localStorage
    // then history.push("/")

    const params = new URLSearchParams(window.location.search);
    const previousUrl = {
      destination: params.get("destination"),
      value: params.get("value")
    }
    // const previousUrl = {
    //   destination: posts ,
    //   value: 777 ,
    // }

    axios.post("/login?google_login=true", { }, { headers: { googleTokenId: res.tokenId, Country: process.env.REACT_APP_COUNTRY } })
      .then((res: any) => {
        if (typeof window !== 'undefined') { localStorage.setItem("jwt", res.data.token) };
        
        this.setState({ successMessage: i18n.t("login.successToLogin")})

        axios.get(`/users`, { headers: { Authorization: `Bearer ${res.data.token}`, Country: process.env.REACT_APP_COUNTRY } })
        .then((res: any) => {

          if (typeof window !== 'undefined') { localStorage.setItem("user", JSON.stringify(res.data)) };
          Mixpanel.identify(res.data.id);
          Mixpanel.track('Successful Google login', {});
          Mixpanel.people.set({
            name: res.data.name,
          });

          if ( previousUrl.destination === null ){
            this.props.history.push("/");
          } else if ( previousUrl.destination !== null && previousUrl.value !== null ){
            this.props.history.push("/"+`${previousUrl.destination}`+"/"+`${previousUrl.value}`);
          } else {
            this.props.history.push("/");
          }

        }).catch((err: any) => {
          Mixpanel.track('Unsuccessful Google login', {});
          this.props.history.push("/login");
        })


      }).catch((err: any) => {
        Mixpanel.track('Unsuccessful Google login', {});
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
              <input style={{ padding:5, width: '23ch' }} className={styles.email} minLength={1} maxLength={300} type="email" name="email"  onChange={e => this.change(e, "email")} value={this.state.email} />
          </div>
   

          <div>
              <div>{i18n.t("login.password")}</div>
              <input style={{ padding: 5, width: '23ch' }} className={styles.password} minLength={8} maxLength={32} type="password" onChange={e => this.change(e, "password")} value={this.state.password} />
          </div>
          
            <div style={{marginBottom: 20, marginTop: 20}}>
              <GoogleLogin
                clientId="984877314328-2kvinv2q3o9bgstfjherl42t7gf1rc05.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={this.responseGoogle}
                // onFailure={}
                cookiePolicy={'single_host_origin'}
              />
            </div>

            <div style={{ fontSize: 14, marginBottom: 10 }}>
              {i18n.t("login.confirmText1")}<br></br><Link to="/tos" target="_blank">{i18n.t("login.confirmText2")}</Link>{i18n.t("login.confirmText3")}<Link to="/privacy" target="_blank">{i18n.t("login.confirmText4")}</Link>{i18n.t("login.confirmText5")}<br></br>
            </div>

          <div className={styles.button}>
              <Button type="submit" value="Submit" variant="contained" color="primary" >{i18n.t("login.login")}</Button>
          </div>
        </form>
        <div className={styles.footer}>
            <Link to={"/signup"+window.location.search}>{i18n.t("login.createAccount")}</Link>
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