import React, { useState } from 'react';
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import { Button } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router';
import * as styles from '../css/Comment.module.css';
import ReplyComment from './ReplyComment';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import i18n from '../helpers/i18n';
import { FormatColorResetOutlined } from '@material-ui/icons';
import ReplyIcon from '@material-ui/icons/Reply';


const moment = require('moment-timezone');
moment.locale('ja');
moment.tz.setDefault('UTC');



const CommentItem = (props: any) => {
  // console.log('props.userObj', props.userObj);
  const commentFavs = props.data.comment_favs;
  // console.log('commentFavs', commentFavs);
  let myOwnCommentFavs;
  try {
    myOwnCommentFavs = props.data.comment_favs.filter((elem: any) => (elem.user_info_id === props.userObj.id))
  } catch (error) {
    myOwnCommentFavs = [];
  }
  // console.log('content', props.data.content);
  // console.log('myOwnCommentFavs', myOwnCommentFavs);
  const initClicked = myOwnCommentFavs.length > 0 ? true : false; // 0 or 1 or null, bad, good, not yet
  let initGoodClicked, initBadClicked;


  if (!initClicked) {
    initGoodClicked = false;
    initBadClicked = false;
  } else {
    const myOwnFav = myOwnCommentFavs[0].good_or_bad;
    initGoodClicked = myOwnFav === 1 ? true : false;
    initBadClicked = myOwnFav === 0 ? true : false;
  }



  const [isGoodClicked, setGoodClicked] = useState(initGoodClicked);
  const [isBadClicked, setBadClicked] = useState(initBadClicked);
  const [numOfGood, setNumOfGood] = useState(props.data.num_of_good);



  const likeSubmit = (data: any, value: number) => {
    const comment_id = data.id;
    const good_or_bad = value;
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.post("/comments/fav", { comment_id, good_or_bad }, options)
      .then(res => { }).catch(err => { })
  };

  const likeDelete = (data: any) => {
    const comment_id = data.id;
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.delete("/comments/fav", { data: { comment_id }, ...options })
      .then(res => { }).catch(err => { })
  }

  const onGoodClick = (e: any) => {
    e.preventDefault();

    if (isBadClicked) {
      setBadClicked(false);
      likeDelete(props.data);
    }

    switch (isGoodClicked) {
      case true:
        setNumOfGood(numOfGood - 1);
        likeDelete(props.data);
        setGoodClicked(false);
        break;
      case false:
        setNumOfGood(numOfGood + 1);
        setGoodClicked(true);
        likeSubmit(props.data, 1);
        break;
    }
  }

  const onBadClick = (e: any) => {
    e.preventDefault();

    if (isGoodClicked) {
      setNumOfGood(numOfGood - 1);
      setGoodClicked(false);
      likeDelete(props.data);
    }

    switch (isBadClicked) {
      case true:
        likeDelete(props.data);
        setBadClicked(false);
        break;
      case false:
        setBadClicked(true);
        likeSubmit(props.data, 0);
        break;
    }
  }


  const goodStyle = isGoodClicked ? { margin: 0, padding: 0, fontSize: 12, color: "#004DBF" } : { margin: 0, padding: 0, fontSize: 12, color: "gray" };
  const badStyle = isBadClicked ? { margin: 0, padding: 0, fontSize: 12, color: "#004DBF" } : { margin: 0, padding: 0, fontSize: 12, color: "gray" };

  const deleteLastNewline = (x: string) => {
    return x.trim();
  }


  return (
    <span style={{ wordWrap: "break-word", whiteSpace: 'pre-wrap' }}>
      <div>&nbsp;{deleteLastNewline(props.data.content)}</div>
      <span>
        <span>&nbsp;&nbsp;
            <ThumbUpIcon onClick={e => onGoodClick(e)} style={goodStyle}></ThumbUpIcon>
            &nbsp;{numOfGood}&nbsp;&nbsp;
            <ThumbDownIcon onClick={e => onBadClick(e)} style={badStyle}></ThumbDownIcon>&nbsp;&nbsp;
            </span>
      </span>
    </span>
  )
}


const nest = (items: any, id = null) =>
  items
    .filter((item: any) => item.parent_id === id)
    .map((item: any) => ({ ...item, children: nest(items, item.id) }));







interface CommentProps extends RouteComponentProps<{}> {
  postId: number;
  isLogin: boolean;
  userObj: any;
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
  isCommentEntered: boolean;
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
      isCommentEntered: false,
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
      return `${years}${i18n.t("eachPost.yearBefore")}`
    } else if (months > 0) {
      return `${months}${i18n.t("eachPost.monthBefore")}`
    } else if (weeks > 0) {
      return `${weeks}${i18n.t("eachPost.weekBefore")}`
    } else if (days > 0) {
      return `${days}${i18n.t("eachPost.dayBefore")}`
    } else if (hours > 0) {
      return `${hours}${i18n.t("eachPost.hourBefore")}`
    } else if (minutes > 0) {
      return `${minutes}${i18n.t("eachPost.minuteBefore")}`
    } else {
      return `${seconds}${i18n.t("eachPost.secondBefore")}`
    }
    // return moment(datetime).fromNow()
  }

  updateData = () => {
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.get(`/comments?post_id=${this.props.postId}&order_by=popular`, options)
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
    if (this.state.isPosted === true) {
      this.updateData();
    }
  }

  componentDidMount() {
    this.updateData();
  }



  baseChange(e: any) {
    this.setState({
      baseCommentContent: e.target.value,
    })
    if (e.target.value.length === 0) {
      this.setState({
        isCommentEntered: false,
      })
    } else {
      this.setState({
        isCommentEntered: true,
      })
    }
  }

  goodSubmit = (e: any, data: any) => {
    const comment_id = data.id;
    const good_or_bad = 1;
    e.preventDefault();
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.post("/comments/fav", { comment_id, good_or_bad }, options)
      .then(res => {

      }).catch(err => {

      })
  };

  badSubmit = (e: any, data: any) => {
    const comment_id = data.id;
    const good_or_bad = 1;
    e.preventDefault();
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.post("/comments/fav", { comment_id }, options)
      .then(res => {

      }).catch(err => {

      })
  };



  baseSubmit(e: any) {
    const url = window.location.pathname.split("/");
    // hearvo.com/posts/777 => url = { ,posts,777}

    if (this.props.isLogin === false) {
      // this.props.history.push("/login");
      this.props.history.push("/login" + "?destination=" + url[1] + '&value=' + url[2]);
      return
    }

    if (this.state.baseCommentContent.replace(/\s+/g, '').length === 0) {
      return
    }


    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.post(
      "/comments",
      { post_id: this.props.postId, content: this.state.baseCommentContent, parent_id: this.state.commentId },
      options)
      .then((res: any) => {
        this.handlePosted(e)
        this.setState({ baseCommentContent: "" });
      }).catch((res: any) => {
      });
    e.preventDefault();
    this.setState({
      isCommentEntered: false,
    })
  }

  click(e: any, id: any) {
    e.preventDefault();
    this.setState({
      commentId: id,
    })
  }


  render() {
    const CommentView = (props: any) => {
      if (this.state.commentId === props.id) {
        return (
          <li className={styles.com_li} key={props.id}>
            <div className={styles.body}>
              <CommentItem userObj={this.props.userObj} data={props}></CommentItem>
              <span style={{ fontSize: "10px", textAlign: "right" }}>by {props.user_info?.name}, {this.getDiffTime(props.created_at.slice(0, -7).replace("T", " "))}</span>

              <span style={{ textAlign: 'right' }}><Button className={styles.reply_cancel} onClick={e => this.click(e, 0)}>{i18n.t("eachPost.cancel")}</Button></span>
              <ReplyComment isLogin={this.props.isLogin} commentId={props.id} postId={this.state.postId} handleParentPosted={this.handlePosted}></ReplyComment>
            </div>
            <ul className={styles.com_ul}>
              {props.children.map((child: any) => <CommentView {...child} />)}
            </ul>
          </li>
        )
      } else {
        return (
          <li className={styles.com_li} key={props.id}>
            <div className={styles.body}>
              <CommentItem userObj={this.props.userObj} data={props}></CommentItem>
              <span style={{ fontSize: "10px", textAlign: "right" }}>by {props.user_info?.name}, {this.getDiffTime(props.created_at.slice(0, -7).replace("T", " "))}</span>

              <span style={{ textAlign: 'right' }}>
                <Button disableRipple className={styles.reply_icon} onClick={e => this.click(e, props.id)}>
                    <ReplyIcon style={{fontSize: 18}}/>{i18n.t("eachPost.reply")}
                </Button>
              </span>
            </div>

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

    if (this.state.isLoaded) {
      return (
        // <StylesProvider injectFirst>
        <div className={styles.comment_body}>
          <div>
            <form onSubmit={e => this.baseSubmit(e)}>
              <div style={{ textAlign: 'center' }}>
                <TextareaAutosize maxLength={1000} placeholder={i18n.t("eachPost.commentPlaceholder")} rows={5} className={styles.base} onChange={e => this.baseChange(e)} value={this.state.baseCommentContent}></TextareaAutosize>
                <div className={styles.submit}>
                  <Button disableRipple type="submit" value="Submit" disabled={!this.state.isCommentEntered}
                    className={this.state.isCommentEntered ? styles.comment_button : styles.disabled_comment_button}
                  >
                    {i18n.t("eachPost.commentButton")}</Button>
                </div>
              </div>

            </form>

          </div>
          <ListComment comments={this.state.nestedComments} />
        </div>
        // </StylesProvider>
      )
    }

    return (
      <div className={styles.comment_body}>
        <div>
          <form onSubmit={e => this.baseSubmit(e)}>
            <div>
              <TextareaAutosize maxLength={1000} rows={5} placeholder={i18n.t("eachPost.commentPlaceholder")} className={styles.base} onChange={e => this.baseChange(e)} value={this.state.baseCommentContent}></TextareaAutosize>
              <div className={styles.submit}>
                <Button disableRipple type="submit" value="Submit" disabled={true}
                  className={styles.disabled_comment_button}
                >
                  {i18n.t("eachPost.commentButton")}</Button>
              </div>
            </div>
          </form>
        </div>
        <div>
          {/* Loading ... */}
        </div>
      </div>
    );

  }
}

export default withRouter(Comment);

