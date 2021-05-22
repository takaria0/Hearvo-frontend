import React from "react";
import axios from "../Api";
import { RouteComponentProps, Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import * as styles from "../../css/Login.module.css";
import i18n from "../../helpers/i18n";
import { Mixpanel } from "../../helpers/mixpanel";
import { GoogleLogin } from "react-google-login";

export interface SignupProps extends RouteComponentProps<{}> {}

export interface SignupState {
  userName: string;
  email: string;
  password: string;
  passwordVerify: string;
  successMessage: string;
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
      successMessage: "",
      errorMessage: "",
    };
    this.change = this.change.bind(this);
    this.submit = this.submit.bind(this);
    document.title = "Signup";
    const params = window.location.search;
  }

  change(e: any, field: string) {
    this.setState({
      [field]: e.target.value,
    } as unknown as SignupState);
  }

  submit(e: any) {
    e.preventDefault();
    const params = window.location.search;
    // hearvo.com/login?destination=posts&value=777 => params = ?destination=posts&value=777

    // need more elavorate password verification this.state.password === this.state.passwordVerify
    if (this.state.password.length < 8) {
      this.setState({
        errorMessage: i18n.t("signup.passwordLength"),
      });
      return;
    }

    if (this.state.passwordVerify.length < 8) {
      this.setState({
        errorMessage: i18n.t("signup.passwordLength"),
      });
      return;
    }

    if (this.state.password !== this.state.passwordVerify) {
      this.setState({
        errorMessage: i18n.t("signup.passwordDiffer"),
      });
      return;
    }

    const letters = /^[0-9a-zA-Z_]+$/;
    if (!this.state.userName.match(letters)) {
      this.setState({
        errorMessage: i18n.t("signup.useAlphabet"),
      });
      return;
    }

    if (this.state.userName.length < 1) {
      this.setState({
        errorMessage: i18n.t("signup.enterUserName"),
      });
      return;
    }

    axios
      .post("/signup", {
        user_name: this.state.userName,
        email: this.state.email,
        password: this.state.password,
      })
      .then((res: any) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("jwt", res.data.token);
        }

        Mixpanel.track("Successful Signup", {});

        this.setState({
          successMessage: i18n.t("signup.createdAccount"),
        });
        function timeout(delay: number) {
          return new Promise((res) => setTimeout(res, delay));
        }
        timeout(1000).then(() => {
          this.props.history.push("/login" + params);
        });
      })
      .catch((err: any) => {
        Mixpanel.track("Unsuccessful Signup", {});
        const resMessage = err.response.data.message;
        this.setState({
          errorMessage: resMessage,
        });
      });
  }

  responseGoogle = (res: any) => {
    // send tokenId to backend and get response (get jwt) and save it to localStorage
    // then history.push("/")

    const params = new URLSearchParams(window.location.search);
    const previousUrl = {
      destination: params.get("destination"),
      value: params.get("value"),
    };
    // const previousUrl = {
    //   destination: posts ,
    //   value: 777 ,
    // }

    axios
      .post(
        "/login?google_login=true",
        {},
        {
          headers: {
            googleTokenId: res.tokenId,
            Country: process.env.REACT_APP_COUNTRY,
          },
        }
      )
      .then((res: any) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("jwt", res.data.token);
        }

        this.setState({ successMessage: i18n.t("login.successToLogin") });

        axios
          .get(`/users`, {
            headers: {
              Authorization: `Bearer ${res.data.token}`,
              Country: process.env.REACT_APP_COUNTRY,
            },
          })
          .then((res: any) => {
            if (typeof window !== "undefined") {
              localStorage.setItem("user", JSON.stringify(res.data));
            }
            Mixpanel.identify(res.data.id);
            Mixpanel.track("Successful Google login", {});
            Mixpanel.people.set({
              name: res.data.name,
            });

            if (previousUrl.destination === null) {
              this.props.history.push("/");
            } else if (
              previousUrl.destination !== null &&
              previousUrl.value !== null
            ) {
              this.props.history.push(
                "/" +
                  `${previousUrl.destination}` +
                  "/" +
                  `${previousUrl.value}`
              );
            } else {
              this.props.history.push("/");
            }
          })
          .catch((err: any) => {
            Mixpanel.track("Unsuccessful Google login", {});
            this.props.history.push("/login");
          });
      })
      .catch((err: any) => {
        Mixpanel.track("Unsuccessful Google login", {});
        this.setState({
          errorMessage: i18n.t("login.failedToLogin"),
        });
      });
  };

  render() {
    return (
      <div className={styles.body}>
        <h1>{i18n.t("header.title")}</h1>
        <div className={styles.body_inside}>
          <h2>{i18n.t("signup.createAccount")}</h2>
          <form onSubmit={(e) => this.submit(e)}>
            <div>
              <div>{i18n.t("signup.userName")}</div>
              <input
                style={inlineStyles.inputText}
                className={styles.email}
                minLength={1}
                maxLength={20}
                type="string"
                onChange={(e) => this.change(e, "userName")}
                value={this.state.userName}
              />
            </div>
            <div>
              <div>{i18n.t("signup.email")}</div>
              <input
                style={inlineStyles.inputText}
                className={styles.email}
                minLength={1}
                maxLength={300}
                type="email"
                onChange={(e) => this.change(e, "email")}
                value={this.state.email}
              />
            </div>
            <div>
              <div>{i18n.t("signup.password")}</div>
              <input
                style={inlineStyles.inputText}
                className={styles.email}
                minLength={8}
                maxLength={32}
                type="password"
                onChange={(e) => this.change(e, "password")}
                value={this.state.password}
              />
            </div>

            <div>
              <div>{i18n.t("signup.confirmPassword")}</div>
              <input
                style={inlineStyles.inputText}
                className={styles.email}
                minLength={8}
                maxLength={32}
                type="password"
                onChange={(e) => this.change(e, "passwordVerify")}
                value={this.state.passwordVerify}
              />
            </div>

            <div style={{ marginBottom: 20, marginTop: 20 }}>
              <GoogleLogin
                clientId="984877314328-2kvinv2q3o9bgstfjherl42t7gf1rc05.apps.googleusercontent.com"
                buttonText="Continue with Google"
                onSuccess={this.responseGoogle}
                // onFailure={}
                cookiePolicy={"single_host_origin"}
              />
            </div>

            <div style={{ fontSize: 14, marginBottom: 10 }}>
              {i18n.t("signup.confirmText1")}
              <br></br>
              <Link to="/tos" target="_blank">
                {i18n.t("signup.confirmText2")}
              </Link>
              {i18n.t("signup.confirmText3")}
              <Link to="/privacy" target="_blank">
                {i18n.t("signup.confirmText4")}
              </Link>
              {i18n.t("signup.confirmText5")}
              <br></br>
            </div>
            <div className={styles.button}>
              <Button
                type="submit"
                value="Submit"
                variant="contained"
                color="primary"
              >
                {i18n.t("signup.createAccount")}
              </Button>
            </div>
          </form>
          <div style={{ color: "red", textAlign: "center" }}>
            {this.state.errorMessage ? this.state.errorMessage : ""}
          </div>
          <div>{this.state.successMessage}</div>
          <div className={styles.footer}>
            <Link to={"/login" + window.location.search}>
              {i18n.t("signup.login")}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const inlineStyles = {
  inputText: {
    padding: 5,
    width: "25ch",
  },
};

export default Signup;
