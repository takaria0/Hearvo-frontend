import React from 'react';
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import { Button } from '@material-ui/core';
import {  withRouter, RouteComponentProps } from 'react-router';
import * as styles from '../css/Comment.module.css';
import i18n from '../helpers/i18n';


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
    const url = window.location.pathname.split("/");
    if (this.props.isLogin === false) {
      // this.props.history.push("/login");
      this.props.history.push("/login"+"?destination="+url[1]+'&postId='+url[2]);
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
          'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY,
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
          <div><textarea maxLength={1000} rows={5} className={styles.reply} onChange={e => this.change(e)} value={this.state.commentContent}></textarea></div>
          <div>
            <Button type="submit" value="Submit" variant="contained" color="primary">{i18n.t("eachPost.reply")}</Button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(ReplyComment);