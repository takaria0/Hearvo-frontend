import {  withRouter, RouteComponentProps } from 'react-router';
import React from 'react';
import axios from './Api';
import { getJwt } from '../helpers/jwt';
import * as styles from '../css/Home.module.css';
import NewEachPost from './Feed/NewEachPost';
import Comment from './Comment';
import Header from './Header';
import SideBar from './SideBar';
import EachPostHelmet from './Feed/EachPostHelmet';
import InitialForm from './InitialForm';

type VoteSelectType = {
  id: number;
  content: string,
}

type PostType = {
  id: number;
  title: string;
  content: string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  vote_selects: VoteSelectType[];
  user: {
    name: string;
  };
  comments: []; num_vote: number;
}

interface Props {
  
}

interface State {
  userName: string;
  data: any,
  isLoaded?: boolean;
  isLogin: boolean;
  isLoginLoaded: boolean;
  userObj: any;
}

interface Params {
  user_name: string;
  post_id: string;
}



class PostDetail extends React.Component<Props & RouteComponentProps<Params>, State> {
  
  constructor(props: any) {
    super(props);

    // const jwt = getJwt();
    // const postId = parseInt(this.props.match.params.post_id);

    this.state = {
      userName: "",
      data: {},
      isLoaded: false,
      isLogin: false,
      isLoginLoaded: false,
      userObj: {},
    }
  }

  componentDidMount = () => {
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.get(`/posts?id=${this.props.match.params.post_id}`, options)
      .then(res => {
        this.setState({
          data: res.data,
          isLoaded: true,
        });
      }).catch((err) => {
      })

    axios.get(`/users`, options).then((res: any) => {
      this.setState({
        isLogin: true,
        isLoginLoaded: true,
        userObj: res.data,
      });
    }).catch((err: any) => {
      this.setState({
        isLogin: false,
        isLoginLoaded: true,
      });
    })
  }



  
  render() {
    const data = this.state.data;
    // document.title = data?.title ? data?.title : "";


    if(this.state.isLoaded) {
      return (
        <div>
          <InitialForm></InitialForm>
          <Header></Header>
          <EachPostHelmet data={this.state.data}></EachPostHelmet>
        <div className={styles.body}>

            <div className={styles.feed}>
              <div>
                <NewEachPost isLogin={this.state.isLogin} data={this.state.data!}></NewEachPost>
              </div>
              <div>
                <Comment userObj={this.state.userObj} isLogin={this.state.isLogin} postId={this.state.data.id}></Comment>
              </div>
            </div>

            <div className={styles.side_bar}>
              <SideBar></SideBar>
            </div>

        </div>
        </div>
      );

    } else {
      return (
        <div>
          <Header></Header>
          <div>
          </div>
        </div>
      )
    }
  }
}



export default withRouter(PostDetail);