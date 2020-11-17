import React from 'react';
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import { Button, TextField, Fab } from '@material-ui/core';
import * as styles from '../css/Comment.module.css';

const nest = (items: any, id = null) =>
  items
    .filter((item: any) => item.parent_id === id)
    .map((item: any) => ({ ...item, children: nest(items, item.id) }));


interface ReplyCommentProps {
  postId: number;
  commentId: number;
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
    // // console.log("コメンと変わってます！！！！！！！", e.target.value)
    this.setState({
      commentContent: e.target.value,
    })
  }


  submit(e: any) {
    // e.preventDefault();
    // // console.log("コメント提出します！！！！！！！！！！")
    const postObj = {
      post_id: this.props.postId,
      content: this.state.commentContent,
      parent_id: this.props.commentId,
    }
    const jwt = getJwt();
    // // console.log("postObj", postObj)
    axios.post(
      "/comments",
      postObj,
      { headers: { Authorization: `Bearer ${jwt}` }}
    )
      .then((res: any) => {
        // // console.log("POST /comments", res)
      }).catch((res: any) => {
      });
  }



  render() { 
    return ( 
    <div>
        <form onSubmit={e => this.submit(e)}>
          <div><textarea rows={2} className={styles.reply} onChange={e => this.change(e)} value={this.state.commentContent}></textarea></div>
          <div>
            <Button type="submit" value="Submit" variant="contained" color="primary">返信する</Button>
          </div>
        </form>
    </div> 
    );
  }
}
 



 interface CommentProps {
  postId: number;
}
 
 interface CommentState {
  nestedComments: [];
  postId: number;
  commentData: [];
  commentId: number;
  inputField: boolean;
  commentContent: string;
  baseCommentContent: string;
  isLoaded: boolean;
}
 
class Comment extends React.Component<CommentProps, CommentState> {

  constructor(props: any) {
    super(props);
    // // console.log("COMMENT CONSTRUCTORRRRRRRRRRRRRRRRR")

    const postId = this.props.postId;

    this.state = {
      nestedComments: [],
      postId: postId,
      commentData: [],
      commentId: 0,
      inputField: false,
      commentContent: "",
      baseCommentContent: "",
      isLoaded: false,
    }

    // // console.log("this state", this.state);
  }

  componentDidMount() {
    const jwt = getJwt();

    axios.get(`/comments?post_id=${this.props.postId}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then((res: any) => {
        const commentData = res.data;
        this.setState({ commentData });
        this.setState({
          nestedComments: nest(commentData),
          isLoaded: true,
        })
        // // console.log("コメント手に入りました！！！！！！！！！！！")
      }).catch((err) => {
      })
  }



  baseChange(e: any) {
    // // console.log("コメンと変わってます！！！！！！！", e.target.value)
    this.setState({
      baseCommentContent: e.target.value,
    })
  }


  baseSubmit(e: any) {
    // e.preventDefault();
    // // console.log("コメント提出します！！！！！！！！！！")
    const postObj = {
      post_id: this.props.postId,
      content: this.state.baseCommentContent,
      parent_id: this.state.commentId,
    }
    const jwt = getJwt();
    // // console.log("postObj", postObj)
    axios.post(
      "/comments",
      postObj,
      { headers: { Authorization: `Bearer ${jwt}` }}
      )
      .then((res: any) => {
        // // console.log("POST /comments", res)
      }).catch((res: any) => {
      });
  }
 
  click(e: any, id: any) {
    e.preventDefault();
    this.setState({
      commentId: id,
    })
    // // console.log("クリックしました！！！！！！！！！！")
  }


  render() { 
    const CommentView = (props: any) => {
      if (this.state.commentId === props.id) {
        return (
          <li>
            <div className={styles.body}>
              {props.content} by {props.user?.name}, {props.updated_at.slice(0, -7).replace("T", " ")}
              <Button onClick={e => this.click(e, props.id)}>返信する</Button>
            </div>

            <ReplyComment commentId={props.id} postId={this.state.postId}></ReplyComment>

            <ul>
              {props.children.map((child: any) => <CommentView {...child} />)}
            </ul>
          </li>
        )
      } else {
        return (
          <li>
            <div className={styles.body}>
              {props.content} by {props.user?.name}, {props.updated_at.slice(0, -7).replace("T", " ")}
              <Button onClick={e => this.click(e, props.id)}>返信する</Button>
            </div>

            <ul>
              {props.children.map((child: any) => <CommentView {...child} />)}
            </ul>
          </li>
        )
      }
    }


    const ListComment = ({ comments }: any) => (
      <ul>
        {comments.map((comment: any) => <CommentView {...comment} />)}
      </ul>
    );


      if(this.state.isLoaded) {
        return (
          <div>
            <div>
              <form onSubmit={e => this.baseSubmit(e)}>
                <div><textarea rows={2} className={styles.base} onChange={e => this.baseChange(e)} value={this.state.baseCommentContent}></textarea> </div>
                <div>
                  <Button type="submit" value="Submit" variant="contained" color="primary">コメントする</Button>
                </div>
              </form>
            </div>
            <ListComment comments={this.state.nestedComments} />
          </div>
        )
      }

      return (
        <div>
          <div>
            <form onSubmit={e => this.baseSubmit(e)}>
            <div><textarea rows={2} className={styles.base} onChange={e => this.baseChange(e)} value={this.state.baseCommentContent}></textarea> </div>
            <div>
              <Button type="submit" value="Submit" variant="contained" color="primary">コメントする</Button>
            </div>
            </form>
          </div>
          <div>
            Loading ...
          </div>
        </div>
      );

  }
}
 
export default Comment;

