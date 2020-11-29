
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
import EachFeed from './OldEachFeed';
import Plot from 'react-plotly.js';

const moment = require('moment-timezone');
// moment.locale('ja');
moment.tz.setDefault('Etc/UTC');




const renderVoteMjResult = (baseData: any) => {
  return (
    <table style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse" }}>


      <tr><th style={{ border: "1px solid black", borderCollapse: "collapse" }}> 候補 </th>{baseData.mj_options.map((obj: any) => {
        return (
          <th style={{ border: "1px solid black", borderCollapse: "collapse" }}>{obj.content}</th>
        )
      })}</tr>


      {baseData.vote_mjs.map((data: any, idx: number) => {
        const countData = baseData.vote_mj_count[idx];
        const content = data.content;
        const countObj = countData?.count ? countData.count : [];
        return (
          <tr><td style={{ border: "1px solid black", borderCollapse: "collapse" }}>{content}</td>{baseData.mj_options.map((obj: any) => {
            const mj_option_id = obj.id;
            const mj_option_count = countObj.filter((el: any) => { return el.mj_option_id === mj_option_id })
            return (
              <td style={{ border: "1px solid black", borderCollapse: "collapse" }}>{mj_option_count.length > 0 ? mj_option_count[0].count : 0}</td>
            )
          })}</tr>
        )
      })}
    </table>
  )
}

export interface EachVoteMjProps extends RouteComponentProps<{}> {
  voteContent: any;
  mjOptions: any;
  postId: number;
  isLogin: boolean;
}

export interface EachVoteMjState {
  isClicked: boolean;
  isLoaded: boolean;
  voteMjCount: any;
  mjCountResult: any;
  mjContent: any;
  totalVote: number;
  data: any,
}

class EachVoteMj extends React.Component<EachVoteMjProps, EachVoteMjState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isClicked: false,
      isLoaded: false,
      voteMjCount: [],
      mjCountResult: [],
      mjContent: [],
      data: [],
      totalVote: 0,
    }
  }

  submit = (e: any) => {
    e.preventDefault();
    if (this.props.isLogin === false) {
      this.props.history.push("/login");
      return
    }
    this.setState({
      isClicked: true,
    });
    const jwt = getJwt();
    // if (!jwt) {
    //   this.props.history.push("/login");
    // }
    const voteMjPostObj = {
      vote_mj_obj: this.state.voteMjCount,
      post_id: this.props.postId,
    };
    const config = {
      headers: { Authorization: `Bearer ${jwt}` }
    };
    axios.post(
      "/vote_mj_users",
      voteMjPostObj,
      config,
    ).then(res => {
      console.log("res", res);
      const countVotePostObj = { post_id: this.props.postId }
      axios.post(
        "/count_vote_mjs",
        countVotePostObj,
        config,
      ).then((res) => {

        this.setState({
          data: res.data,
          mjCountResult: res.data.vote_mj_count,
          mjContent: res.data.vote_mj_obj,
          totalVote: res.data.total_vote,
        });

        this.setState({
          isLoaded: true,
        });
      })

    }).catch((err) => {
      // // console.log(err);
    })
  };

  change(e: any, voteMjId: number) {
    console.log("this.state.voteMjCount", this.state.voteMjCount);
    console.log("voteMjId", voteMjId);
    console.log("e.target.value", e.target.value);
    const filteredArray = this.state.voteMjCount.filter((el: any) => { return el.vote_mj_id != voteMjId; });
    filteredArray.push({
      vote_mj_id: voteMjId,
      mj_option_id: parseInt(e.target.value),
    });

    this.setState({
      voteMjCount: filteredArray,
    })
  }

  render() {

    if ((this.state.isClicked === true && this.state.isLoaded === false)) {
      return (<div>Loading ...</div>)
    }
    if (this.state.isClicked === true && this.state.isLoaded === true) {
      return (
        <div>
          < div className={styles.vote_section}>
            <table style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse" }}>


              <tr><th style={{ border: "1px solid black", borderCollapse: "collapse" }}> 候補 </th>{this.state.data.mj_options.map((obj: any) => {
                return (
                  <th style={{ border: "1px solid black", borderCollapse: "collapse" }}>{obj.content}</th>
                )
              })}</tr>


              {this.state.data.vote_mj_obj.map((data: any, idx: number) => {
                const countData = this.state.data.vote_mj_count[idx];
                const content = data.content;
                const countObj = countData?.count ? countData.count : [];
                return (
                  <tr><td style={{ border: "1px solid black", borderCollapse: "collapse" }}>{content}</td>{this.state.data.mj_options.map((obj: any) => {
                    const mj_option_id = obj.id;
                    const mj_option_count = countObj.filter((el: any) => { return el.mj_option_id === mj_option_id })
                    return (
                      <td style={{ border: "1px solid black", borderCollapse: "collapse" }}>{mj_option_count.length > 0 ? mj_option_count[0].count : 0}</td>
                    )
                  })}</tr>
                )
              })}
            </table>
          </div>
        </div>
      )
    }

    if (this.state.isClicked === false && this.state.isLoaded === false) {

      return (
        <div>
          <div className={styles.content}>
            <form onSubmit={e => this.submit(e)}>
              {this.props.voteContent.map((data: any) => {
                const voteMjId = data.id;
                return (
                  <div>
                    { data.content}:

                    <div onChange={e => this.change(e, voteMjId)}>
                      {this.props.mjOptions.map((option: any) => {
                        const mjOptionId = option.id;
                        return (
                          <b>

                            <label className={styles.label} htmlFor={mjOptionId}><input className={styles.input} type="radio" name={voteMjId} value={mjOptionId}></input>{option.content}</label>
                          </b>
                        )
                      })}
                    </div>

                  </div>
                )
              })}
              <button type="submit" >提出</button>
            </form>
          </div>
        </div>
      );
    }
  }
}




export default withRouter(EachVoteMj);