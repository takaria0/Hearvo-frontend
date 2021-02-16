import React, { useEffect, useState, useRef } from 'react';
import { Button, Dialog, Checkbox } from '@material-ui/core';
import axios from '../Api';

// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'

import NewEachPost from './NewEachPost';
import TopicFollowButton from '../TopicFollowButton';
import i18n from "../../helpers/i18n";
import initialTopics from '../../helpers/initialTopics';


const INITIAL_TOPICS = initialTopics;

const InitialTopicForm = (props: any) => {

  const [topicList, setTopicList] = useState<any>([]);
  const [saveTopicList, setSaveTopicList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const jwt = getJwt();
  useEffect(() => {
    axios.get(`/topics?initial_topics=${JSON.stringify(INITIAL_TOPICS)}`, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
    .then(res => {
      const addChecked = res.data.map((elem: any) => {return {...elem, checked: false}});
      setTopicList(addChecked);
      setIsLoading(false);
    })
    .catch(err => {
      setIsLoading(false);
    });

  }, [])
  
  const change = (e: any, topic_id: number, topic: string, idx: number) => {

    switch(e.target.checked) {
      case false:
        // delete topic
        let newSaveTopicList = saveTopicList.filter((elem: any) => (elem.id !== topic_id));
        setSaveTopicList(newSaveTopicList);
        return
      
      case true:
        // add topic
        setSaveTopicList([...saveTopicList, { id: topic_id, topic: topic, checked: e.target.checked }]);
    }
  }

  const submit = (e: any) => {
    e.preventDefault();
    const topic_id_list = saveTopicList.map((elem: any) => (elem.id));

    if(topic_id_list.length < 3) {
      setErrorMessage(i18n.t("feed.selectThreeTopics"));
      return
    }

    const jwt = getJwt();
    axios.post("/topics/users", { topic_id_list }, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then((res: any) => {
        props.setFinish(true);
      }).catch((res: any) => {
        setErrorMessage(i18n.t("feed.confirmContent"));
      });
  }

  if(isLoading) {return (<div></div>)}

  return (
  <div>
    <Dialog open={true}>
        <div style={{ paddingLeft: 20}}>
          <h2>{i18n.t("feed.chooseTopic")}</h2>
            <form onSubmit={e => submit(e)} style={{ width: '50ch'}}>
            <ul style={{ columnCount: 3}}>
            {topicList.map((topic: any, idx: number) => {
              return (
              <div>
                  <input type="checkbox" id="" onChange={e => change(e, topic.id, topic.topic, idx)} name={topic.topic} value={topic.id}></input>
                <label htmlFor="subscribeNews">{topic.topic}</label>
              </div>
              )
              })}
            </ul>
              <div style={{ float: 'right', textAlign: 'right', marginRight: 20, marginBottom: 30, marginTop: 20}}>
              <button style={{ paddingRight: 20, paddingLeft: 20, paddingBottom: 5, paddingTop: 5 }} >{i18n.t("feed.save")}</button>
              </div>
              
            </form>
            <div style={{color: 'red'}}>{errorMessage ? errorMessage : ''}</div>
      </div>
    </Dialog>

  </div>
  )
};

const InitialUserInfoForm = (props: any) => {

  const [userObj, setUserObj] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));
  const [gender, setGender] = useState<string>("");
  const [genderDetail, setGenderDetail] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [initialSettingMessage, setInitialSettingMessage] = useState("");

  const submit = (e:any) => {
    e.preventDefault();

    // ADD ERROR HANDLING
    if (gender.length === 0) {
      setInitialSettingMessage(i18n.t("feed.enterGender"));
      return
    }

    if (year.length === 0) {
      setInitialSettingMessage(i18n.t("feed.enterAge"));
      return
    }

    const postObj = { gender: gender, birth_year: year, gender_detail: genderDetail };
    const jwt = getJwt();
    axios.put("/users?initial_setting=true", postObj, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then((res: any) => {
        const resUser = res.data;
        userObj.gender = resUser.gender;
        userObj.birth_year = resUser.year;
        setUserObj(userObj);
        localStorage.setItem("user", JSON.stringify(resUser));
        props.setFinish(true);
      }).catch((res: any) => {
        setInitialSettingMessage(i18n.t("feed.confirmContent"));
      });
  }

  const birthDayForm = () => {
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
        <label htmlFor="dob-day" >{i18n.t("feed.birthYear")}</label>
        <div>
          <select name="dob-year" id="dob-year" onChange={e => setYear(e.target.value)}>
            <option value="">{i18n.t("feed.year")}</option>
            {yearOption}
          </select>
        </div>
      </div>
    )
  }
  return (
    <div>
      {/* <Dialog open={parseInt(props.data.userObj.login_count) === 1 && props.data.editInitialUserInfoForm}> */}
      <Dialog open={userObj.gender === null || userObj.birth_year === null}>
        <div style={{ padding: '10px', margin: '10px' }}>
          <h1>{i18n.t("feed.inputUserInfo")}</h1>
          <form onSubmit={e => submit(e)}>
            <div style={{ paddingTop: '20px' }}>
              性別
              <div>
                <select onChange={e => setGender(e.target.value)}>
                  <option value="">{i18n.t("feed.gender")}</option>
                  <option value="1">{i18n.t("feed.female")}</option>
                  <option value="0">{i18n.t("feed.male")}</option>
                  <option value="2">{i18n.t("feed.other")}</option>
                </select>
              </div>
              <div>
                {gender === "2" ? <div><br></br><input type="text" placeholder={i18n.t("feed.freeForm")} maxLength={20} onChange={e => setGenderDetail(e.target.value)}></input></div> : ''}
              </div>
            </div >
            {/* {props.data.userObj.age} */}
            <div style={{ paddingTop: '20px' }}>
              {birthDayForm()}
            </div>
            <br></br><br></br>
            <span style={{ float: 'right', textAlign: 'right', padding: 10 }}><button style={{ paddingRight: 20, paddingLeft: 20, paddingBottom: 5, paddingTop: 5 }}>{i18n.t("feed.done")}</button></span>
            
          </form>
          <div style={{ color: 'red', textAlign: 'center' }}>
            {initialSettingMessage ? initialSettingMessage : ''}
          </div>

        </div>
      </Dialog>
    </div>
  )
}


const InitialForm = (props: any) => {

  const [isUserInfoFinished, setIsUserInfoFinished] = useState(false);
  const [isTopicFormFinished, setIsTopicFormFinished] = useState(false);

  const closeDialog = () => {

    props.data.userObj.login_count = props.data.userObj.login_count + 1;
    localStorage.setItem("user", JSON.stringify(props.data.userObj));
    const jwt = getJwt();
    axios.put(`/users?login_count=${props.data.userObj.login_count}`, {}, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
    .then((res) => {
    }).catch((err) => {
    })
  }
  
  if (isUserInfoFinished && isTopicFormFinished) {
    closeDialog();
    return (<span></span>);
  }

  if (isUserInfoFinished && !isTopicFormFinished) {
    return (<InitialTopicForm data={props.data} setFinish={setIsTopicFormFinished}></InitialTopicForm>);
  }

  return (<InitialUserInfoForm data={props.data} setFinish={setIsUserInfoFinished}></InitialUserInfoForm>);
}


export interface FeedProps {
  keyword: string;
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
}

interface Params {
  group_id: string;
}
 
class Feed extends React.Component<FeedProps, FeedState> {

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


  change(e: any, field: string) {
    e.preventDefault();
    this.setState({
      [field]: e.target.value,
    } as unknown as FeedState)
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
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: res.data, isLoaded: true, searchQuery: window.location.search, searchWord: searchWord});
          }).catch((err) => { })
        break;

      case "topic":
        const topicWord = urlParams.get('tp') || "";
        queryUrl = orderType ? `/posts?topic=${topicWord}&page=${newpage}&keyword=${orderType}` : `/posts?topic=${topicWord}&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data],isLoaded: true, topicTitle: topicWord})})
          .catch((err) => { })
        break;

      case "group":
        const tempArray = window.location.pathname.split("/");
        const groupId = tempArray[tempArray.length - 2];
        queryUrl = orderType ? `/posts?group_id=${groupId}&page=${newpage}&keyword=${orderType}` : `/posts?group_id=${groupId}&page=${newpage}`;
        axios.get(`/groups?id=${groupId}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ groupTitle: res.data.already_joined ? res.data.title : i18n.t("feed.groupDoesntExist")})
            // show the content if the user has joined the group
            if (res.data.already_joined) {
              axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
                .then(res => {
                  this.setState({ dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true  })

                })
                .catch((err) => { this.setState({isLoaded: true}) })
            }
          }).catch((err) => { this.setState({ isLoaded: true }) });

        break;
      
      case "popular":
        axios.get(`/posts?keyword=popular&page=${newpage}&time=${time}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true,});})
          .catch((err) => { })
        break;

      case "latest":
        axios.get(`/posts?keyword=latest&page=${newpage}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, });
          })
          .catch((err) => { })
        break;

      case "myposts":
        queryUrl = `/posts?keyword=myposts&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "" })
          })
          .catch((err) => { })
        break;

      case "voted":
        queryUrl = `/posts?keyword=voted&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: page === 0 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "" })
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
        </div>
      )
    } else {
      return (
        <div>
          <div>
            <InitialForm data={this.state}></InitialForm>
            {this.state.miniTitle ? <h3>{this.state.miniTitle}</h3> : ''}
            {this.state.topicTitle ? <span><b style={{ fontSize: '1.17em'}}>{i18n.t("feed.topic")} {this.state.topicTitle}</b> <TopicFollowButton topicWord={this.state.topicTitle}></TopicFollowButton></span> : ''}
            {this.state.groupTitle ? <h3>{i18n.t("feed.group")} {this.state.groupTitle}</h3> : ''}
            {this.state.searchWord ? <h3>{this.state.searchWord} {i18n.t("feed.searchResult")}</h3> : ''}
          </div>
          <ul className={styles.ul}>
            
            { this.state.dataArray.length > 0 ?
              this.state.dataArray.map((data: any, idx: number) => { return <NewEachPost isLogin={this.props.isLogin} data={data} ></NewEachPost>})
            : 
            i18n.t("feed.noContent") 
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