import { RouteProps, withRouter, RouteComponentProps } from 'react-router';
import React from 'react';
import axios from './Api';
import { getJwt } from '../helpers/jwt';
import * as styles from '../css/Feed.module.css';
import EachFeed from './Feed/EachFeed';
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
  comments: [];
}

interface Props {
  
}

interface State {
  userName: string;
  post_id: number;
  postData?: PostType;
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
      post_id: postId,
      postData: {
        id: 0,
        title: "",
        content: "",
        start_at: "",
        end_at: "",
        created_at: "",
        updated_at: "",
        vote_selects: [],
        user: {
          name: ""
        },
        comments: []
      },
    }
    // console.log("POST DETAIL CONSTRUCTOOOOOOOOOOOO");
    // console.log("this.state");
    // console.log(this.state)

    axios.get(`/posts?id=${postId}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then(res => {
        const postData = res.data;
        // console.log("postData aaaaaaaaaaaaaaaaaaaaaa"); // console.log(postData);
        this.setState({ postData });
      }).catch((err) => {
        // // console.log(err.response.data);
      })
  }


  // componentDidMount() {

  // }
  
  render() {
    // console.log("POST DETAIL renderrrrrrrrrrrrrrrrrrrrr");
    // console.log("this.state");
    const data = this.state.postData;
    const postId = this.state.post_id;
    return (
      <div>
        <h1>PostDetail</h1 >

        <div>
          <EachFeed eachPost={data!} postId={postId}></EachFeed>
        </div>
        <div>
          <Comment postId={postId}></Comment>
        </div>
      </div>
     );
  }
}



export default withRouter(PostDetail);