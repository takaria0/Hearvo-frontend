import React from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import { withRouter, RouteComponentProps } from 'react-router-dom'

export interface AuthProps extends RouteComponentProps<{}>{
}
 
export interface AuthState {
  user: object;
}
 
class Auth extends React.Component<AuthProps, AuthState> {

  constructor(props: any) {
    super(props);

    this.state = {
      user: {},
    };

  }

  componentDidMount() {
    const jwt = getJwt();
    if(!jwt) {
      this.props.history.push("/login");
    }
    const options = { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }

    axios.get(`/users`, options).then((res: any) => {
      this.setState({
        user: res.data,
      });
      if (typeof window !== 'undefined') {localStorage.setItem("user", JSON.stringify(res.data));}
    }).catch((err: any) => {
      if (typeof window !== 'undefined') {localStorage.removeItem("jwt")};
      this.props.history.push("/login");
    })

  };

  render() { 
    if(this.state.user === {}) {
      return (
      <div>
        <h1>
          {/* Loading ... */}
        </h1>
      </div>
      )
    }
    return (
      <div>
        {this.props.children}
      </div>
      );
  }
}
 
export default withRouter(Auth);