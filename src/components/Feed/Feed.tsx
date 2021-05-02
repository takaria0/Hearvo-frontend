import React, { useEffect, useState, useRef, useMemo, } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Button, Dialog, Checkbox, MenuItem, FormControl, Select, InputLabel, makeStyles, Theme, createStyles, TextField, FormHelperText, List, ListItem, ListItemText, useMediaQuery } from '@material-ui/core';
import axios from '../Api';

import CommentIcon from '@material-ui/icons/Comment';

// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'

import EachPost from './EachPost';
import TopicFollowButton from '../Topic/TopicFollowButton';
import i18n from "../../helpers/i18n";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { BorderColor } from '@material-ui/icons';
import InitialForm from '../InitialForm';



const GoogleAdTimeLine = (props: any) => {
  const currentFirstURL = window.location.pathname;
  const [currentUrl, setCurrentUrl] = useState(currentFirstURL);

  useEffect(() => {
    if (window.adsbygoogle && process.env.REACT_APP_ENV !== "dev") {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, [currentUrl])

  return (
    <div className={styles.li}>
      <div style={{ padding: 5 }}>
        {/* <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-9487157880259062"
          data-ad-slot="9919085375"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins> */}
        {/* <ins className="adsbygoogle"
          style={{display:"block"}}
          data-ad-format="fluid"
          data-ad-layout-key="-fw-2j-1z-4k+xg"
          data-ad-client="ca-pub-9487157880259062"
          data-ad-slot="6631411206"></ins> */}
        <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="-g3-2s+16+a+ey"
          data-ad-client="ca-pub-9487157880259062"
          data-ad-slot="9421226074"></ins>
      </div>
    </div>
  )
}









const TopicHeader = (props: any) => {

  if (!props.topicTitle) return (<span></span>);


  return (
    <div style={{ backgroundColor: 'white', padding: 10, border: 'solid', borderWidth: 1, borderRadius: 7 }}>
      <span >
        <b style={{ fontSize: '1.17em' }}>{i18n.t("feed.topic")} {props.topicTitle}</b>
        <TopicFollowButton topicWord={props.topicTitle}></TopicFollowButton>
        <div>
          {i18n.t("feed.posts")} {props.topicNumPosts} {i18n.t("feed.following")} {props.topicNumUsers}
        </div>
      </span>
    </div>
  )
}


export interface FeedProps {
  // keyword: string;
  isPosted: boolean;
  isPostedHandeler: any;
  isLogin: boolean;
}

export interface FeedState {
  isLoaded: boolean,
  voteLoading: boolean,
  page: number,
  dataArray: any[],
  location: string;
  searchQuery: string;
  userObj: any;
  editInitialUserInfoForm: boolean;
  editGender: string;
  editAge: string;
  editOccupation?: string;
  editYear: string;
  editMonth: string;
  initialSettingMessage: string;
  topicTitle: string;
  groupTitle: string;
  searchWord: string;
  miniTitle: string;
  topicNumPosts: number;
  topicNumUsers: number;
}

interface Params {
  group_id: string;
}

class Feed extends React.Component<FeedProps, FeedState> {

  constructor(props: any) {
    super(props);

    let initialUser = {};

    this.state = {
      isLoaded: false,
      voteLoading: false,
      page: 1,
      userObj: initialUser,
      editInitialUserInfoForm: true,
      dataArray: [],
      location: window.location.href,
      searchQuery: "",
      editGender: "",
      editAge: "",
      editOccupation: "",
      editYear: '',
      editMonth: '',
      initialSettingMessage: '',
      topicTitle: '',
      groupTitle: "",
      searchWord: "",
      miniTitle: "",
      topicNumPosts: 0,
      topicNumUsers: 0,
    };
    document.title = "Hearvo"
  };

  loader = React.createRef<HTMLInputElement>();

  handleObserver = (entities: any) => {
    const target = entities[0];
    if (target.isIntersecting && this.state.page < 50) {
      this.setState({
        page: this.state.page + 1,
      })
    }
  }

  componentDidMount = () => {
    if (typeof window !== 'undefined') { this.setState({ userObj: JSON.parse(localStorage.getItem("user") || "{}") }) }
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(this.handleObserver, options);
    if (this.loader.current) {
      observer.observe(this.loader.current)
    }
    this.getData(this.state.page);
  };

  getTimeQuery = (keyword: string, keywordArray: string[]) => {
    let time = keyword === "popular" ? keywordArray.pop() : "week";
    if (time === "popular") {
      time = "week";
    }
    return time;
  };


  change(e: any, field: string) {
    e.preventDefault();
    this.setState({
      [field]: e.target.value,
    } as unknown as FeedState)
  }


  getData = (page: number) => {
    if (page > 1) {
      this.setState({ isLoaded: true, searchWord: "", topicTitle: "" });
    } else {
      this.setState({ isLoaded: false, searchWord: "", topicTitle: "" });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const keywordArray = window.location.pathname.split("/");

    let feedType = ""; let orderType = "";
    if (keywordArray.includes("topic")) {
      feedType = "topic";
    }
    if (keywordArray.includes("search")) {
      feedType = "search";
    }
    if (keywordArray.includes("group")) {
      feedType = "group";
    }
    if (keywordArray.includes("popular")) {
      feedType = "popular";
    }
    if (keywordArray.includes("latest")) {
      feedType = "latest";
    }
    if (keywordArray.includes("recommend")) {
      feedType = "recommend";
    }
    if (keywordArray.includes("myposts")) {
      feedType = "myposts";
    }
    if (keywordArray.includes("voted")) {
      feedType = "voted";
    }
    if (urlParams.has("order_by") && urlParams.get("order_by") === "popular") {
      orderType = "popular";
    }
    if (urlParams.has("order_by") && urlParams.get("order_by") === "latest") {
      orderType = "latest";
    }
    if (window.location.pathname === "/") {
      // feedType = "recommend"; // set latest as default instead for a while
      feedType = "latest";
    }



    const keyword = keywordArray.includes("popular") ? "popular" : (keywordArray.pop() || "");
    const time = this.getTimeQuery(keyword, keywordArray);
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }


    let newpage; let queryUrl = "";
    newpage = page === 0 ? 1 : page;


    switch (feedType) {
      case "search":
        const searchWord = urlParams.get('q') || "";
        const type = urlParams.get('type') || "";
        queryUrl = orderType ? `/posts?search=${searchWord}&type=${type}&page=${page}&keyword=${orderType}` : `/posts?search=${searchWord}&type=${type}&page=${page}`;
        axios.get(queryUrl, options)
          .then(res => {
            this.setState({ dataArray: res.data, isLoaded: true, searchQuery: window.location.search, searchWord: searchWord });
          }).catch((err) => { this.setState({ isLoaded: true, searchWord: searchWord, searchQuery: window.location.search }) })
        break;

      case "topic":
        const topicWord = urlParams.get('tp') || "";
        queryUrl = orderType ? `/posts?topic=${topicWord}&page=${newpage}&keyword=${orderType}` : `/posts?topic=${topicWord}&page=${newpage}`;
        axios.get(queryUrl, options)
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data.posts : [...this.state.dataArray, ...res.data.posts], isLoaded: true, topicTitle: topicWord, topicNumPosts: res.data.topic.num_of_posts, topicNumUsers: res.data.topic.num_of_users })
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "group":
        const tempArray = window.location.pathname.split("/");
        const groupId = tempArray[tempArray.length - 2];
        queryUrl = orderType ? `/posts?group_id=${groupId}&page=${newpage}&keyword=${orderType}` : `/posts?group_id=${groupId}&page=${newpage}`;
        axios.get(`/groups?id=${groupId}`, options)
          .then(res => {
            this.setState({ groupTitle: res.data.already_joined ? res.data.title : i18n.t("feed.groupDoesntExist") })
            // show the content if the user has joined the group
            if (res.data.already_joined) {
              axios.get(queryUrl, options)
                .then(res => {
                  this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true })

                })
                .catch((err) => { this.setState({ isLoaded: true }) })
            }
          }).catch((err) => { this.setState({ isLoaded: true }) });

        break;

      case "popular":
        axios.get(`/posts?keyword=popular&page=${newpage}&time=${time}`, options)
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, });
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "latest":
        axios.get(`/posts?keyword=latest&page=${newpage}`, options)
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, });
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "myposts":
        queryUrl = `/posts?keyword=myposts&page=${newpage}`;
        axios.get(queryUrl, options)
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "" })
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "voted":
        queryUrl = `/posts?keyword=voted&page=${newpage}`;
        axios.get(queryUrl, options)
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "" })
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "recommend":
        queryUrl = `/posts?keyword=recommend&page=${newpage}`;
        axios.get(queryUrl, options)
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "" })
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      default:
        break;
    }

  }

  componentDidUpdate = (prevProps: any, prevState: any) => {
    if (prevState.location !== window.location.href) {
      this.setState({
        location: window.location.href,
        dataArray: []
      });
      this.getData(1);
    }
    if (prevProps.isPosted !== this.props.isPosted || this.props.isPosted === true) {
      this.getData(1)
      this.props.isPostedHandeler(false);
    }
    if (prevState.page !== this.state.page) {
      this.getData(this.state.page);
    }
  }

  click = (e: any) => {
    if (this.state.page < 49) {
      this.setState({
        page: this.state.page + 1
      })
    }
  }



  feedList = () => {
    let feedArray = this.state.dataArray.map((data: any, idx: number) => { return <EachPost post_detail_id={""} isLogin={this.props.isLogin} data={data} ></EachPost> });
    // feedArray.splice(1, 0, <GoogleAdTimeLine />);
    // feedArray.splice(10, 0, <GoogleAdTimeLine />);
    // Adsを非表示
    return (
      <span>
        {feedArray}
      </span>
    )
  }

  render() {
    if (this.state.isLoaded === false) {
      const skeletonList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      return (
        <div>
          {skeletonList.map((elem: any) => (
            <SkeletonTheme color="#FFFFFF" highlightColor="#E2E2E2">
              <p style={{ border: 'solid', borderWidth: 1, borderRadius: 6 }}><Skeleton duration={0.8} height={250} /></p>
            </SkeletonTheme>
          ))}
        </div>
      )
    }


    if (this.state.isLoaded === true) {
      return (
        <div>
          <div>
            <InitialForm></InitialForm>
            {this.state.miniTitle ? <h3>{this.state.miniTitle}</h3> : ''}
            <TopicHeader topicTitle={this.state.topicTitle} topicNumUsers={this.state.topicNumUsers} topicNumPosts={this.state.topicNumPosts} ></TopicHeader>
            {this.state.groupTitle ? <h3>{i18n.t("feed.group")} {this.state.groupTitle}</h3> : ''}
            {this.state.searchWord ? <h3>{this.state.searchWord} {i18n.t("feed.searchResult")}</h3> : ''}
          </div>
          <ul className={styles.ul}>

            {this.state.dataArray.length > 0 ?
              this.feedList()
              :
              <div><div>{i18n.t("feed.noContent")}</div><div>{i18n.t("feed.followMore")}</div></div>
            }

          </ul>

          <div className="loading" ref={this.loader}>
            <h2><button onClick={e => this.click(e)}>{i18n.t("feed.more")}</button></h2>
          </div>
        </div>
      );
    }
  }
}

export default Feed;