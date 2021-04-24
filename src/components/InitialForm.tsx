import React, { useEffect, useState, useRef, useMemo, } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Button, Dialog, Checkbox, MenuItem, FormControl, Select, InputLabel, makeStyles, Theme, createStyles, TextField, FormHelperText, List, ListItem, ListItemText, useMediaQuery} from '@material-ui/core';
import axios from './Api';
// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../css/Feed.module.css';
import { getJwt } from '../helpers/jwt';
import i18n from "../helpers/i18n";
import initialTopics from '../helpers/initialTopics';

const INITIAL_TOPICS = initialTopics;

const InitialUserInfoForm = (props: any) => {
  let initialUser = {};
  if (typeof window !== 'undefined') { initialUser = JSON.parse(localStorage.getItem("user") || "{}"); }
  const [userObj, setUserObj] = useState<any>(initialUser);
  const [genderOpen, setGenderOpen] = useState<any>(false);
  const [gender, setGender] = useState<string>("");
  const [genderDetail, setGenderDetail] = useState<string>("");
  const [yearOpen, setYearOpen] = useState<any>(false);
  const [year, setYear] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
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

    if (firstName.length === 0 || lastName.length === 0) {
      setInitialSettingMessage(i18n.t("feed.enterName"));
      return
    }

    const postObj = { gender: gender, birth_year: year, gender_detail: genderDetail, first_name: firstName, middle_name: middleName, last_name: lastName };
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.put("/users?initial_setting=true", postObj, options)
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



  const userNameForm = () => {
    return (
      <div>
        <div>
          <input style={inlineStyles.inputName} placeholder={"First Name"} maxLength={100} onChange={(e) => setFirstName(e.target.value as string)}></input>
        </div>
        <div>
          <input style={inlineStyles.inputName} placeholder={"Last Name"} maxLength={100} onChange={(e) => setLastName(e.target.value as string)}></input>
        </div>
        <div>
          <input style={inlineStyles.inputName} placeholder={"Middle Name (Optional)"} maxLength={100} onChange={(e) => setMiddleName(e.target.value as string)}></input>
        </div>
      </div>
    )
  };

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

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel>{i18n.t("feed.gender")}</InputLabel>
          <Select
            open={genderOpen}
            onClose={() => setGenderOpen(false)}
            onOpen={() => setGenderOpen(true)}
            value={gender}
            onChange={(e) => setGender(e.target.value as string)}
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
                  {i18n.t("feed.freeForm")}
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

    return (
      <FormControl className={classes.formControl}>
        <InputLabel>{i18n.t("feed.birthYear")}</InputLabel>
        <Select
          open={yearOpen}
          onClose={() => setYearOpen(false)}
          onOpen={() => setYearOpen(true)}
          onChange={(e) => setYear(e.target.value as string)}
        >
          <MenuItem value="">{i18n.t("feed.year")}</MenuItem>
          {yearOption}
        </Select>
      </FormControl>
    )
  }

  return (
    <div>
      <Dialog open={userObj.gender === null || userObj.birth_year === null}>
        <div style={{ padding: '10px', margin: '10px' }}>
          <h1>{i18n.t("feed.inputUserInfo")}</h1>
          <form onSubmit={e => submit(e)}>
            <div>
              {userNameForm()}
            </div>
            <br></br>
            <div>
              {genderForm()}
            </div>
            <br></br>
            <div>
              {birthDayForm()}
            </div>
            <br></br>
            <br></br>
            <span style={{ float: 'right', textAlign: 'right', }}>
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

const InitialTopicForm = (props: any) => {

  const [topicList, setTopicList] = useState<any>([]);
  const [saveTopicList, setSaveTopicList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const jwt = getJwt();
  let options = {};
  if (!jwt) {
    options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
  } else {
    options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
  }
  useEffect(() => {
    axios.get(`/topics?initial_topics=${JSON.stringify(INITIAL_TOPICS)}`, options)
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

    // if (topic_id_list.length < 3) {
    //   setErrorMessage(i18n.t("feed.selectThreeTopics"));
    //   return
    // }

    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.post("/topics/users", { topic_id_list }, options)
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
    </div>
  )
};

const InitialForm = () => {

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

    // if (typeof window !== 'undefined') {};
    const jwt = getJwt();
    let options = {};
    if (!jwt) {
      options = { headers: { Country: process.env.REACT_APP_COUNTRY } };
    } else {
      options = { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } }
    }
    axios.get(`/users`, options)
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
    return (<InitialTopicForm  setFinish={setIsTopicFormFinished}></InitialTopicForm>);
  }

  return (<InitialUserInfoForm  setFinish={setIsUserInfoFinished}></InitialUserInfoForm>);
}



const inlineStyles = {
  inputName: {
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    padding: 7,
  }
};


export default InitialForm;