import React, { ReactComponentElement } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';

import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, TextField, Fab, Input, Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import * as styles from '../../css/Feed/PostContent.module.css';
import { StringLiteral } from 'typescript';
import { CropLandscapeOutlined, TransferWithinAStationSharp } from '@material-ui/icons';
import NewFeed from './NewFeed';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';


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
}

class NewPostContent extends React.Component<NewPostContentProps, NewPostContentState> {

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
    }
  }

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
            <form onSubmit={e => this.submit(e)} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}>
              <div><input placeholder="タイトルを入力" className={styles.title} minLength={1} maxLength={150} type="text" onChange={e => this.change(e, "title")}></input><br></br></div>
              <div><textarea placeholder="本文を入力" className={styles.content} rows={6} maxLength={5000} onChange={e => this.change(e, "content")}></textarea></div>
        終了: <input className={styles.date_button} value={this.state.endhour} min={24} max={168} type="number" onChange={e => this.change(e, "endhour")}></input> 時間後

              <div>投票タイプ: <select onChange={e => this.change(e, "vote_type_id")}>
                <option value="1">通常投票</option>
                <option value="2">MJ法</option>
              </select>
              </div>
              {this.state.vote_type_id === '2' ? this.renderMJcandidates() : ''} 
              <div style={{ textAlign: 'center'}}>
              投票候補
                {this.createVoteSelect()}
                <button type="button" onClick={e => this.addHandle(e)}><AddIcon style={{ fontSize: 16 }}></AddIcon></button>
              </div>
              <div>
                トピック 読点で区切って入力
                <input style={{width: '100%', marginBottom: '10px'}} value={this.state.topicString} type="text" onChange={e => this.change(e, "topicString")}></input>
                <div>
                  {this.renderTopic()}
                </div>
              </div>
              <div className={styles.submit_button}><button style={{ width: '20%'}}>投稿</button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  mjNumChange = (e: any) => {
    e.preventDefault();
    this.setState({
      mjNums: e.target.value,
      mjCandidates: Array(e.target.value).join(".").split("."),
    } as unknown as NewPostContentState)
  }

  mjCandidatesChange = (e: any, idx: number) => {
    e.preventDefault();
    let mjCandidates = [...this.state.mjCandidates];
    mjCandidates[idx] = e.target.value;
    this.setState({
      mjCandidates: mjCandidates,
    })
  }

  renderMJcandidates = () => {

    let JSX = [];
    for (let idx = 0; idx < this.state.mjNums; idx++) {
      JSX.push(
        (<span>
            <div key={idx}>
              <input placeholder="選択肢" onChange={e => this.mjCandidatesChange(e, idx)}></input>
            </div>
        </span>)
      )
    }

    return (
      <div>
        候補数<select name="mj-nums" id="mj-nums" onChange={e => this.mjNumChange(e)}> 
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <div>
          {JSX}
        </div>
      </div>
    )
  };

  doContainDelim = (topics: string) => {
    const delims = [',', '，', '、'];
    let count = 0;
    delims.map((elem) => {
      if(topics.includes(elem)) {
        count = count + 1;
      }
    })
    return count > 0 ? true : false;
  }

  renderTopic = () => {
    const topics = this.state.topicString;
    const pattern = (/,|，|、/g);
    if (this.doContainDelim(topics)) {
      let topicList = topics.split(pattern);
      topicList = topicList.slice(0, this.state.maxTopicNum);
      topicList = topicList.map((tp: string) => (tp.trim())).filter((el: string) => (el.length > 0));
      return (
        <div style={{ color: 'black' }}>
          {topicList.map((elem: string) => {
            if (elem.length > 0) {
              return (
                <div><b style={{ fontSize: '14px', padding: '1px', backgroundColor: '#E9FEFD' }}>{elem}{'   '}</b></div>
              );
            }
          })}
        </div>
      )

    }
  }

  editTopic = (topics: string) => {
    const pattern = (/,|，|、/g);
    if(this.doContainDelim(topics)) {
      let topicList = topics.split(pattern);
      topicList = topicList.slice(0, this.state.maxTopicNum);
      topicList = topicList.map((tp: string) => (tp.trim())).filter((el: string) => (el.length  > 0));
      this.setState({
        topicForApi: topicList
      });
    }
  };

  change(e: any, field: string) {
    e.preventDefault();
    this.setState({
      [field]: e.target.value,
    } as unknown as NewPostContentState)

    switch (field) {
      case 'endhour':
        const dt = new Date();
        const endHour = e.target.value ? parseInt(e.target.value) : 0;
        if (endHour > 0 && endHour < 36000) {
          const endDate = new Date(dt.setHours(dt.getHours() + endHour));
          const endDateString = endDate.toISOString().slice(0, -8);
          this.setState({ end_at: endDateString })
        }
      break
      case 'topicString':
        this.editTopic(e.target.value);
      break
    }
  }

  voteSelectChange(e: any, idx: number) {
    e.preventDefault();
    let values = [...this.state.values];
    values[idx] = e.target.value;
    this.setState({
      values: values,
    })
  }


  deleteHandle = (e: any, idx: number) => {
    if (this.state.values.length > 2) {
      let values = [...this.state.values];
      values.splice(idx, 1);
      this.setState({ values });
    }
  }

  addHandle = (e: any) => {
    if (this.state.values.length < 7) {
      this.setState(prevState => ({ values: [...prevState.values, ''] }))
    }
  }

  isPostedChange = (val: boolean) => {
    this.setState({
      posted: val
    })
  }


  createVoteSelect = () => {
    return this.state.values.map((val: any, idx: number) => {
      if (idx > 1) {
        return (
          <div>
            <div key={idx}>
              <input placeholder="投票候補の入力" onChange={e => this.voteSelectChange(e, idx)}></input><button type="button" onClick={e => this.deleteHandle(e, idx)}><RemoveIcon style={{ fontSize: 16 }}></RemoveIcon></button>
            </div>
          </div>
        )
      } else {
        return (
          <div key={idx}>
            <input placeholder="投票候補の入力" onChange={e => this.voteSelectChange(e, idx)}></input>
          </div>
        )
      }
    })
  }

  submit = (e: any) => {
    e.preventDefault();
    const jwt = getJwt();
    const voteObj = this.state.values.map((val) => { return { content: val } });
    var data = JSON.stringify({ "title": this.state.title, "content": this.state.content, "end_at": this.state.end_at, "vote_obj": voteObj, "vote_type_id": this.state.vote_type_id, "topic": this.state.topicForApi, "mj_option_list": this.state.mjCandidates });

    if (this.state.title.replace(/\s+/g, '').length < 1) {
      return
    }

    if (this.state.mjCandidates.length < 2) {
      return
    }

    const voteCheck = this.state.values.filter((val) => val.replace(/\s+/g, '') === '');
    if (voteCheck.length > 0) {
      return
    }



    const url = process.env.REACT_APP_API_HOST + '/posts';
    const options = {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + jwt,
      },
      body: data
    };

    console.log("data", data);

    fetch(url, options)
      .then((res: any) => {
        // console.log("res", res);
        this.setState({
          success: true,
          edit: false,
          topicString: '',
          topicForApi: [],
        });
        this.isPostedChange(true);
        this.props.editParentHandle(e, false);
        this.props.history.push("/latest");

      }).catch((err: any) => {
        // console.log("err", err);
        this.setState({
          success: true,
          edit: false,
        });
        this.isPostedChange(false);

      })
    // e.preventDefault();

  }


  render() {
    return (
      <div>
        <div>{this.createForm()}</div>
        <div>
          <NewFeed isLogin={this.props.isLogin} keyword={this.props.keyword} isPosted={this.state.posted} isPostedHandeler={this.isPostedChange}></NewFeed>
        </div>
      </div>
    );
  }
}


export default withRouter(NewPostContent);