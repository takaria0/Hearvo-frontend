import React from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';

import AddVoteSelect from './AddVoteSelect';
import { withRouter, RouteComponentProps } from 'react-router-dom'




interface PostFeedProps extends RouteComponentProps<{}> {
}

interface PostFeedState {
  title? : string;
  content?: string;
}

class PostFeed extends React.Component<PostFeedProps, PostFeedState> {
  constructor(props: PostFeedProps) {
    super(props);

    this.state = {
      title: "",
      content: "",
    }
  }

  change(e: any, field: string) {
    this.setState({
      [field]: e.target.value,
    } as unknown as PostFeedState)
    console.log("PostFeed: this.state"); console.log(this.state);
  }

  // submit(e: any) {
  //   e.preventDefault();
  //   const jwt = getJwt();
  //   axios.post("/posts", {
  //     title: this.state.title,
  //     content: this.state.content,
  //   },{ headers: { Authorization: `Bearer ${jwt}` } })
  //   .then((res: any) => {
  //     this.props.history.push("/");
  //   }).catch((res: any) => {
  //     this.props.history.push("/");
  //   })
  // };


  componentDidMount() {

  }

  render() {
    return (
      <div>
        {/* <form> */}
          <input type="text" name="post" placeholder="title here" onChange={e => this.change(e, "title")} value={this.state.title}/>
          <input type="text" name="post" placeholder="content here" onChange={e => this.change(e, "content")} value={this.state.content}/>

          <div>
            <AddVoteSelect title={this.state.title || ""} content={this.state.content || ""}></AddVoteSelect>
          </div>

        {/* </form> */}
      </div >
    )
  }
}




export default withRouter(PostFeed);