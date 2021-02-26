import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from '../Api';
// import 'bootstrap/dist/css/bootstrap.css';
// import CanvasJSReact from '../canvasjs.react';


import ProgressBar from 'react-bootstrap/ProgressBar'
// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect, withRouter } from 'react-router-dom'
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import CommentIcon from '@material-ui/icons/Comment';
import { renderVoteSelectResult } from '../../helpers/renderVoteSelectResult';
import i18n from "../../helpers/i18n";


const moment = require('moment-timezone');
// moment.locale('ja');
moment.tz.setDefault('Etc/UTC');



export interface EachVoteSelectProps extends RouteComponentProps<{}> {
  voteContent: any;
  postId: number;
  isLogin: boolean;
  hasVoted: boolean;
  data : any;
}

export interface EachVoteSelectState {
  isClicked: boolean;
  isLoaded: boolean;
  voteSelectsCount: any;
  totalVote: number;
}

class EachVoteSelect extends React.Component<EachVoteSelectProps, EachVoteSelectState> {

  constructor(props: any) {
    super(props);

    this.state = {
      isClicked: false,
      isLoaded: false,
      voteSelectsCount: {},
      totalVote: 0,
    }
  }

  change(e: any, id: number) {
    e.preventDefault();
    this.setState({
      isClicked: true,
    });
    if (this.props.isLogin === false) {
      this.props.history.push("/login");
      return
    }
    const jwt = getJwt();
    // if (!jwt) {
    //   this.props.history.push("/login");
    // }
    const voteSelectPostObj = {
      vote_select_id: id,
      post_id: this.props.postId,
    };
    const config = {
      headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY }
    };

    axios.post(
      "/vote_select_users",
      voteSelectPostObj,
      config,
    ).then(res => {
      const countVotePostObj = { post_id: this.props.postId }
      axios.post(
        "/count_vote_selects",
        countVotePostObj,
        config,
      ).then((res) => {
        this.setState({
          voteSelectsCount: res.data.vote_selects_count,
          totalVote: res.data.total_vote,
          isLoaded: true,
        });
      })
    }).catch((err) => {
      // // console.log(err);
    })
  }

  render() {

    if (this.state.isClicked === true && this.state.isLoaded === false) {
      return (<div></div>)
    }

    if ((this.state.isClicked || this.props.hasVoted === true) && this.state.isLoaded === true) {

      const x = this.state.voteSelectsCount.map((da: any) => {return (da.count * 100) / this.state.totalVote});
      const y = this.state.voteSelectsCount.map((da: any) => {return da.content});
      const voteIdList = this.state.voteSelectsCount.map((da: any) => {return da.vote_select_id});
      let plotData = [{ type: 'bar', x: x, y: y, orientation: 'h', myVote: this.props.data.my_vote, voteIdList: voteIdList }];
      let layout = { title: `${i18n.t("eachPost.totalVote")}: ${this.state.totalVote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }

      return (<div className={styles.vote_section} > { renderVoteSelectResult(plotData, layout)}</div>)

    } 


    return (
      <div style={{ width: "100%" }} className={styles.content}>
        {this.props.voteContent.map((data: any) => {
          return (
            <div style={{ whiteSpace: 'nowrap', border: 'solid 1px', borderRadius: '5px', margin: '5px', padding: '5px'}}  className={styles.vote_button}>
                  <div  onClick={e => this.change(e, data.id)}>{data.content}</div>
                </div>
          )
        })}
      </div>
    );
  }
}


export default withRouter(EachVoteSelect);

