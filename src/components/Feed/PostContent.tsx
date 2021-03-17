import React, { useState, useEffect, useRef } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import { useHistory } from "react-router";

import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed/PostContent.module.css';
import Feed from './Feed';
import { Dialog, DialogContent, DialogTitle, NativeSelect, Button } from '@material-ui/core';
import i18n from "../../helpers/i18n";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { stringify } from 'querystring';
import { Mixpanel } from '../../helpers/mixpanel';

import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CloseIcon from '@material-ui/icons/Close';

/*
If the values are incorrect,
return true
*/
const hasIncorrectInput = (title: string, content: string, topic: [], vote_type_id: number, end_at: string, group_id: string, vote_obj: [], mjOptionList: []) => {


  if (title.length === 0) {
    return true;
  }

  if (topic.length === 0) {
    return true;
  }

  if (vote_type_id === 2) {
    const result = mjOptionList.filter((elem: any) => (elem.length === 0))
    if (result.length !== 0) return true;
  }

  if (vote_type_id === 1 || vote_type_id === 2) {
    const result = vote_obj.filter((elem: any) => (elem.length === 0))
    if (result.length !== 0) return true;
  }



  return false;

};

const ConfirmDialog = (props: any) => {

  return (
    <Dialog open={true}>
      <div style={{ padding: 50 }}>
        <button onClick={e => { props.setIsConfirm(false) }}>{i18n.t("newPost.cancel")}</button>
        <div>
          <h4>{i18n.t("newPost.title")}</h4>
          {props.postObj.title}
        </div>
        <div>
          <h4>{i18n.t("newPost.content")}</h4>
          {props.postObj.content}
        </div>
        <div>
          <h4>{i18n.t("newPost.end")}</h4>
          {props.postObj.end_at}
        </div>
        <div>
          <h4>{i18n.t("newPost.topic")}</h4>
          {props.postObj.topic}
        </div>
        {/* <div>
        {props.postObj.group_id}
      </div> */}
        <div>
          <h4>{i18n.t("newPost.voteCandidate")}</h4>
          {JSON.stringify(props.postObj.vote_obj)}
        </div>
        <div>
          <h4>{i18n.t("newPost.voteCandidate")}</h4>
          {JSON.stringify(props.postObj.children)}
        </div>
        <div>
          <button onClick={e => props.submit(e)}>{i18n.t("newPost.post")}</button>
        </div>
      </div>
    </Dialog>
  )
}

const VoteCandidateForm = (props: any) => {

  const [voteData, setVoteData] = useState<any>(['', '']);
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const history = useHistory();


  const voteSelectChange = (e: any, idx: number) => {
    e.preventDefault();
    let values;

    switch (props.voteTypeId) {
      case 3:
        let updateVoteDataList = props.voteDataList;
        values = [...props.voteDataList[props.idx]];
        values[idx] = e.target.value;
        updateVoteDataList[props.idx] = values;
        let count = 0; let allLength = 0;
        const result = updateVoteDataList.map((elem: any) => (
          elem.map((inside: any) => {
            allLength += 1;
            try { if (inside.length === 0) { count = count + 1 } } catch (err: any) { }
          })));
        if (count === 0 && allLength > 3) { props.setIsVoteDateListOk(true) } else { props.setIsVoteDateListOk(false) };

        props.setVoteDataList(updateVoteDataList);
        return
      default:
        values = [...voteData];
        values[idx] = e.target.value;
        setVoteData(values);
        return
    }
  }
  const callAxios = (e: any, postObj: any) => {
    e.preventDefault();
    const jwt = getJwt();

    axios.post("/posts", postObj, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
      .then((res: any) => {
        Mixpanel.track('Successful New Post', { ...postObj });
        props.editParentHandle(e, false);
        switch (props.targetGroupId) {
          case "":
            history.push("/latest");
            break;
          default:
            history.push(`/group/${props.targetGroupId}/feed`);
            break;
        }

      }).catch((err: any) => {
        Mixpanel.track('Unsuccessful New Post', { ...postObj });
        setErrorMessage(i18n.t("newPost.failedToPost"));
      })
  }

  const submit = (e: any) => {
    // e.preventDeafult();

    let postObj;
    switch (props.voteTypeId) {
      case 1:
        postObj = { title: props.title, content: props.content, end_at: props.endAt, topic: props.topicList, group_id: props.targetGroupId, vote_type_id: "1", vote_obj: voteData.map((elem: any) => { return { content: elem } }) }
        callAxios(e, postObj);
        return

      case 2:
        postObj = { title: props.title, content: props.content, end_at: props.endAt, topic: props.topicList, group_id: props.targetGroupId, vote_type_id: "2", vote_obj: voteData.map((elem: any) => { return { content: elem } }), mj_option_list: props.matrixCandidateList };
        callAxios(e, postObj);
        return

      case 3:
        // does nothing
        return
    }

  };

  const deleteHandle = (e: any, idx: number) => {
    if (voteData.length <= 2) { return }
    let values = [...voteData];
    values.splice(idx, 1);
    setVoteData(values);
  }

  const addHandle = (e: any) => {
    if (voteData.length > 6) { return };
    setVoteData([...voteData, '']);
    if (props.voteTypeId === 3) { props.setIsVoteDateListOk(false) };
  }

  const voteStyle = { padding: '7px', marginBottom: '5px', width: '50ch' }

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleClick = (e: any) => {
    setIsClicked(true);
    submit(e)
  }

  const submitButton = () => {
    const invalid = hasIncorrectInput(props.title, props.content, props.topicList, props.voteTypeId, props.endAt, props.targetGroupId, voteData, props.matrixCandidateList);

    switch (invalid) {
      case true:
        return (<div><br></br><br></br><br></br><span style={{ border: 'none', color: 'gray', borderRadius: 5, padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: "#D7DCDE" }}>{i18n.t("newPost.post")}</span></div>)
      case false:
        return (
          <div onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault() } }}>
            <br></br><br></br><br></br>
            <button onClick={handleClick} disabled={isClicked ? true : false} style={isClicked ? { border: 'none', color: 'gray', borderRadius: 5, padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: "#D7DCDE" } : { fontSize: 16, border: 'none', color: 'white', borderRadius: 5, padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: "#01B1F8" }}>
              <b>{i18n.t("newPost.post")}</b>
            </button>
          </div>)
      // return (<div><br></br><br></br><br></br><button style={{ border: 'none', borderRadius: 5, padding: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: "#B7D4FF" }} onClick={e => { e.preventDefault();setIsConfirm(true)}}>{i18n.t("newPost.post")}</button></div>)
    }
  }

  const confirmDialogBase = () => {
    let postObj;
    switch (props.voteTypeId) {
      case 1:
        postObj = { title: props.title, content: props.content, end_at: props.endAt, topic: props.topicList, group_id: props.targetGroupId, vote_type_id: "1", vote_obj: voteData.map((elem: any) => { return { content: elem } }) }
        break;
      case 2:
        postObj = { title: props.title, content: props.content, end_at: props.endAt, topic: props.topicList, group_id: props.targetGroupId, vote_type_id: "2", vote_obj: voteData.map((elem: any) => { return { content: elem } }), mj_option_list: props.matrixCandidateList };
        break;
      case 3:
        // does nothing
        break;
    }
    return (
      <div><ConfirmDialog submit={submit} setIsConfirm={setIsConfirm} postObj={postObj} /></div>
    )
  }

  return (
    <div >
      <div style={{ textAlign: 'left', paddingLeft: 5, marginTop: 10 }}>
        {isConfirm ? confirmDialogBase() : ""}
        <b>{i18n.t("newPost.voteCandidate")}</b>
        <div style={{ marginTop: 10 }}>
          {voteData.map((val: any, idx: number) => {
            return (
              <div key={idx}>
                <input style={voteStyle} maxLength={25} required placeholder={`${i18n.t("newPost.voteCandidate")} ${idx + 1}`} onChange={e => voteSelectChange(e, idx)}></input>
                {idx > 1 ? <span style={{ marginLeft: 5 }}><button type="button" onClick={e => deleteHandle(e, idx)}><RemoveIcon style={{ fontSize: 16 }}></RemoveIcon></button></span> : ''}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ marginLeft: 5 }}>
        <button type="button" onClick={e => addHandle(e)}><AddIcon style={{ fontSize: 16 }}></AddIcon></button>
      </div>


      <div style={{ textAlign: 'right', paddingRight: 10, marginBottom: 20 }}>
        {props.voteTypeId === 3 ? '' : submitButton()}
      </div>
      <div style={{ color: 'red' }}>{errorMessage ? errorMessage : ''}</div>
    </div>
  )

}

const MultipleVoteFormEach = (props: any) => {

  const addTitle = (e: any) => {
    let updateTitleList = props.titleList;
    updateTitleList[props.idx] = e.target.value;

    const result = updateTitleList.filter((elem: any) => (elem.length === 0))
    if (result.length === 0) { props.setIsTitleListOk(true) } else { props.setIsTitleListOk(false) };

    props.setTitleList(updateTitleList);
  }

  const addContent = (e: any) => {
    let updateContentList = props.contentList;
    updateContentList[props.idx] = e.target.value;
    props.setContentList(updateContentList);
  }

  return (
    <div>
      <hr></hr>
      <h2>{i18n.t("newPost.vote")} {props.idx + 1}</h2>
      <div>
        <input required placeholder={i18n.t("newPost.titlePlaceholder")} className={styles.title} minLength={1} maxLength={150} type="text" onChange={e => addTitle(e)}></input><br></br>
      </div>
      <div>
        <TextareaAutosize placeholder={i18n.t("newPost.contentPlaceholder")} style={{ padding: 7 }} className={styles.content} rowsMin={6} maxLength={5000} onChange={e => addContent(e)}></TextareaAutosize>
        {/* <textarea placeholder={i18n.t("newPost.contentPlaceholder")} className={styles.content} rows={6} maxLength={5000} onChange={e => addContent(e)}></textarea> */}
      </div>
      <div><VoteCandidateForm
        voteTypeId={3}
        idx={props.idx}
        voteDataList={props.voteDataList}
        setVoteDataList={props.setVoteDataList}
        setIsVoteDateListOk={props.setIsVoteDateListOk}
      ></VoteCandidateForm></div>
    </div>
  )
}

const SubmitButtonMultiple = (props: any) => {
  const [invalid, setInvalid] = useState(true);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  
  useEffect(() => {
    if (
      props.title.length !== 0 &&
      props.topicList.length !== 0 &&
      props.isTitleListOk &&
      props.isVoteDateListOk
    ) {
      setInvalid(false);
    } else {
      setInvalid(true);
    }

  })

  const handleClick = (e: any) => {
    setIsClicked(true);
    props.submit(e);
  }

  switch (invalid) {
    case true:
      return (<div><br></br><br></br><br></br><span style={{ border: 'none', color: 'gray', borderRadius: 5, padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: "#D7DCDE" }}>{i18n.t("newPost.post")}</span></div>)
    case false:
      return (
        <div onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault() } }}>
          <br></br><br></br><br></br>
          <button onClick={handleClick} disabled={isClicked ? true : false} style={isClicked ? { border: 'none', color: 'gray', borderRadius: 5, padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: "#D7DCDE" } : { fontSize: 16, border: 'none', color: 'white', borderRadius: 5, padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: "#01B1F8" }}>
            <b>{i18n.t("newPost.post")}</b>
          </button>
        </div>)
    // return (<div><br></br><br></br><br></br><br></br><button style={{ border: 'none', borderRadius: 5, padding: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: "#B7D4FF" }} onClick={e => {e.preventDefault();setIsConfirm(true)}} >{i18n.t("newPost.post")}</button></div>)
  }
}


const MultipleVoteForm = (props: any) => {
  const multipleVoteNum = props.multipleVoteNum;
  const history = useHistory();

  const [titleList, setTitleList] = useState(Array(multipleVoteNum).fill(''));
  const [contentList, setContentList] = useState(Array(multipleVoteNum).fill(''));
  const [voteDataList, setVoteDataList] = useState<any>(Array(multipleVoteNum).fill([]));
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [isTitleListOk, setIsTitleListOk] = useState(false);
  const [isVoteDateListOk, setIsVoteDateListOk] = useState(false);

  useEffect(() => {



    if (titleList.length < multipleVoteNum) {
      setIsTitleListOk(false);
      setTitleList([...titleList, '']);
    }

    if (titleList.length > multipleVoteNum) {
      const decreaseTitleList = titleList.slice(0, titleList.length - 1);
      const result = decreaseTitleList.filter((elem: any) => (elem.length === 0))
      if (result.length === 0) { setIsTitleListOk(true) } else { setIsTitleListOk(false) };

      setTitleList(titleList.slice(0, titleList.length - 1));
    }

    if (contentList.length < multipleVoteNum) {
      setContentList([...contentList, '']);
    }

    if (contentList.length > multipleVoteNum) {
      setContentList(contentList.slice(0, contentList.length - 1));
    }

    if (voteDataList.length < multipleVoteNum) {
      setIsVoteDateListOk(false);
      setVoteDataList([...voteDataList, ['', '']]);
    }

    if (voteDataList.length > multipleVoteNum) {
      const decreaseVoteDataList = voteDataList.slice(0, voteDataList.length - 1);
      let count = 0; let allLength = 0;
      const result = decreaseVoteDataList.map((elem: any) => (
        elem.map((inside: any) => {
          allLength += 1;
          try { if (inside.length === 0) { count = count + 1 } } catch (err: any) { }
        })));
      if (count === 0 && allLength > 3) { setIsVoteDateListOk(true) } else { setIsVoteDateListOk(false) };

      setVoteDataList(voteDataList.slice(0, voteDataList.length - 1));
    }

  }, [props.multipleVoteNum]);
  // });

  const submit = (e: any) => {
    const parentTitle = props.title;
    const parentContent = props.content;
    const children = titleList.map((elem: any, idx: any) => { return { title: titleList[idx], content: contentList[idx], vote_obj: voteDataList[idx].map((elem: any) => { return { content: elem } }) } });
    const postObj = { title: parentTitle, content: parentContent, end_at: props.endAt, group_id: props.targetGroupId, vote_type_id: "3", topic: props.topicList, children: children }


    /*
    Input Validation
    */
    if (titleList.filter((elem: any) => (elem.length === 0)).length > 0) {
      return true
    }

    let voteDataCheck = true;
    for (let i = 0; i < voteDataList.length; i++) {
      for (let j = 0; j < voteDataList[i].length; j++) {
        if (voteDataList[i][j].length === 0) {
          voteDataCheck = false
        }
      }
      if (voteDataList[i].length === 0) {
        voteDataCheck = false
      }
    }

    if (!voteDataCheck) {
      return true
    }

    const jwt = getJwt();
    axios.post("/posts", postObj, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
      .then((res: any) => {
        Mixpanel.track('Successful New Multiple Post', { ...postObj });
        props.editParentHandle(e, false);
        switch (props.targetGroupId) {
          case "":
            history.push("/latest");
            break;
          default:
            history.push(`/group/${props.targetGroupId}/feed`);
            break;
        }

      }).catch((err: any) => {
        Mixpanel.track('Unsuccessful New Multiple Post', { ...postObj });
      })
    e.preventDefault();
  };


  const confirmDialogBaseMultiple = () => {
    const parentTitle = props.title;
    const parentContent = props.content;
    const children = titleList.map((elem: any, idx: any) => { return { title: titleList[idx], content: contentList[idx], vote_obj: voteDataList[idx].map((elem: any) => { return { content: elem } }) } });
    const postObj = { title: parentTitle, content: parentContent, end_at: props.endAt, group_id: props.targetGroupId, vote_type_id: "3", topic: props.topicList, children: children }

    return (
      <div><ConfirmDialog submit={submit} setIsConfirm={setIsConfirm} postObj={postObj} /></div>
    )
  }

  return (
    <div>
      {isConfirm ? confirmDialogBaseMultiple() : ""}
      {titleList.map((_: any, idx: number) => {
        return (<MultipleVoteFormEach
          idx={idx}
          titleList={titleList}
          setTitleList={setTitleList}
          contentList={contentList}
          setContentList={setContentList}
          voteDataList={voteDataList}
          setVoteDataList={setVoteDataList}
          topicList={props.topicList}
          setIsTitleListOk={setIsTitleListOk}
          setIsVoteDateListOk={setIsVoteDateListOk}
        ></MultipleVoteFormEach>)
      })}
      <div style={{ textAlign: 'right', paddingRight: 10, marginBottom: 20 }}>
        <SubmitButtonMultiple
          title={props.title}
          content={props.content}
          targetGroupId={props.targetGroupId}
          endAt={props.end_at}
          titleList={titleList}
          contentList={contentList}
          voteDataList={voteDataList}
          topicList={props.topicList}
          submit={submit}
          isTitleListOk={isTitleListOk}
          isVoteDateListOk={isVoteDateListOk}
        />
      </div>

      <div>{errorMessage ? errorMessage : ''}</div>
    </div>
  )
}


const MatrixVoteForm = (props: any) => {

  const [matrixNum, setMatrixNum] = useState(2);
  const [matrixCandidateList, setMatrixCandidateList] = useState(['', '']);

  const matrixNumChange = (e: any) => {
    e.preventDefault();
    setMatrixNum(parseInt(e.target.value));
  }

  const matrixCandidateListChange = (e: any, idx: number) => {
    e.preventDefault();
    let mjCandidates = [...matrixCandidateList];
    mjCandidates[idx] = e.target.value;
    setMatrixCandidateList(mjCandidates)
  }

  const renderMJcandidates = () => {

    let JSX = [];
    for (let idx = 0; idx < matrixNum; idx++) {
      JSX.push(
        (<span>
          <span key={idx}>
            <input required maxLength={10} style={{ padding: '3px', width: '90px', marginRight: '10px', marginTop: '10px' }} placeholder={`${i18n.t("newPost.MatrixAnswer")} ${idx + 1}`} onChange={e => matrixCandidateListChange(e, idx)}></input>
          </span>
        </span>)
      )
    }
    return (
      <div>
        {i18n.t("newPost.MatrixNum")}&nbsp;<select name="mj-nums" id="mj-nums" onChange={e => matrixNumChange(e)}>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <br></br>
        <div>
          {JSX}
        </div>
        <div><VoteCandidateForm
          voteTypeId={2}
          title={props.title}
          content={props.content}
          endAt={props.endAt}
          topicList={props.topicList}
          targetGroupId={props.targetGroupId}
          matrixCandidateList={matrixCandidateList}
          editParentHandle={props.editParentHandle}
        ></VoteCandidateForm></div>
      </div>
    )
  };

  return (<div>{renderMJcandidates()}</div>)
}

const TopicCandidates = (props: any) => {
  const [topicCandidateList, setTopicCandidateList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwt = getJwt();
    axios.get(`/topics?startswith=${props.topic}`, { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY, } })
      .then(res => {
        setTopicCandidateList(res.data);
        setIsLoading(false);
      })
      .catch(err => {

      });
  }, [props.topic, props.ref])


  const topicChange = (e: any, topic: string) => {
    e.preventDefault();
    let rawTopicList = props.topicList;
    rawTopicList[props.currentTopicIdx] = topic;
    props.setTopicString(rawTopicList.join(", "));

    setTopicCandidateList([]);
    // console.log(props.ref);
    // props.ref.current.focus();
  };


  if (isLoading) { return (<span></span>) }

  if (topicCandidateList.length === 0) { return (<span></span>) }

  return (
    <div style={{ marginTop: 10 }}>
      {topicCandidateList.map((topic: any) => {
        return (<div><button style={{ marginBottom: 1, border: 'none', padding: 5, borderRadius: 10, borderWidth: 1, backgroundColor: 'rgba(0, 0, 255, 0.1)' }} onClick={e => topicChange(e, topic.topic)}>{topic.topic} {topic.num_of_posts}</button></div>)
      })}
    </div>)
}



const VoteForm = (props: any) => {
  const currentDate = new Date();
  const defaultEndAt = new Date(currentDate.setHours(currentDate.getHours() + 24)).toISOString().slice(0, -8);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [voteTypeId, setVoteTypeId] = useState(1);
  const [endAt, setEndAt] = useState(24);
  const [endAtDate, setEndAtDate] = useState(defaultEndAt);
  const [maxTopicNum, setMaxTopicNum] = useState(10);
  const [topicString, setTopicString] = useState("");
  const [topicList, setTopicList] = useState<any>([]);
  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
  const [currentTopic, setCurrentTopic] = useState('');
  const [groupList, setGroupList] = useState<any>([]);
  const [targetGroupId, setTargetGroupId] = useState("");
  const [multipleVoteNum, setMultipleVoteNum] = useState(2);
  const [isSendTargetGroup, setIsSendTargetGroup] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // get group list
    const jwt = getJwt();
    axios.get(`/groups`, { headers: { 'Authorization': `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY, } })
      .then((res: any) => {
        setGroupList(res.data);
      }).catch((res: any) => { });
  }, []);



  const changeEndAt = (e: any) => {
    const dt = new Date();
    const endHour = e.target.value ? parseInt(e.target.value) : 0;
    setEndAt(endHour);
    if (endHour > 0 && endHour < 36000) {
      const endDate = new Date(dt.setHours(dt.getHours() + endHour));
      const endDateString = endDate.toISOString().slice(0, -8);
      setEndAtDate(endDateString);
    }
  }

  const doContainDelim = (topics: string) => {
    const delims = [',', '，', '、'];
    let count = 0;
    delims.map((elem) => {
      if (topics.includes(elem)) {
        count = count + 1;
      }
    })
    return count > 0 ? true : false;
  }

  const getCurrentTopic = (cursor: any, topicString: any, beforeTopicList: any) => {


    const getCommaIdx = (topicString: string) => {
      const delims = [',', '，', '、'];
      let commaIdx = [];
      for (let idx = 0; idx < topicString.length; idx++) {
        if (delims.includes(topicString[idx])) { commaIdx.push(idx) };
      }
      return commaIdx;
    };

    const commaIdx = getCommaIdx(topicString);

    // console.log('cursor', cursor);
    // console.log('topicString', topicString);
    // console.log('beforeTopicList', beforeTopicList);
    // console.log('commaIdx', commaIdx);


    let currentTopicIdx: number;
    // if duplicate
    // commaIdx [5, 10, 17], cursor 10
    // currentTopicIdx -> 2
    if (commaIdx.includes(cursor)) {
      currentTopicIdx = commaIdx.indexOf(cursor);
      // console.log('currentTopicIdx', currentTopicIdx);
      // console.log('duplicate', beforeTopicList[currentTopicIdx]);
      setCurrentTopicIdx(currentTopicIdx);
      return beforeTopicList[currentTopicIdx];
    }

    // not
    // commaIdx [5, 10, 17], cursor 15
    // concat [5, 10, 15, 17]
    // currentTopicIdx -> 3
    commaIdx.push(cursor)
    let numArray = new Int32Array(commaIdx); // normal sort doesn't sort numbers!
    numArray = numArray.sort();
    currentTopicIdx = numArray.indexOf(cursor);
    setCurrentTopicIdx(currentTopicIdx);
    // console.log('numArray', numArray);
    // console.log('currentTopicIdx', currentTopicIdx);
    // console.log('not duplicate', beforeTopicList[currentTopicIdx]);
    if (beforeTopicList.length < currentTopicIdx) { return beforeTopicList[beforeTopicList.length] }
    return beforeTopicList[currentTopicIdx];
  };


  const renderTopic = () => {
    const pattern = (/,|，|、/g);
    if (topicString.length === 0) return;

    if (!doContainDelim(topicString)) {
      return (<span><b style={{ border: '', borderRadius: '7px', padding: '2px', backgroundColor: '#D3D3D3' }}>{topicString}{'   '}</b>&nbsp;&nbsp;</span>)
    }

    if (doContainDelim(topicString)) {
      let topicList = topicString.split(pattern);
      topicList = topicList.slice(0, maxTopicNum);
      topicList = topicList.map((tp: string) => (tp.trim())).filter((el: string) => (el.length > 0));
      return (
        <div style={{ color: 'black' }}>
          {topicList.map((elem: string) => {
            if (elem.length > 0) {
              return (
                <span><b style={{ border: '', borderRadius: '7px', padding: '2px', backgroundColor: '#D3D3D3' }}>{elem}{'   '}</b>&nbsp;&nbsp;</span>
              );
            }
          })}
        </div>
      )
    }
  }



  const editTopic = (e: any) => {
    const rawTopicString = e.target.value;
    const currentCursor = e.target.selectionStart;


    const pattern = (/,|，|、/g);
    setTopicString(rawTopicString)
    if (doContainDelim(rawTopicString)) {
      let rawTopicList = rawTopicString.split(pattern);
      rawTopicList = rawTopicList.slice(0, maxTopicNum);
      rawTopicList = rawTopicList.map((tp: string) => (tp.trim())).filter((el: string) => (el.length > 0));

      setCurrentTopic(getCurrentTopic(currentCursor, rawTopicString, rawTopicList));
      setTopicList(rawTopicList);
      return
    }
    if (rawTopicString.length === 0) {
      setTopicList([]);
      setCurrentTopic("");
      return
    };

    setTopicList([rawTopicString]);
    setCurrentTopic(rawTopicString);
  };

  const voteFormRender = () => {
    switch (voteTypeId) {
      case 1:
        return (<VoteCandidateForm
          voteTypeId={1}
          title={title}
          content={content}
          endAt={endAtDate}
          targetGroupId={targetGroupId}
          topicList={topicList}
          editParentHandle={props.editParentHandle}
        ></VoteCandidateForm>)

      case 2:
        return (<MatrixVoteForm
          title={title}
          content={content}
          endAt={endAtDate}
          targetGroupId={targetGroupId}
          topicList={topicList}
          editParentHandle={props.editParentHandle}
        ></MatrixVoteForm>)

      case 3:
        return (<MultipleVoteForm
          multipleVoteNum={multipleVoteNum}
          title={title}
          content={content}
          endAt={endAtDate}
          targetGroupId={targetGroupId}
          topicList={topicList}
          editParentHandle={props.editParentHandle}
        ></MultipleVoteForm>)

      default:
        return (<span></span>)
    }
  }

  const changeIsSendTargetGroup = (e: any) => {
    setIsSendTargetGroup(e.target.checked);

    if (e.target.checked === false) {
      setTargetGroupId("");
    }
  }

  return (
    <div>


      <span style={{ display: 'none' }}>
        <label><input name="issendtargetgroup" type="checkbox" onChange={e => changeIsSendTargetGroup(e)} /><b>{i18n.t("newPost.groupPost")}</b></label>
        {isSendTargetGroup ?
          <span>
            &nbsp;&nbsp;<b>{i18n.t("newPost.targetPost")}</b>&nbsp;&nbsp;
            <NativeSelect value={targetGroupId} onChange={e => setTargetGroupId(e.target.value)}>
              {groupList.map((elem: any) => {
                return (
                  <Button value={elem.id}>{elem.title}</Button>
                )
              })}
            </NativeSelect>
          </span>
          : ''}
      </span>


      <hr></hr>
      <div><b>{i18n.t("newPost.voteType")}</b>&nbsp;&nbsp;

        <Button value={1} onClick={e => setVoteTypeId(1)}
          style={voteTypeId === 1 ? { borderRadius: '100px', backgroundColor: '#ccc' } : { borderRadius: '100px' }}>
          {i18n.t("newPost.normalVote")}
        </Button>
        <Button value={3} onClick={e => setVoteTypeId(3)}
          style={voteTypeId === 3 ? { borderRadius: '100px', backgroundColor: '#ccc' } : { borderRadius: '100px' }}>
          {i18n.t("newPost.continuasVote")}
        </Button>

        {/* <select style={{ padding: '3px' }} onChange={e => setVoteTypeId(parseInt(e.target.value))}>
        <option value={1}>{i18n.t("newPost.normalVote")}</option>
        <option value={3}>{i18n.t("newPost.continuasVote")}</option>
        <option value={2}>{i18n.t("newPost.matrixVote")}</option>
      </select> */}

        {voteTypeId === 3 ? <span><select style={{ padding: '3px' }} onChange={e => setMultipleVoteNum(parseInt(e.target.value))}>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select></span> : ''}
      </div>
      <br></br>

      <div>
        <b>{i18n.t("newPost.end")}</b> <input className={styles.date_button} value={endAt} min={24} max={168} type="number" onChange={e => changeEndAt(e)}></input> <b>{i18n.t("newPost.hourLater")}</b>
      </div><br></br>

      <div>
        <b>{i18n.t("newPost.topic")}  {i18n.t("newPost.topicDescription")}</b>
        <input ref={inputRef} required placeholder={i18n.t("newPost.topicPlaceholder")} style={{ padding: 7, width: '100%', marginBottom: '10px' }} value={topicString} type="text" maxLength={200} onChange={e => editTopic(e)}></input>
        {renderTopic()}
      </div>

      <div>
        <TopicCandidates ref={inputRef} topic={currentTopic} currentTopicIdx={currentTopicIdx} topicList={topicList} setTopicList={setTopicList} setTopicString={setTopicString}></TopicCandidates>
      </div>

      <hr></hr><br></br>
      {voteTypeId === 3 ? <h2>{i18n.t("newPost.parentTitle")}</h2> : <h2>{i18n.t("newPost.vote")}</h2>}

      <div>
        <input required placeholder={i18n.t("newPost.titlePlaceholder")} className={styles.title} style={{ padding: 7 }} minLength={1} maxLength={150} type="text" onChange={e => setTitle(e.target.value)}></input><br></br>
      </div>
      <div>
        <TextareaAutosize placeholder={i18n.t("newPost.contentPlaceholder")} style={{ padding: 7 }} className={styles.content} rowsMin={6} maxLength={5000} onChange={e => setContent(e.target.value)}></TextareaAutosize>
        {/* <textarea placeholder={i18n.t("newPost.contentPlaceholder")} style={{ padding: 7 }} className={styles.content} rows={6} maxLength={5000} onChange={e => setContent(e.target.value)}></textarea> */}
      </div>

      {/* <form onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault() } }}>*/}
      <form>
        {voteFormRender()}
      </form>
    </div>
  )
}




export interface NewPostContentProps extends RouteComponentProps<{}> {
  edit: boolean;
  editParentHandle: any;
  // keyword: string;
  isLogin: boolean;
}

export interface NewPostContentState {
  edit: boolean;
  title: string;
  content: string;
  endhour: string;
  values: Array<string>;
  end_at: string;
  vote_type_id: string;
  success: boolean;
  posted: boolean;
  topicString: any;
  topicForApi: Array<string>;
  maxTopicNum: number;
  mjNums: number;
  mjCandidates: Array<string>;
  errorMessage: string;
  groupList: any;
  targetGroupId: string;
  allowPost: boolean;
  maxWidth: any;
}

class PostContent extends React.Component<NewPostContentProps, NewPostContentState> {

  constructor(props: any) {
    super(props);

    const currentDate = new Date();
    const defaultEndAt = new Date(currentDate.setHours(currentDate.getHours() + 24)).toISOString().slice(0, -8);

    this.state = {
      mjNums: 2,
      edit: false,
      title: "",
      content: "",
      endhour: "24",
      end_at: defaultEndAt,
      vote_type_id: "1",
      values: ['', ''],
      mjCandidates: ['', ''],
      posted: false,
      success: false,
      topicString: '',
      topicForApi: [],
      maxTopicNum: 10,
      errorMessage: '',
      groupList: [],
      targetGroupId: "",
      allowPost: true,
      maxWidth: { matches: false },
    }
  }

  isPostedChange = (val: boolean) => {
    this.setState({
      posted: val
    })
  }




  componentDidUpdate = (prevProps: any) => {
    if (this.props.edit !== prevProps.edit) {
      this.setState({ edit: this.props.edit });
    }
  }

  componentDidMount = () => {
    let maxWidth: any;
    if (window !== undefined) { maxWidth = window.matchMedia("(max-width: 700px)") }
    this.setState({ maxWidth: maxWidth })
  }

  createForm = () => {



    return (
      <div>
        <Dialog disableBackdropClick={true} fullScreen={this.state.maxWidth.matches ? true : false} fullWidth={true} open={this.props.edit} onClose={e => this.props.editParentHandle(e, false)} aria-labelledby="form-dialog-title">
          {/* <DialogTitle id="form-dialog-title">{i18n.t("newPost.post")}</DialogTitle> */}
          <DialogContent>
            <div>
              <div style={{ textAlign: 'right' }}>
                <button style={{ backgroundColor: 'white', border: 'none', }} onClick={e => this.props.editParentHandle(e, false)}><CloseIcon /></button>
              </div>
              <br></br>

              <VoteForm editParentHandle={this.props.editParentHandle}></VoteForm>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }


  render() {
    return (
      <div>
        <div>{this.createForm()}</div>
        <div>
          <Feed isLogin={this.props.isLogin} isPosted={this.state.posted} isPostedHandeler={this.isPostedChange}></Feed>
        </div>
      </div>
    );
  }
}


export default withRouter(PostContent);