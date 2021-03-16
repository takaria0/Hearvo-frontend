import React, { useEffect, useState, useRef, useMemo, } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Button, Dialog, Checkbox, MenuItem, FormControl, Select, InputLabel, makeStyles, Theme, createStyles, TextField, FormHelperText, List, ListItem, ListItemText, useMediaQuery} from '@material-ui/core';
import axios from '../Api';

import CommentIcon from '@material-ui/icons/Comment';

// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'

import NewEachPost from './NewEachPost';
import TopicFollowButton from '../TopicFollowButton';
import i18n from "../../helpers/i18n";
import initialTopics from '../../helpers/initialTopics';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { BorderColor } from '@material-ui/icons';

const INITIAL_TOPICS = initialTopics;


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



const InitialTopicForm = (props: any) => {

  const [topicList, setTopicList] = useState<any>([]);
  const [saveTopicList, setSaveTopicList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const jwt = getJwt();
  useEffect(() => {
    axios.get(`/topics?initial_topics=${JSON.stringify(INITIAL_TOPICS)}`, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then(res => {
        const addChecked = res.data.map((elem: any) => { return { ...elem, checked: false } });
        setTopicList(addChecked);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });

  }, [])

  const change = (e: any, topic_id: number, topic: string, idx: number) => {

    switch (e.target.checked) {
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

    if (topic_id_list.length < 3) {
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

  if (isLoading) { return (<div></div>) }

  return (
    <div>
      <Dialog open={true} fullScreen={fullScreen}>
        <form className={styles.initial_topic} onSubmit={e => submit(e)}>
          <List style={{ maxHeight: "75ch", overflow: "auto" }}>
            <h2 style={{ textAlign: "center", padding: "2ch 3.2ch" }}>{i18n.t("feed.chooseTopic")}</h2>
            {topicList.map((topic: any, idx: number) => {
              return (
                <div>
                  <ListItem style={{ borderBottom: "solid", borderWidth: "1px", borderColor: "#9E9E9E", }}>
                    <ListItemText primary={topic.topic} style={{ marginLeft: "2ch" }} />
                    <Checkbox onChange={e => change(e, topic.id, topic.topic, idx)} name={topic.topic} value={topic.id} style={{ marginRight: "0.5ch" }} color="primary" />
                  </ListItem>
                </div>
              )
            })}
          </List>
          <div>
            <div style={{ color: 'red', textAlign:"center", height:0, lineHeight:6,}}>{errorMessage ? errorMessage : ''}</div>
            <div style={{ float: 'right', textAlign: 'right', marginRight: 20, marginBottom: 30, marginTop: 30 }}>
              <Button type="submit" variant="contained" color="primary">
                {i18n.t("feed.save")}
              </Button>
            </div>
          </div>
        </form>
      </Dialog>


      {/* <Dialog open={true}>
        <div>
          <h2 style={{ textAlign: "center" }}>{i18n.t("feed.chooseTopic")}</h2>
          <form onSubmit={e => submit(e)} style={{ width: '50ch' }}>
            <ul style={{ columnCount: 3 }}>
              {topicList.map((topic: any, idx: number) => {
                return (
                  <div>
                    <input type="checkbox" id="" onChange={e => change(e, topic.id, topic.topic, idx)} name={topic.topic} value={topic.id}></input>
                    <label htmlFor="subscribeNews">{topic.topic}</label>
                  </div>
                )
              })}
            </ul>
            <div style={{ float: 'right', textAlign: 'right', marginRight: 20, marginBottom: 30, marginTop: 20 }}>
              <button style={{ paddingRight: 20, paddingLeft: 20, paddingBottom: 5, paddingTop: 5 }} >{i18n.t("feed.save")}</button>
            </div>

          </form>
          <div style={{ color: 'red' }}>{errorMessage ? errorMessage : ''}</div>
        </div>
      </Dialog> */}
    </div>
  )
};

const InitialUserInfoForm = (props: any) => {
  let initialUser = {};
  if (typeof window !== 'undefined') { initialUser = JSON.parse(localStorage.getItem("user") || "{}"); }
  const [userObj, setUserObj] = useState<any>(initialUser);
  const [genderOpen, setGenderOpen] = useState<any>(false);
  const [gender, setGender] = useState<string>("");
  const [genderDetail, setGenderDetail] = useState<string>("");
  const [yearOpen, setYearOpen] = useState<any>(false);
  const [year, setYear] = useState<string>("");
  const [initialSettingMessage, setInitialSettingMessage] = useState("");

  const submit = (e: any) => {
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
        if (typeof window !== 'undefined') { localStorage.setItem("user", JSON.stringify(resUser)) };
        props.setFinish(true);
      }).catch((res: any) => {
        setInitialSettingMessage(i18n.t("feed.confirmContent"));
      });
  }

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        '& > *': {
          margin: theme.spacing(1),
          width: '25ch',
        },
      },
      button: {
        display: 'block',
        marginTop: theme.spacing(2),
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: '25ch',
      },
      selectEmpty_gender: i18n.t("feed.gender"),
    }),
  );

  const classes = useStyles();

  const genderForm = () => {

    const handleChange = (e: any) => {
      setGender(e.target.value)
    };

    const handleClose = () => {
      setGenderOpen(false);
    };

    const handleOpen = () => {
      setGenderOpen(true);
    };

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel>{i18n.t("feed.gender")}</InputLabel>
          <Select
            open={genderOpen}
            onClose={handleClose}
            onOpen={handleOpen}
            value={gender}
            onChange={handleChange}
          // displayEmpty
          // className={classes.selectEmpty_gender}
          >
            <MenuItem value="">{i18n.t("feed.gender")}</MenuItem>
            <MenuItem value="1">{i18n.t("feed.female")}</MenuItem>
            <MenuItem value="0">{i18n.t("feed.male")}</MenuItem>
            <MenuItem value="2">{i18n.t("feed.other")}</MenuItem>
          </Select>
        </FormControl>
        <div>
          {gender === "2"
            ?
            <div>
              <form className={classes.root} noValidate autoComplete="off">
                <FormHelperText>
                  <TextField onChange={e => setGenderDetail(e.target.value)} />
                  {i18n.t("feed.freeform")}
                </FormHelperText></form>
            </div>
            : ''}
        </div>
      </div>
    )
  }

  const birthDayForm = () => {
    const currentYear = new Date().getUTCFullYear();
    let yearOption = [];
    let monthOption = [];

    for (let year = currentYear - 120; year < currentYear; year++) {
      yearOption.push(
        (<MenuItem value={year}>{year}</MenuItem>)
      )
    }
    for (let month = 1; month <= 12; month++) {
      monthOption.push(
        (<MenuItem value={month}>{month}</MenuItem>)
      )
    }

    yearOption = yearOption.reverse();

    const handleChange = (e: any) => {
      setYear(e.target.value)
    };

    const handleClose = () => {
      setYearOpen(false);
    };

    const handleOpen = () => {
      setYearOpen(true);
    };

    return (
      <FormControl className={classes.formControl}>
        <InputLabel>{i18n.t("feed.birthYear")}</InputLabel>
        <Select
          open={yearOpen}
          onClose={handleClose}
          onOpen={handleOpen}
          // value={year}
          onChange={handleChange}
        >
          <MenuItem value="">{i18n.t("feed.year")}</MenuItem>
          {yearOption}
        </Select>
      </FormControl>

      // <div>
      //   <label htmlFor="dob-day" >{i18n.t("feed.birthYear")}</label>
      //   <div>
      //     <select name="dob-year" id="dob-year" onChange={e => setYear(e.target.value)}>
      //       <option value="">{i18n.t("feed.year")}</option>
      //       {yearOption}
      //     </select>
      //   </div>
      // </div>
    )
  }

  return (
    <div>
      {/* <Dialog open={parseInt(props.data.userObj.login_count) === 1 && props.data.editInitialUserInfoForm}> */}
      <Dialog open={userObj.gender === null || userObj.birth_year === null}>
        <div style={{ padding: '10px', margin: '10px' }}>
          <h1>{i18n.t("feed.inputUserInfo")}</h1>
          <form onSubmit={e => submit(e)}>
            <div>
              {genderForm()}
            </div>

            <br></br>
            {/* <div style={{ paddingTop: '20px' }}>
              {i18n.t("feed.gender")}
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
            </div > */}

            {/* {props.data.userObj.age} */}

            <div>
              {birthDayForm()}
            </div>

            <br></br>
            <br></br>

            <span style={{ float: 'right', textAlign: 'right', }}>
              {/* <button style={{ paddingRight: 20, paddingLeft: 20, paddingBottom: 5, paddingTop: 5 }}>{i18n.t("feed.done")}</button> */}
              <Button type="submit" variant="contained" color="primary">{i18n.t("feed.done")}</Button>
            </span>

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

  // useEffect(() => {
  //   const userObj = JSON.parse(localStorage.getItem("user") || "{}");

  //   if (userObj.gender && userObj.birth_year) {
  //     setIsUserInfoFinished(true);
  //     setIsTopicFormFinished(true);
  //   }

  // });

  const closeDialog = () => {

    props.data.userObj.login_count = props.data.userObj.login_count + 1;
    // if (typeof window !== 'undefined') {};
    const jwt = getJwt();
    axios.get(`/users`, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
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
      feedType = "recommend";
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
            this.setState({ dataArray: res.data, isLoaded: true, searchQuery: window.location.search, searchWord: searchWord });
          }).catch((err) => { this.setState({ isLoaded: true, searchWord: searchWord, searchQuery: window.location.search }) })
        break;

      case "topic":
        const topicWord = urlParams.get('tp') || "";
        queryUrl = orderType ? `/posts?topic=${topicWord}&page=${newpage}&keyword=${orderType}` : `/posts?topic=${topicWord}&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data.posts : [...this.state.dataArray, ...res.data.posts], isLoaded: true, topicTitle: topicWord, topicNumPosts: res.data.topic.num_of_posts, topicNumUsers: res.data.topic.num_of_users })
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "group":
        const tempArray = window.location.pathname.split("/");
        const groupId = tempArray[tempArray.length - 2];
        queryUrl = orderType ? `/posts?group_id=${groupId}&page=${newpage}&keyword=${orderType}` : `/posts?group_id=${groupId}&page=${newpage}`;
        axios.get(`/groups?id=${groupId}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ groupTitle: res.data.already_joined ? res.data.title : i18n.t("feed.groupDoesntExist") })
            // show the content if the user has joined the group
            if (res.data.already_joined) {
              axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
                .then(res => {
                  this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true })

                })
                .catch((err) => { this.setState({ isLoaded: true }) })
            }
          }).catch((err) => { this.setState({ isLoaded: true }) });

        break;

      case "popular":
        axios.get(`/posts?keyword=popular&page=${newpage}&time=${time}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, });
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "latest":
        axios.get(`/posts?keyword=latest&page=${newpage}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, });
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "myposts":
        queryUrl = `/posts?keyword=myposts&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "" })
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "voted":
        queryUrl = `/posts?keyword=voted&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
          .then(res => {
            this.setState({ dataArray: page === 1 ? res.data : [...this.state.dataArray, ...res.data], isLoaded: true, miniTitle: "" })
          })
          .catch((err) => { this.setState({ isLoaded: true }) })
        break;

      case "recommend":
        queryUrl = `/posts?keyword=recommend&page=${newpage}`;
        axios.get(queryUrl, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
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
    let feedArray = this.state.dataArray.map((data: any, idx: number) => { return <NewEachPost isLogin={this.props.isLogin} data={data} ></NewEachPost> });
    feedArray.splice(1, 0, <GoogleAdTimeLine />);
    feedArray.splice(10, 0, <GoogleAdTimeLine />);
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
            <InitialForm data={this.state}></InitialForm>
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