import React from "react";
import { getJwt } from "../../helpers/jwt";
import axios from "../Api";
import { Button } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router";
import * as styles from "../../css/Comment.module.css";
import i18n from "../../helpers/i18n";

interface ReplyCommentProps extends RouteComponentProps<{}> {
  postId: number;
  commentId: number;
  handleParentPosted: any;
  isLogin: boolean;
}

interface ReplyCommentState {
  commentContent: string;
  isReplyEntered: boolean;
}

class ReplyComment extends React.Component<
  ReplyCommentProps,
  ReplyCommentState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      commentContent: "",
      isReplyEntered: false,
    };
  }

  change(e: any) {
    // console.log("Reply this.state", this.state);
    this.setState({
      commentContent: e.target.value,
    });
    if (e.target.value.length === 0) {
      this.setState({
        isReplyEntered: false,
      });
    } else {
      this.setState({
        isReplyEntered: true,
      });
    }
  }

  submit(e: any) {
    const url = window.location.pathname.split("/");
    // hearvo.com/posts/777 => url = { ,posts,777}
    if (this.props.isLogin === false) {
      this.props.history.push(
        "/login" + "?destination=" + url[1] + "&value=" + url[2]
      );
      return;
    }

    if (this.state.commentContent.replace(/\s+/g, "").length === 0) {
      return;
    }

    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Country: process.env.REACT_APP_COUNTRY,
        },
      };
    }
    axios
      .post(
        "/comments",
        {
          post_id: this.props.postId,
          content: this.state.commentContent,
          parent_id: this.props.commentId,
        },
        options
      )
      .then((res: any) => {
        this.props.handleParentPosted(e);
        this.setState({ commentContent: "" });
      })
      .catch((res: any) => {});
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) => this.submit(e)}>
          <div style={{ textAlign: "right" }}>
            <textarea
              maxLength={1000}
              rows={5}
              className={styles.reply}
              onChange={(e) => this.change(e)}
              value={this.state.commentContent}
            ></textarea>
          </div>
          <div className={styles.submit}>
            <Button
              disableRipple
              disabled={!this.state.isReplyEntered}
              type="submit"
              value="Submit"
              className={
                this.state.isReplyEntered
                  ? styles.reply_submit_button
                  : styles.disabled_reply_submit_button
              }
            >
              {i18n.t("eachPost.sendReply")}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(ReplyComment);
