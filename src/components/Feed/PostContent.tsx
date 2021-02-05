import React, { ReactComponentElement } from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';

import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, TextField, Fab, Input, Menu, MenuItem } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import * as styles from '../../css/Feed/PostContent.module.css';
import { StringLiteral } from 'typescript';
import { CropLandscapeOutlined, TransferWithinAStationSharp } from '@material-ui/icons';
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

  checkContent = () => {
    if(this.state.title.length > 0
      && this.state.content.length > 0
      && this.state.topicForApi.length > 0
      // && this.state.values.filter((elem) => {elem !== ""}).length > 0
      ) {
        this.setState({allowPost: true})
    };
  }

  componentDidMount = () => {
    const jwt = getJwt();
    axios.get(`/groups`, { headers: { 'Authorization': `Bearer ${jwt}`, } })
      .then((res: any) => {
        this.setState({groupList: res.data})
      }).catch((res: any) => {});
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
              <div>
                投稿先&nbsp;&nbsp;

                <NativeSelect value={this.state.targetGroupId} onChange={e => this.change(e, "targetGroupId")}>
                  <option value="">Hearvo</option>
                  <option value="">-------------</option>
                  {this.state.groupList.map((elem: any) => { return (
                  <option value={elem.id}>{elem.title}</option>
                  ) })}
                  {/* <option value={10}>Ten</option>
                  <option value={20}>Twenty</option>
                  <option value={30}>Thirty</option> */}
                </NativeSelect><hr></hr><br></br>

                
              </div>
              <div><input placeholder="タイトルを入力" className={styles.title} minLength={1} maxLength={150} type="text" onChange={e => this.change(e, "title")}></input><br></br></div>
              <div><textarea placeholder="本文を入力" className={styles.content} rows={6} maxLength={5000} onChange={e => this.change(e, "content")}></textarea></div>
        終了 <input className={styles.date_button} value={this.state.endhour} min={24} max={168} type="number" onChange={e => this.change(e, "endhour")}></input> 時間後

              <div>投票タイプ <select style={{ padding: '3px' }} onChange={e => this.change(e, "vote_type_id")}>
                <option value="1">通常投票</option>
                <option value="2">MJ法</option>
              </select>
                &nbsp;&nbsp;{this.state.vote_type_id === '2' ? this.renderMJcandidates() : ''} 
              </div>
              
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
              {this.state.allowPost ? <div className={styles.submit_button}><button style={{ width: '20%', color: "blue" }}>投稿</button></div> : <div style={{ width: '20%', color: "gray"}}>投稿</div>}
              
            </form>
            <div style={{color: 'red'}}>
              {this.state.errorMessage ? this.state.errorMessage : ''}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  mjNumChange = (e: any) => {
    e.preventDefault();
    this.setState({
      mjNums: parseInt(e.target.value),
      // mjCandidates: Array(e.target.value).join(".").split("."),
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
            <span key={idx}>
              <input style={{　padding: '3px',　width: '90px', marginRight: '10px', marginTop: '10px'}} placeholder={`回答 ${idx+1}`} onChange={e => this.mjCandidatesChange(e, idx)}></input>
            </span>
        </span>)
      )
    }

    return (
      <span>
        回答の種類&nbsp;<select name="mj-nums" id="mj-nums" onChange={e => this.mjNumChange(e)}> 
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <div>
          {JSX}
        </div>
      </span>
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

    if(topics.length === 0) {return};

    if (this.doContainDelim(topics)) {
      let topicList = topics.split(pattern);
      topicList = topicList.slice(0, this.state.maxTopicNum);
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
    } else {
      return (<span><b style={{ border: '', borderRadius: '7px', padding: '2px', backgroundColor: '#D3D3D3' }}>{topics}{'   '}</b>&nbsp;&nbsp;</span>)
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
    } else {
      if (topics.length === 0) { return };
      this.setState({
        topicForApi: [topics]
      });
    }
  };

  change(e: any, field: string) {
    // this.checkContent();
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
    // this.checkContent();
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
    const voteStyle = { padding: '3px', marginBottom: '5px' }
    return this.state.values.map((val: any, idx: number) => {
      if (idx > 1) {
        return (
          <div>
            <div key={idx}>
              <input style={voteStyle} placeholder={`投票候補 ${idx + 1}`} onChange={e => this.voteSelectChange(e, idx)}></input><button type="button" onClick={e => this.deleteHandle(e, idx)}><RemoveIcon style={{ fontSize: 16 }}></RemoveIcon></button>
            </div>
          </div>
        )
      } else {
        return (
          <div key={idx}>
            <input style={voteStyle} placeholder={`投票候補 ${idx + 1}`} onChange={e => this.voteSelectChange(e, idx)}></input>
          </div>
        )
      }
    })
  }

  submit = (e: any) => {
    e.preventDefault();
    // this.checkContent();
    // if(!this.state.allowPost) {return};

    const jwt = getJwt();
    const voteObj = this.state.values.map((val) => { return { content: val } });
    var data = JSON.stringify({ "title": this.state.title, "content": this.state.content, "group_id": this.state.targetGroupId, "end_at": this.state.end_at, "vote_obj": voteObj, "vote_type_id": this.state.vote_type_id, "topic": this.state.topicForApi, "mj_option_list": this.state.mjCandidates });
    console.log('this.state.mjNums', this.state.mjNums)
    console.log("data", data);

    if (this.state.title.replace(/\s+/g, '').length < 1) {
      this.setState({errorMessage: 'タイトルを入力してください'});
      return
    }

    let mjCheckcount = 0;
    this.state.mjCandidates.map((elem: any) => {
      if(elem.length === 0) {
        mjCheckcount = mjCheckcount + 1;
      }
    });


    if (this.state.vote_type_id === '2' && this.state.mjNums !== this.state.mjCandidates.length) {
      this.setState({ errorMessage: '回答候補を埋めてください' })
      return
    }

    if (this.state.vote_type_id === '2' &&  mjCheckcount > 0) {
      this.setState({ errorMessage: '回答候補を埋めてください' })
      return
    }

    const voteCheck = this.state.values.filter((val) => val.replace(/\s+/g, '') === '');
    if (voteCheck.length > 0) {
      this.setState({ errorMessage: '投票候補を埋めてください' })
      return
    }

    if (this.state.topicForApi.length < 1) {
      this.setState({ errorMessage: 'トピックを最低一つ入力してください' })
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

        switch (this.state.targetGroupId) {
          case "":
            this.props.history.push("/latest");
            break;

          default:
            this.props.history.push(`/group/${this.state.targetGroupId}/feed`);
            break;
        }
        

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
          <Feed isLogin={this.props.isLogin} keyword={this.props.keyword} isPosted={this.state.posted} isPostedHandeler={this.isPostedChange}></Feed>
        </div>
      </div>
    );
  }
}


export default withRouter(PostContent);