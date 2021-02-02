import React from 'react';
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import { Button, TextField, Fab } from '@material-ui/core';
import { RouteProps, withRouter, RouteComponentProps } from 'react-router';
import * as styles from '../css/Comment.module.css';
import ReplyComment from './ReplyComment';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

const moment = require('moment-timezone');
moment.locale('ja');
moment.tz.setDefault('UTC');



const nest = (items: any, id = null) =>
  items
    .filter((item: any) => item.parent_id === id)
    .map((item: any) => ({ ...item, children: nest(items, item.id) }));



 



interface CommentProps extends RouteComponentProps<{}> {
  postId: number;
   isLogin: boolean;
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
  isPosted: boolean;
  goodOrBad: number; // 0 nothing, 1 good, 2 bad
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
      isPosted: false,
      goodOrBad: 0,
    }

    // // console.log("this state", this.state);
  }

  getDiffTime = (datetime: string) => {
    // console.log("記事の時間", datetime);
    // console.log("moment()の時間", moment().format("YYYY-MM-DD HH:mm:ss"));
    const diff = moment(moment(moment().format("YYYY-MM-DD HH:mm:ss"))).diff(datetime);
    const duration = moment.duration(diff);

    // 日・時・分・秒を取得
    const years = duration.years();
    const months = duration.months();
    const weeks = duration.weeks();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    // console.log("days", days)
    // console.log("hours", hours)
    // console.log("minutes", minutes)
    // console.log("seconds", seconds)
    if (years > 0) {
      return `${years}年前`
    } else if (months > 0) {
      return `${months}ヶ月前`
    } else if (weeks > 0) {
      return `${weeks}週間前`
    } else if (days > 0) {
      return `${days}日前`
    } else if (hours > 0) {
      return `${hours}時間前`
    } else if (minutes > 0) {
      return `${minutes}分前`
    } else {
      return `${seconds}秒前`
    }
    // return moment(datetime).fromNow()
  } 

  updateData = () => {
    const jwt = getJwt();
    axios.get(`/comments?post_id=${this.props.postId}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then((res: any) => {
        const commentData = res.data;
        this.setState({ commentData });
        this.setState({
          nestedComments: nest(commentData),
          isLoaded: true,
        })
      }).catch((err) => {
      })
  }
 
  handlePosted = (e: any) => {
    this.setState({
      isPosted: true,
    })
    this.setState({
      isPosted: false,
    })
    this.setState({
      commentId: 0,
    })
  };

  componentDidUpdate = () => {
    if(this.state.isPosted === true) {
      this.updateData();
    }
  }

  componentDidMount() {
    this.updateData();
  }



  baseChange(e: any) {
    // // console.log("コメンと変わってます！！！！！！！", e.target.value)
    this.setState({
      baseCommentContent: e.target.value,
    })
  }


  baseSubmit(e: any) {
    
    // // console.log("コメント提出します！！！！！！！！！！")
    if (this.props.isLogin === false) {
      this.props.history.push("/login");
      return
    }

    if (this.state.baseCommentContent.replace(/\s+/g, '').length === 0) {
      return
    }


    const jwt = getJwt();
    // // console.log("postObj", postObj)
    axios.post(
      "/comments",
      {
        post_id: this.props.postId,
        content: this.state.baseCommentContent,
        parent_id: this.state.commentId,
      },
      {
        headers: {
          'Authorization': `Bearer ${jwt}`,
        }
      }
      )
      .then((res: any) => {
        this.handlePosted(e)
        this.setState({ baseCommentContent: ""});
      }).catch((res: any) => {
      });
      e.preventDefault();
  }
 
  click(e: any, id: any) {
    e.preventDefault();
    this.setState({
      commentId: id,
    })
    // // console.log("クリックしました！！！！！！！！！！")
  }

  commentItem = (props: any) => {
    return (
      <div className={styles.body} style={{ wordWrap: "break-word" }}>
        &nbsp;{props.content} {"    "}
        <div>
          <span>&nbsp;&nbsp;
            <ThumbUpIcon style={{ margin: 0, padding: 0, fontSize: 12 }}></ThumbUpIcon>
            &nbsp;{props.num_of_good}&nbsp;&nbsp;
            <ThumbDownIcon style={{ margin: 0, padding: 0, fontSize: 12 }}></ThumbDownIcon>&nbsp;&nbsp;
            </span>

        <span style={{ fontSize: "10px", textAlign: "right" }}>by {props.user_info?.name}, {this.getDiffTime(props.created_at.slice(0, -7).replace("T", " "))}</span> 

          <span style={{textAlign: 'right'}}><Button style={{ fontSize: 12 }} onClick={e => this.click(e, props.id)}>返信する</Button></span>
        </div>
      </div>
      )
  }


  render() { 
    const CommentView = (props: any) => {
      if (this.state.commentId === props.id) {
        return (
          <li className={styles.com_li}>
            {this.commentItem(props)}

            <ReplyComment isLogin={this.props.isLogin} commentId={props.id} postId={this.state.postId} handleParentPosted={this.handlePosted}></ReplyComment>

            <ul className={styles.com_ul}>
              {props.children.map((child: any) => <CommentView {...child} />)}
            </ul>
          </li>
        )
      } else {
        return (
          <li className={styles.com_li}>
            {this.commentItem(props)}

            <ul className={styles.com_ul}>
              {props.children.map((child: any) => <CommentView {...child} />)}
            </ul>
          </li>
        )
      }
    }


    const ListComment = ({ comments }: any) => (
      <ul className={styles.com_ul}>
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
 
export default withRouter(Comment);

