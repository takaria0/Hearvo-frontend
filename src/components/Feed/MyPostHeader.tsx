import React from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';

import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, TextField, Fab, Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BackspaceIcon from '@material-ui/icons/Backspace';

import * as styles from '../../css/Feed/PostContent.module.css';
import * as homeStyles from '../../css/Home.module.css';
import { StringLiteral } from 'typescript';
import { CropLandscapeOutlined, TransferWithinAStationSharp } from '@material-ui/icons';
import NewFeed from './NewFeed';


export interface NewPostContentProps {
  edit: boolean;
  editParentHandle: any;
  keyword: string;
}

export interface NewPostContentState {
  edit?: boolean;
  title?: string;
  content?: string;
  endhour?: string;
  values: Array<string>;
  end_at: string;
  success: boolean;
  posted: boolean;
}

class NewPostContent extends React.Component<NewPostContentProps, NewPostContentState> {

  constructor(props: any) {
    super(props);

    const currentDate = new Date();
    const defaultEndAt = new Date(currentDate.setHours(currentDate.getHours() + 24)).toISOString().slice(0, -8);

    this.state = {
      edit: false,
      title: "",
      content: "",
      endhour: "24",
      end_at: defaultEndAt,
      values: ['', ''],
      posted: false,
      success: false,
    }
  }

  componentDidUpdate = (prevProps: any) => {
    if (this.props.edit !== prevProps.edit) {
      this.setState({ edit: this.props.edit });
    }
  }

  change(e: any, field: string) {
    e.preventDefault();
    this.setState({
      [field]: e.target.value,
    } as unknown as NewPostContentState)
    if (field === "endhour") {
      const dt = new Date();
      const endHour = e.target.value ? parseInt(e.target.value) : 0;
      if (endHour > 0 && endHour < 36000) {
        const endDate = new Date(dt.setHours(dt.getHours() + endHour));
        const endDateString = endDate.toISOString().slice(0, -8);
        this.setState({ end_at: endDateString })
      }
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
    if (this.state.values.length < 10) {
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
              <input style={voteStyle} placeholder="投票候補の入力" onChange={e => this.voteSelectChange(e, idx)}></input><button type="button" onClick={e => this.deleteHandle(e, idx)}>削除</button>
            </div>
          </div>
        )
      } else {
        return (
          <div key={idx}>
            <input style={voteStyle} placeholder="投票候補の入力" onChange={e => this.voteSelectChange(e, idx)}></input>
          </div>
        )
      }
    })
  }

  submit = (e: any) => {

    const jwt = getJwt();
    const voteSelectObj = this.state.values.map((val) => { return { content: val } });
    var data = JSON.stringify({ "title": this.state.title, "content": this.state.content, "end_at": this.state.end_at, "vote_selects": voteSelectObj });

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
        });
        this.isPostedChange(true);
        this.props.editParentHandle(e, false);

      }).catch((err: any) => {
        // console.log("err", err);
        this.setState({
          success: true,
          edit: false,
        });
        this.isPostedChange(false);

      })
    e.preventDefault();

  }



  render() {
    return (
      <div>
          <NewFeed isLogin={true} keyword={this.props.keyword} isPosted={this.state.posted} isPostedHandeler={this.isPostedChange}></NewFeed>
      </div>
    );
  }
}



export interface MyPostHeaderProps {
  keyword: string;
}

export interface MyPostHeaderState {
  edit: boolean;
}

class MyPostHeader extends React.Component<MyPostHeaderProps, MyPostHeaderState> {

  constructor(props: any) {
    super(props);

    this.state = {
      edit: false
    }
  }

  editHandle = (e: any, edit: boolean) => {
    e.preventDefault();
    this.setState({
      edit: edit,
    })
  }

  headerJSX = () => {
    if (this.state.edit) {
      return (
        <div className={styles.mini_header}>
          バグ取り感謝します。
        </div>
      )
    } else {
      return (
        <div className={styles.mini_header}>
          バグ取り感謝します。
        </div>
      )
    }
  }

  render() {
    return (
      <div className={homeStyles.body}>
        <div>{this.headerJSX()}</div>
        <NewPostContent edit={this.state.edit} editParentHandle={this.editHandle} keyword={this.props.keyword}></NewPostContent>
      </div>
    );
  }
}

export default MyPostHeader;
