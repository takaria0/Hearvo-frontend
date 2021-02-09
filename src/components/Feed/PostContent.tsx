import React, { ReactComponentElement, useState, useEffect } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';
import { useHistory } from "react-router";

import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, TextField, Fab, Input, Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import * as styles from '../../css/Feed/PostContent.module.css';
import { idText, StringLiteral } from 'typescript';
import { CollectionsBookmarkOutlined, CropLandscapeOutlined, TransferWithinAStationSharp } from '@material-ui/icons';
import Feed from './Feed';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import NativeSelect from '@material-ui/core/NativeSelect';
import { AxiosInterceptorManager } from 'axios';


const hasIncorrectInputMultiple = (title: string, content: string, topic: [], vote_type_id: number, end_at: string, group_id: string, titleList: any, voteDataList: any ) => {
  // const parentTitle = props.title;
  // const parentContent = props.content;
  // const children = titleList.map((elem: any, idx: any) => { return { title: titleList[idx], content: contentList[idx], vote_obj: voteDataList[idx].map((elem: any) => { return { content: elem } }) } });
  // const postObj = { title: parentTitle, content: parentContent, end_at: props.endAt, group_id: props.targetGroupId, vote_type_id: "3", topic: props.topicList, children: children }

  // console.log('title', title)
  // console.log('topic', topic)
  


  if (title.length === 0) {
    return true;
  }

  if (topic.length === 0) {
    return true;
  }



  // const childrenVoteObj = children.filter((elem: any) => {
  //   const voteCheck = elem.vote_obj.filter((obj: any) => (obj.content.length !== 0))
  //   if(voteCheck.length === 0) {
  //     return true
  //   }
  //   return false;
  // })

  // if (childrenVoteObj.length === 0) {
  //   return true;
  // }

  return false;

};

const hasIncorrectInput = (title: string, content: string, topic: [], vote_type_id: number, end_at: string, group_id: string, vote_obj: [] ) => {


  if (title.length === 0) {
    return true;
  }

  if (topic.length === 0) {
    return true;
  }


  if(vote_type_id === 1) {
    const result = vote_obj.filter((elem: any) => (elem.length === 0))
    return result.length === 0 ?  false : true;
  }

  

  return false;

};



const VoteCandidateForm = (props: any) => {

  const [voteData, setVoteData] = useState<any>(['', '']);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const voteSelectChange = (e: any, idx: number) => {
    e.preventDefault();
    let values;

    switch(props.voteTypeId) {
      case 3:
        let updateVoteDataList = props.voteDataList;
        values = [...props.voteDataList[props.idx]];
        values[idx] = e.target.value;
        updateVoteDataList[props.idx] = values;
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

    axios.post("/posts", postObj, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then((res: any) => {
        console.log(1);
        // this.isPostedChange(true);
        props.editParentHandle(e, false);
        console.log(2);
        switch (props.targetGroupId) {
          case "":
            console.log(3);
            history.push("/latest");
            break;
          default:
            console.log(4);
            history.push(`/group/${props.targetGroupId}/feed`);
            break;
        }

      }).catch((err: any) => {
        console.log(5);
        // props.isPostedChange(false);
        setErrorMessage("投稿に失敗しました")
      })
    console.log(6);
  }

  const submit = (e: any) => {
    // e.preventDeafult();
    if(e.key === "Enter") {return};
    
    let postObj;
    switch (props.voteTypeId) {
      case 1:
        postObj = { title: props.title, content: props.content, end_at: props.endAt, topic: props.topicList, group_id: props.targetGroupId, vote_type_id: "1", vote_obj: voteData.map((elem:any) => {return {content: elem}}) }
        console.log("postObj", postObj);
        callAxios(e, postObj);
        return

      case 2:
        postObj = { title: props.title, content: props.content, end_at: props.endAt, topic: props.topicList, group_id: props.targetGroupId, vote_type_id: "2", vote_obj: voteData.map((elem: any) => { return { content: elem } }), mj_option_list: props.matrixCandidateList};
        console.log("postObj", postObj);
        callAxios(e, postObj);
        return  

      case 3:
        // does nothing
        return
    }

  };

  const deleteHandle = (e: any, idx: number) => {
    if(voteData.length <= 2) { return }
    let values = [...voteData];
    values.splice(idx, 1);
    setVoteData(values);
  }

  const addHandle = (e: any) => {
    if (voteData.length > 6) { return };
    setVoteData([...voteData, '']);
  }

  const voteStyle = { padding: '3px', marginBottom: '5px' }

  const submitButton = () => {
    const invalid = hasIncorrectInput(props.title, props.content, props.topicList, props.voteTypeId, props.endAt, props.targetGroupId, voteData);

    switch(invalid) {
      case true:
        return (<div><br></br><div style={{  border: 'none' , color:'gray', backgroundColor: "white" }}>投稿</div></div>)
      case false:
        return (<div><br></br><button style={{ border: 'none', borderRadius: 5, padding: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: "#B7D4FF" }} onClick={e => submit(e)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>投稿</button></div>)
    }
  }
  
  return (
    <div style={{ textAlign: 'center'}}>
      投票候補
      {voteData.map((val: any, idx: number) => {
        return (
          <div key={idx}>
            <input style={voteStyle} placeholder={`投票候補 ${idx + 1}`} onChange={e => voteSelectChange(e, idx)}></input>
            {idx > 1 ? <button type="button" onClick={e => deleteHandle(e, idx)}><RemoveIcon style={{ fontSize: 16 }}></RemoveIcon></button> : ''}
          </div>
        )
      })}
      <button type="button" onClick={e => addHandle(e)}><AddIcon style={{ fontSize: 16 }}></AddIcon></button>
      {props.voteTypeId === 3 ? '' : submitButton() }
      <div style={{color : 'red'}}>{errorMessage ? errorMessage: ''}</div>
    </div>
  )

}

const MultipleVoteFormEach = (props: any) => {

  const addTitle = (e: any) => {
    let updateTitleList = props.titleList;
    updateTitleList[props.idx] = e.target.value;
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
    <h2>投票 {props.idx + 1}</h2>
    <div>
        <input placeholder="タイトルを入力" className={styles.title} minLength={1} maxLength={150} type="text" onChange={e => addTitle(e)}></input><br></br>
    </div>
    <div>
        <textarea placeholder="本文を入力" className={styles.content} rows={6} maxLength={5000} onChange={e => addContent(e)}></textarea>
    </div>
      <div><VoteCandidateForm 
      voteTypeId={3}
      idx={props.idx}
      voteDataList={props.voteDataList}
      setVoteDataList={props.setVoteDataList}
      ></VoteCandidateForm></div>
    </div>
    )
}

const MultipleVoteForm = (props: any) => {
  const multipleVoteNum = props.multipleVoteNum;
  const history = useHistory();
  // console.log('props.multipleVoteNum', props.multipleVoteNum);

  const [titleList, setTitleList] = useState(Array(multipleVoteNum).fill(''));
  const [contentList, setContentList] = useState(Array(multipleVoteNum).fill(''));
  const [voteDataList, setVoteDataList] = useState<any>(Array(multipleVoteNum).fill([]));
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {

    if (titleList.length < multipleVoteNum) {
      setTitleList([ ...titleList, '' ]);
    }

    if (titleList.length > multipleVoteNum) {
      setTitleList(titleList.slice(0, titleList.length - 1));
    }

    if (contentList.length < multipleVoteNum) {
      setContentList([...contentList, '']);
    }

    if (contentList.length > multipleVoteNum) {
      setContentList(contentList.slice(0, contentList.length - 1));
    }

    if (voteDataList.length < multipleVoteNum) {
      setVoteDataList([...voteDataList, []]);
    }

    if (voteDataList.length > multipleVoteNum) {
      setVoteDataList(voteDataList.slice(0, voteDataList.length - 1));
    }

    // setTitleList(Array(multipleVoteNum).fill(''));
    // setContentList(Array(multipleVoteNum).fill(''));
    // setVoteDataList(Array(multipleVoteNum).fill([]));

  }, [props.multipleVoteNum]);

  const submit = (e: any) => {
    console.log(0);
    const parentTitle = props.title;
    const parentContent = props.content;
    const children = titleList.map((elem: any, idx: any) => { return { title: titleList[idx], content: contentList[idx], vote_obj: voteDataList[idx].map((elem: any) => { return { content: elem } })}});
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
    console.log(1);
    axios.post("/posts", postObj, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then((res: any) => {
        // this.isPostedChange(true);
        console.log(2);
        props.editParentHandle(e, false);
        switch (props.targetGroupId) {
          case "":
            console.log(3);
            history.push("/latest");
            break;
          default:
            console.log(4);
            history.push(`/group/${props.targetGroupId}/feed`);
            break;
        }

      }).catch((err: any) => {
        console.log(5);
        // props.isPostedChange(false);
      })
    e.preventDefault();
    console.log(6);  
  };

  const submitButton = () => {
    const invalid = hasIncorrectInputMultiple(props.title, props.content, props.topicList, 3, props.endAt, props.targetGroupId, titleList, voteDataList)

    switch (invalid) {
      case true:
        return (<div><br></br><div style={{ border: 'none', color: 'gray', backgroundColor: "white" }}  >投稿</div></div>)
      case false:
        return (<div><br></br><button style={{ border: 'none', borderRadius: 5, padding: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: "#B7D4FF" }} onClick={e => submit(e)} >投稿</button></div>)
    }
  }

  return (
  <div>
    {titleList.map((_: any, idx: number) => { return (<MultipleVoteFormEach 
    idx={idx} 
    titleList={titleList}
    setTitleList={setTitleList}
    contentList={contentList}
    setContentList={setContentList}
    voteDataList={voteDataList}
    setVoteDataList={setVoteDataList}
    topicList={props.topicList}
    ></MultipleVoteFormEach>)})}
    <div style={{textAlign: 'center'}}>
        {submitButton()}
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
            <input style={{ padding: '3px', width: '90px', marginRight: '10px', marginTop: '10px' }} placeholder={`回答 ${idx + 1}`} onChange={e => matrixCandidateListChange(e, idx)}></input>
          </span>
        </span>)
      )
    }
    return (
      <div>
        回答の種類&nbsp;<select name="mj-nums" id="mj-nums" onChange={e => matrixNumChange(e)}>
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
    axios.get(`/topics?startswith=${props.topic}`, { headers: { 'Authorization': `Bearer ${jwt}`, } })
    .then(res => {
      setTopicCandidateList(res.data);
      setIsLoading(false);
    })
    .catch(err => {

    });

  }, [props.topic])

  // console.log('props.topic', props.topic);
  // console.log('props.cursor', props.cursor);
  // console.log('props.topicList', props.topicList);
  // console.log('topicCandidateList', topicCandidateList);

  // get current topic index


  // get current editing topic

  // get topic list 

  // on push, update topic

  if(isLoading) {return (<span></span>)}

  if(topicCandidateList.length === 0) {return (<span></span>)}

  return (
  <div>
    {topicCandidateList.map((topic: any) => {
      return (<div>{topic.topic}, {topic.num_of_posts}</div>)
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
  const [currentTopicCursor, setCurrentTopicCursor] = useState('');
  const [groupList, setGroupList] = useState<any>([]);
  const [targetGroupId, setTargetGroupId] = useState("");
  const [multipleVoteNum, setMultipleVoteNum] = useState(2);

  useEffect(() => {
    // get group list
    const jwt = getJwt();
    axios.get(`/groups`, { headers: { 'Authorization': `Bearer ${jwt}`, } })
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

  const renderTopic = () => {
    const pattern = (/,|，|、/g);
    if (topicString.length === 0) { return };

    if(!doContainDelim(topicString)) {
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
    setCurrentTopicCursor(currentCursor);
    const pattern = (/,|，|、/g);
    setTopicString(rawTopicString)
    if (doContainDelim(rawTopicString)) {
      let topicList = rawTopicString.split(pattern);
      topicList = topicList.slice(0, maxTopicNum);
      topicList = topicList.map((tp: string) => (tp.trim())).filter((el: string) => (el.length > 0));
      setTopicList(topicList);
      return 
    }
    if (rawTopicString.length === 0) { 
      setTopicList([]);
      return
    };

    setTopicList([rawTopicString]);
  };

  const voteFormRender = () => {
    switch(voteTypeId) {
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

  return (
    <div>
      <form>
        投稿先&nbsp;&nbsp;
        <NativeSelect value={targetGroupId} onChange={e =>  setTargetGroupId(e.target.value)}>
          <option value="">Hearvo</option>
          <option value="">-------------</option>
          {groupList.map((elem: any) => {
            return (
              <option value={elem.id}>{elem.title}</option>
            )
          })}
        </NativeSelect><hr></hr>
        <div>投票タイプ <select style={{ padding: '3px' }} onChange={e => setVoteTypeId(parseInt(e.target.value))}>
          <option value={1}>通常投票</option>
          <option value={3}>連続投票</option>
          <option value={2}>マトリックス投票</option>
        </select>
          {voteTypeId === 3 ? <span><select style={{ padding: '3px' }} onChange={e => setMultipleVoteNum(parseInt(e.target.value))}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select></span> : ''}
        </div>
        <br></br>

        <div>
        終了 <input className={styles.date_button} value={endAt} min={24} max={168} type="number" onChange={e => changeEndAt(e)}></input> 時間後
      </div><br></br>

        <div>
          トピック 一つ以上、読点で区切って入力 
        <input placeholder='トピック1、トピック2、・・・' style={{ padding: '5px', width: '100%', marginBottom: '10px' }} value={topicString} type="text" onChange={e => editTopic(e)}></input>
          {renderTopic()}
        </div>
        <div><TopicCandidates topic={topicString} cursor={currentTopicCursor} topicList={topicList}></TopicCandidates></div>

      <hr></hr><br></br>
        {voteTypeId === 3 ? <h2>表題</h2> : <h2>投票</h2>}
      
      <div>
        <input placeholder="タイトルを入力" className={styles.title} minLength={1} maxLength={150} type="text" onChange={e => setTitle(e.target.value)}></input><br></br>
      </div>
      <div>
        <textarea placeholder="本文を入力" className={styles.content} rows={6} maxLength={5000} onChange={e => setContent(e.target.value)}></textarea>
      </div>



        {voteFormRender()}
      </form>
    </div>
  )
}




export interface NewPostContentProps extends RouteComponentProps<{}> {
  edit: boolean;
  editParentHandle: any;
  keyword: string;
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
    }
  }

  isPostedChange = (val: boolean) => {
    this.setState({
      posted: val
    })
  }

  // checkContent = () => {
  //   if(this.state.title.length > 0
  //     && this.state.content.length > 0
  //     && this.state.topicForApi.length > 0
  //     // && this.state.values.filter((elem) => {elem !== ""}).length > 0
  //     ) {
  //       this.setState({allowPost: true})
  //   };
  // }

  // componentDidMount = () => {
  //   const jwt = getJwt();
  //   axios.get(`/groups`, { headers: { 'Authorization': `Bearer ${jwt}`, } })
  //     .then((res: any) => {
  //       this.setState({groupList: res.data})
  //     }).catch((res: any) => {});
  // }

  componentDidUpdate = (prevProps: any) => {
    if (this.props.edit !== prevProps.edit) {
      this.setState({ edit: this.props.edit });
    }
  }

  createForm = () => {
    const maxWidth = window.matchMedia("(max-width: 700px)")
    
    return (
      <div>
        <Dialog disableBackdropClick={true} fullScreen={maxWidth.matches ? true : false} fullWidth={true} open={this.props.edit} onClose={e => this.props.editParentHandle(e, false)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">投稿</DialogTitle>
          <DialogContent>

            <div style={{ textAlign: 'left' }}>
              <button  style={{width: '15%' }} onClick={e => this.props.editParentHandle(e, false)}>戻る</button>
            </div>
            <br></br>

{/* 
            <form onSubmit={e => this.submit(e)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
              <div>
                投稿先&nbsp;&nbsp;
                <NativeSelect value={this.state.targetGroupId} onChange={e => this.change(e, "targetGroupId")}>
                  <option value="">Hearvo</option>
                  <option value="">-------------</option>
                  {this.state.groupList.map((elem: any) => { return (
                  <option value={elem.id}>{elem.title}</option>
                  ) })}
                </NativeSelect><hr></hr>

                <div>投票タイプ <select style={{ padding: '3px' }} onChange={e => this.change(e, "vote_type_id")}>
                  <option value="1">通常投票</option>
                  <option value="3">連続投票</option>
                  <option value="2">マトリックス投票</option>
                </select>
                </div>
              </div><br></br>


              <div><input placeholder="タイトルを入力" className={styles.title} minLength={1} maxLength={150} type="text" onChange={e => this.change(e, "title")}></input><br></br></div>
              <div><textarea placeholder="本文を入力" className={styles.content} rows={6} maxLength={5000} onChange={e => this.change(e, "content")}></textarea></div>


              &nbsp;&nbsp;{this.state.vote_type_id === '2' ? this.renderMJcandidates() : ''}
              <div style={{ textAlign: 'center'}}>
              投票候補
                {this.createVoteSelect()}
                <button type="button" onClick={e => this.addHandle(e)}><AddIcon style={{ fontSize: 16 }}></AddIcon></button>
              </div>
              <div>
                トピック 読点で区切って入力
                <input placeholder='トピック1、トピック2、・・・' style={{ padding: '5px', width: '100%', marginBottom: '10px'}} value={this.state.topicString} type="text" onChange={e => this.change(e, "topicString")}></input>
                <span>
                  {this.renderTopic()}
                </span>
              </div>
              <div><br></br>
                      終了 <input className={styles.date_button} value={this.state.endhour} min={24} max={168} type="number" onChange={e => this.change(e, "endhour")}></input> 時間後
              </div>
              {this.state.allowPost ? <div className={styles.submit_button}><button style={{ width: '20%', color: "blue" }}>投稿</button></div> : <div style={{ width: '20%', color: "gray"}}>投稿</div>}
              
            </form>
            <div style={{color: 'red'}}>
              {this.state.errorMessage ? this.state.errorMessage : ''}
            </div> */}
            <VoteForm editParentHandle={this.props.editParentHandle}></VoteForm>

          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // mjNumChange = (e: any) => {
  //   e.preventDefault();
  //   this.setState({
  //     mjNums: parseInt(e.target.value),
  //     // mjCandidates: Array(e.target.value).join(".").split("."),
  //   } as unknown as NewPostContentState)
  // }

  // mjCandidatesChange = (e: any, idx: number) => {
  //   e.preventDefault();
  //   let mjCandidates = [...this.state.mjCandidates];
  //   mjCandidates[idx] = e.target.value;
  //   this.setState({
  //     mjCandidates: mjCandidates,
  //   })
  // }

  // renderMJcandidates = () => {

  //   let JSX = [];
  //   for (let idx = 0; idx < this.state.mjNums; idx++) {
  //     JSX.push(
  //       (<span>
  //           <span key={idx}>
  //             <input style={{　padding: '3px',　width: '90px', marginRight: '10px', marginTop: '10px'}} placeholder={`回答 ${idx+1}`} onChange={e => this.mjCandidatesChange(e, idx)}></input>
  //           </span>
  //       </span>)
  //     )
  //   }

  //   return (
  //     <div>
  //       回答の種類&nbsp;<select name="mj-nums" id="mj-nums" onChange={e => this.mjNumChange(e)}> 
  //         <option value="2">2</option>
  //         <option value="3">3</option>
  //         <option value="4">4</option>
  //         <option value="5">5</option>
  //       </select>
  //       <br></br>
  //       <div>
  //         {JSX}
  //       </div>
  //     </div>
  //   )
  // };

  // doContainDelim = (topics: string) => {
  //   const delims = [',', '，', '、'];
  //   let count = 0;
  //   delims.map((elem) => {
  //     if(topics.includes(elem)) {
  //       count = count + 1;
  //     }
  //   })
  //   return count > 0 ? true : false;
  // }

  // renderTopic = () => {
  //   const topics = this.state.topicString;
  //   const pattern = (/,|，|、/g);

  //   if(topics.length === 0) {return};

  //   if (this.doContainDelim(topics)) {
  //     let topicList = topics.split(pattern);
  //     topicList = topicList.slice(0, this.state.maxTopicNum);
  //     topicList = topicList.map((tp: string) => (tp.trim())).filter((el: string) => (el.length > 0));
  //     return (
  //       <div style={{ color: 'black' }}>
  //         {topicList.map((elem: string) => {
  //           if (elem.length > 0) {
  //             return (
  //               <span><b style={{ border: '', borderRadius: '7px', padding: '2px', backgroundColor: '#D3D3D3' }}>{elem}{'   '}</b>&nbsp;&nbsp;</span>
  //             );
  //           }
  //         })}
  //       </div>
  //     )
  //   } else {
  //     return (<span><b style={{ border: '', borderRadius: '7px', padding: '2px', backgroundColor: '#D3D3D3' }}>{topics}{'   '}</b>&nbsp;&nbsp;</span>)
  //   }
  // }

  // editTopic = (topics: string) => {
  //   const pattern = (/,|，|、/g);
  //   if(this.doContainDelim(topics)) {
  //     let topicList = topics.split(pattern);
  //     topicList = topicList.slice(0, this.state.maxTopicNum);
  //     topicList = topicList.map((tp: string) => (tp.trim())).filter((el: string) => (el.length  > 0));
  //     this.setState({
  //       topicForApi: topicList
  //     });
  //   } else {
  //     if (topics.length === 0) { return };
  //     this.setState({
  //       topicForApi: [topics]
  //     });
  //   }
  // };

  // change(e: any, field: string) {
  //   // this.checkContent();
  //   e.preventDefault();
  //   this.setState({
  //     [field]: e.target.value,
  //   } as unknown as NewPostContentState)

  //   switch (field) {
  //     case 'endhour':
  //       const dt = new Date();
  //       const endHour = e.target.value ? parseInt(e.target.value) : 0;
  //       if (endHour > 0 && endHour < 36000) {
  //         const endDate = new Date(dt.setHours(dt.getHours() + endHour));
  //         const endDateString = endDate.toISOString().slice(0, -8);
  //         this.setState({ end_at: endDateString })
  //       }
  //     break
  //     case 'topicString':
  //       this.editTopic(e.target.value);
  //     break
  //   }
  // }

  // voteSelectChange(e: any, idx: number) {
  //   e.preventDefault();
  //   // this.checkContent();
  //   let values = [...this.state.values];
  //   values[idx] = e.target.value;
  //   this.setState({
  //     values: values,
  //   })
  // }


  // deleteHandle = (e: any, idx: number) => {
  //   if (this.state.values.length > 2) {
  //     let values = [...this.state.values];
  //     values.splice(idx, 1);
  //     this.setState({ values });
  //   }
  // }

  // addHandle = (e: any) => {
  //   if (this.state.values.length < 7) {
  //     this.setState(prevState => ({ values: [...prevState.values, ''] }))
  //   }
  // }




  // createVoteSelect = () => {
  //   const voteStyle = { padding: '3px', marginBottom: '5px' }
  //   return this.state.values.map((val: any, idx: number) => {
  //     if (idx > 1) {
  //       return (
  //         <div>
  //           <div key={idx}>
  //             <input style={voteStyle} placeholder={`投票候補 ${idx + 1}`} onChange={e => this.voteSelectChange(e, idx)}></input><button type="button" onClick={e => this.deleteHandle(e, idx)}><RemoveIcon style={{ fontSize: 16 }}></RemoveIcon></button>
  //           </div>
  //         </div>
  //       )
  //     } else {
  //       return (
  //         <div key={idx}>
  //           <input style={voteStyle} placeholder={`投票候補 ${idx + 1}`} onChange={e => this.voteSelectChange(e, idx)}></input>
  //         </div>
  //       )
  //     }
  //   })
  // }

  // submit = (e: any) => {
  //   e.preventDefault();
  //   // this.checkContent();
  //   // if(!this.state.allowPost) {return};

  //   const jwt = getJwt();
  //   const voteObj = this.state.values.map((val) => { return { content: val } });
  //   var data = JSON.stringify({ "title": this.state.title, "content": this.state.content, "group_id": this.state.targetGroupId, "end_at": this.state.end_at, "vote_obj": voteObj, "vote_type_id": this.state.vote_type_id, "topic": this.state.topicForApi, "mj_option_list": this.state.mjCandidates });
  //   console.log('this.state.mjNums', this.state.mjNums)
  //   console.log("data", data);

  //   if (this.state.title.replace(/\s+/g, '').length < 1) {
  //     this.setState({errorMessage: 'タイトルを入力してください'});
  //     return
  //   }

  //   let mjCheckcount = 0;
  //   this.state.mjCandidates.map((elem: any) => {
  //     if(elem.length === 0) {
  //       mjCheckcount = mjCheckcount + 1;
  //     }
  //   });


  //   if (this.state.vote_type_id === '2' && this.state.mjNums !== this.state.mjCandidates.length) {
  //     this.setState({ errorMessage: '回答候補を埋めてください' })
  //     return
  //   }

  //   if (this.state.vote_type_id === '2' &&  mjCheckcount > 0) {
  //     this.setState({ errorMessage: '回答候補を埋めてください' })
  //     return
  //   }

  //   const voteCheck = this.state.values.filter((val) => val.replace(/\s+/g, '') === '');
  //   if (voteCheck.length > 0) {
  //     this.setState({ errorMessage: '投票候補を埋めてください' })
  //     return
  //   }

  //   if (this.state.topicForApi.length < 1) {
  //     this.setState({ errorMessage: 'トピックを最低一つ入力してください' })
  //     return
  //   }



  //   const url = process.env.REACT_APP_API_HOST + '/posts';
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': 'Bearer ' + jwt,
  //     },
  //     body: data
  //   };


  //   fetch(url, options)
  //     .then((res: any) => {
  //       // console.log("res", res);
  //       this.setState({
  //         success: true,
  //         edit: false,
  //         topicString: '',
  //         topicForApi: [],
  //       });
  //       this.isPostedChange(true);
  //       this.props.editParentHandle(e, false);

  //       switch (this.state.targetGroupId) {
  //         case "":
  //           this.props.history.push("/latest");
  //           break;

  //         default:
  //           this.props.history.push(`/group/${this.state.targetGroupId}/feed`);
  //           break;
  //       }
        

  //     }).catch((err: any) => {
  //       // console.log("err", err);
  //       this.setState({
  //         success: true,
  //         edit: false,
  //       });
  //       this.isPostedChange(false);

  //     })
  //   // e.preventDefault();

  // }


  render() {
    return (
      <div>
        <div>{this.createForm()}</div>
        <div>
          <Feed isLogin={this.props.isLogin} keyword={this.props.keyword} isPosted={this.state.posted} isPostedHandeler={this.isPostedChange}></Feed>
        </div>
      </div>
    );
  }
}


export default withRouter(PostContent);