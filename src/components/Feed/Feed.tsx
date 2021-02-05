import React, { useEffect, useState, useRef } from 'react';
import { Button, Dialog } from '@material-ui/core';
import axios from '../Api';

// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'

import NewEachPost from './NewEachPost';


export interface NewFeedProps {
  keyword: string;
  isPosted: boolean;
  isPostedHandeler: any;
  isLogin: boolean;
}
 
export interface NewFeedState {
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
}

interface Params {
  group_id: string;
}
 
class Feed extends React.Component<NewFeedProps, NewFeedState> {

  constructor(props: any) {
    super(props);

    this.state = {
      isLoaded: false,
      voteLoading: false,
      page: 1,
      userObj: JSON.parse(localStorage.getItem("user") || "{}"),
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

    };
    document.title = "Hearvo"
  };

  loader = React.createRef<HTMLInputElement>();

  handleObserver = (entities: any) => {
    const target = entities[0];
    // console.log("target", target)
    if (target.isIntersecting && this.state.page < 50) {
      this.setState({
        page: this.state.page + 1,
      })
    }
  }

  componentDidMount = () => {
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
    let time = keyword === "popular" ? keywordArray.pop() : "today";
    if(time === "popular") {
      time = "today";
    }
    return time;
  };

  birthDayForm = () => {
    const currentYear = new Date().getUTCFullYear();
    let yearOption = [];
    let monthOption = [];
    for (let year = currentYear - 120; year < currentYear; year++) {
      yearOption.push(
        (<option value={year}>{year}</option>)
      )
    }
    for (let month = 1; month <= 12; month++) {
      monthOption.push(
        (<option value={month}>{month}</option>)
      )
    }
    yearOption = yearOption.reverse();
    return (
      <div>
          <label htmlFor="dob-day" >生年</label>
          <div>
          <select name="dob-year" id="dob-year" onChange={e => this.change(e, "editYear")}>
              <option value="">年</option>
              {yearOption}
            </select>
          {/* <select name="dob-month" id="dob-month" onChange={e => this.change(e, "editMonth")}>
              <option value="">月</option>
              {monthOption}
            </select> */}
        </div>
      </div>
    )
  }

  closeDialog = (e: any) => {
    e.preventDefault();

    this.state.userObj.login_count = this.state.userObj.login_count + 1;
    localStorage.setItem("user", JSON.stringify(this.state.userObj));
    const jwt = getJwt();
    axios.put(`/users?login_count=${this.state.userObj.login_count}`,{}, { headers: { Authorization: `Bearer ${jwt}` } })
    .then((res) => {
    }).catch((err) => {
    })
    this.setState({
      editInitialUserInfoForm: false,
    })
  }

  submit(e: any) {
    e.preventDefault();

    // ADD ERROR HANDLING
    if(this.state.editGender.length === 0) {
      this.setState({
        initialSettingMessage: '性別を入力してください'
      })
      return
    }

    if (this.state.editYear.length === 0 || this.state.editYear === '年') {
      this.setState({
        initialSettingMessage: '年齢を入力してください'
      })
      return
    }

    const postObj = {
      gender: this.state.editGender,
      birth_year: this.state.editYear,
      // birth_month: this.state.editMonth,
      occupation: this.state.editOccupation,
    }
    const jwt = getJwt();
    axios.put("/users?initial_setting=true", postObj, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res: any) => {
        this.closeDialog(e);
      }).catch((res: any) => {
        this.setState({
          initialSettingMessage: '内容を確認してください'
        })
      });
  }

  change(e: any, field: string) {
    e.preventDefault();
    this.setState({
      [field]: e.target.value,
    } as unknown as NewFeedState)
  }

  renderInitialUserInfoForm = () => {
    // console.log('this.state.userObj', this.state.userObj)
    // console.log('this.state.userObj.login_count', this.state.userObj.login_count)
    // console.log('this.state.editInitialUserInfoForm', this.state.editInitialUserInfoForm)
    return (
      <div>
        <Dialog open={parseInt(this.state.userObj.login_count) === 1 && this.state.editInitialUserInfoForm}>
          <div style={{ padding: '10px', margin: '10px'}}>
            <h1>ユーザー情報の入力</h1>
            <form onSubmit={e => this.submit(e)}>
              <div style={{paddingTop: '20px'}}>
                性別 {this.state.userObj.gender}
                <div>
                  <select onChange={e => this.change(e, "editGender")}>
                    <option value="">性別</option>
                    <option value="1">女性</option>
                    <option value="0">男性</option>
                    <option value="2">どちらでもない</option>
                  </select>
                </div>
              </div >
                {/* {this.state.userObj.age} */}
              <div style={{ paddingTop: '20px' }}>
                  {this.birthDayForm()}
                </div>

              <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                職業 {this.state.userObj.occupation}
                <div>
                  <input type="string" maxLength={30} placeholder={this.state.userObj.occupation} onChange={e => this.change(e, "editOccupation")}></input>
                </div>
              </div>
            <button>完了</button>
            </form>
            <div style={{color: 'red', textAlign: 'center'}}>
              {this.state.initialSettingMessage ? this.state.initialSettingMessage : ''}
            </div>
          {/* <div style={{ fontSize: '12px' }} onClick={e => this.closeDialog(e)}>あとで入力する</div> */}
          </div>
        </Dialog>
      </div>
    )
  }


  getData = (page: number) => {
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
      feedType = "popular";
    }


    const keyword = keywordArray.includes("popular") ? "popular" : (keywordArray.pop() || "");
    const time = this.getTimeQuery(keyword, keywordArray);
    const jwt = getJwt();



    let newpage; let queryUrl = ""; 
    newpage = page === 0 ? 1 : page;

    switch (feedType) {
      case "search":
        const searchWord = urlParams.get('q') || "";
        const type = urlParams.get('type') || "";
        queryUrl = orderType ? `/posts?search=${searchWord}&type=${type}&page=${page}&keyword=${orderType}` : `/posts?search=${searchWord}&type=${type}&page=${page}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({ dataArray: res.data, isLoaded: true, searchQuery: window.location.search, searchWord: searchWord});
          }).catch((err) => { })
        break;

      case "topic":
        const topicWord = urlParams.get('tp') || "";
        queryUrl = orderType ? `/posts?topic=${topicWord}&page=${newpage}&keyword=${orderType}` : `/posts?topic=${topicWord}&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data],isLoaded: true, topicTitle: topicWord})})
          .catch((err) => { })
        break;

      case "group":
        const tempArray = window.location.pathname.split("/");
        const groupId = tempArray[tempArray.length - 2];
        queryUrl = orderType ? `/posts?group_id=${groupId}&page=${newpage}&keyword=${orderType}` : `/posts?group_id=${groupId}&page=${newpage}`;
        axios.get(`/groups?id=${groupId}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({ groupTitle: res.data.already_joined ? res.data.title : "<このグループは存在しません>"})
            // show the content if the user has joined the group
            if (res.data.already_joined) {
              axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt } })
                .then(res => {
                  this.setState({ dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true  })

                })
                .catch((err) => { this.setState({isLoaded: true}) })
            }
          }).catch((err) => { this.setState({ isLoaded: true }) });

        break;
      
      case "popular":
        axios.get(`/posts?keyword=popular&page=${newpage}&time=${time}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true,});})
          .catch((err) => { })
        break;

      case "latest":
        axios.get(`/posts?keyword=latest&page=${newpage}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({ dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, });
          })
          .catch((err) => { })
        break;

      case "myposts":
        queryUrl = `/posts?keyword=myposts&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({ dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "自分の投稿" })
          })
          .catch((err) => { })
        break;

      case "voted":
        queryUrl = `/posts?keyword=voted&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({ dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "投票済み" })
          })
          .catch((err) => { })
        break;

      default:
        break;
    }

  }

  componentDidUpdate = (prevProps: any, prevState: any) => {
    if (prevState.location !== window.location.href) {
      this.setState({
        location: window.location.href,
        dataArray: [],
      })
      this.getData(0);
    }
    if (prevProps.isPosted !== this.props.isPosted || this.props.isPosted === true) {
      this.getData(0)
      this.props.isPostedHandeler(false);
    }
    if (prevState.page !== this.state.page) {
      this.getData(this.state.page);
    }
  }

  click = (e: any) => {
    if(this.state.page < 49) {
      this.setState({
        page: this.state.page + 1
      })
    }
  }

  render() { 
    if(this.state.isLoaded === false) {
      return (
        <div>
          Loading ...
        </div>
      )
    } else {
      return (
        <div>
          <div>
            {this.renderInitialUserInfoForm()}
            {this.state.miniTitle ? <h3>{this.state.miniTitle}</h3> : ''}
            {this.state.topicTitle ? <h3>トピック {this.state.topicTitle}</h3> : ''}
            {this.state.groupTitle ? <h3>グループ「{this.state.groupTitle}」</h3> : ''}
            {this.state.searchWord ? <h3>「{this.state.searchWord}」の検索結果</h3> : ''}
            {/* <small>{JSON.stringify(this.state.dataArray, null, 2)}</small> */}
          </div>
          <ul className={styles.ul}>
            
            { this.state.dataArray.length > 0 ?
              this.state.dataArray.map((data: any, idx: number) => { return <NewEachPost isLogin={this.props.isLogin} data={data} ></NewEachPost>})
            : 
            "該当なし"
            }            
            
          </ul>

          <div className="loading" ref={this.loader}>
            <h2><button onClick={e => this.click(e)}>More</button></h2>
          </div> 
        </div>
      );
    }
  }
}
 
export default Feed;