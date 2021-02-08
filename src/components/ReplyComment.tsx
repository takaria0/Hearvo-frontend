import React from 'react';
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import { Button, TextField, Fab } from '@material-ui/core';
import { RouteProps, withRouter, RouteComponentProps } from 'react-router';
import * as styles from '../css/Comment.module.css';



interface ReplyCommentProps extends RouteComponentProps<{}> {
  postId: number;
  commentId: number;
  handleParentPosted: any;
  isLogin: boolean;
}

interface ReplyCommentState {
  commentContent: string;
}

class ReplyComment extends React.Component<ReplyCommentProps, ReplyCommentState> {

  constructor(props: any) {
    super(props);

    this.state = {
      commentContent: "",
    }
  }

  change(e: any) {
    // console.log("Reply this.state", this.state);
    this.setState({
      commentContent: e.target.value,
    })
  }


  submit(e: any) {
    if (this.props.isLogin === false) {
      this.props.history.push("/login");
      return
    }

    if (this.state.commentContent.replace(/\s+/g, '').length === 0) {
      return
    }

    const jwt = getJwt();
    axios.post(
      "/comments",
      {
        post_id: this.props.postId,
        content: this.state.commentContent,
        parent_id: this.props.commentId,
      },
      {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        }
      }
    )
      .then((res: any) => {
        this.props.handleParentPosted(e);
        this.setState({ commentContent: "" })
      }).catch((res: any) => {
      });
    e.preventDefault();
  }



  render() {
    return (
      <div>
        <form onSubmit={e => this.submit(e)}>
          <div><textarea rows={5} className={styles.reply} onChange={e => this.change(e)} value={this.state.commentContent}></textarea></div>
          <div>
            <Button type="submit" value="Submit" variant="contained" color="primary">返信する</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(ReplyComment);