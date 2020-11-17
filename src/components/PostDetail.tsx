import { RouteProps, withRouter, RouteComponentProps } from 'react-router';
import React from 'react';
import axios from './Api';
import { getJwt } from '../helpers/jwt';
import * as styles from '../css/PostDetail.module.css';
import NewEachPost from './Feed/NewEachPost';
import Comment from './Comment';

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
}

interface Params {
  user_name: string;
  post_id: string;
}



class PostDetail extends React.Component<Props & RouteComponentProps<Params>, State> {
  
  constructor(props: any) {
    super(props);

    const jwt = getJwt();
    const postId = parseInt(this.props.match.params.post_id);

    this.state = {
      userName: "",
      data: {},
    }
    // console.log("POST DETAIL CONSTRUCTOOOOOOOOOOOO");
    // console.log("this.state");
    // console.log(this.state)

    axios.get(`/posts?id=${postId}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then(res => {
        this.setState({
          data: res.data,
          isLoaded: true,
        });
      }).catch((err) => {
        // // console.log(err.response.data);
      })
  }



  
  render() {
    const data = this.state.data;
    document.title = data?.title ? data?.title : "";

    if(this.state.isLoaded) {
      return (
        <div className={styles.body}>

          <div>
            <NewEachPost data={this.state.data!}></NewEachPost>
          </div>
          <div>
            <Comment postId={this.state.data.id}></Comment>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div>
          Loading ...
          </div>
        </div>
      )
    }
  }
}



export default withRouter(PostDetail);