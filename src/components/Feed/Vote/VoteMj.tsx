import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from '../../Api';
// import 'bootstrap/dist/css/bootstrap.css';
// import CanvasJSReact from '../canvasjs.react';


import ProgressBar from 'react-bootstrap/ProgressBar'
// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../../css/Feed.module.css';
import { getJwt } from '../../../helpers/jwt';
import { RouteComponentProps, Link, Redirect, withRouter } from 'react-router-dom'
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import CommentIcon from '@material-ui/icons/Comment';
import i18n from "../../../helpers/i18n";

const moment = require('moment-timezone');
// moment.locale('ja');
moment.tz.setDefault('Etc/UTC');




const renderVoteMjResult = (baseData: any) => {
  return (
    <table style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse" }}>


      <tr><th style={{ border: "1px solid black", borderCollapse: "collapse" }}> {i18n.t("eachPost.candidate")} </th>{baseData.mj_options.map((obj: any) => {
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
  hasVoted: boolean;
}

export interface EachVoteMjState {
  isClicked: boolean;
  isLoaded: boolean;
  voteMjCount: any;
  mjCountResult: any;
  mjContent: any;
  totalVote: number;
  data: any;
  errorMessage: string;
  // buttonColor: any;
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
      errorMessage: '',
    }
  }


  submit = (e: any) => {
    e.preventDefault();
    const post_id = this.props.postId;

    if (this.props.isLogin === false) {
      // this.props.history.push("/login");
      this.props.history.push("/login"+"?destination="+"posts"+"&value="+post_id)  //ログイン後、投稿詳細ページに飛ぶ
      return;
    }

    if (this.props.voteContent.length !== this.state.voteMjCount.length) {
      this.setState({ errorMessage: i18n.t("eachPost.selectAllCandidate")})
      return;
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
      headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY }
    };
    axios.post(
      "/vote_mj_users",
      voteMjPostObj,
      config,
    ).then(res => {
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
    })
  };


  change(e: any, voteMjId: number) {

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
      return (<div></div>)
    }
    if ((this.state.isClicked || this.props.hasVoted === true) && this.state.isLoaded === true) {
      return (
        <div>
          < div className={styles.vote_section}>
            <table style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse" }}>


              <tr><th style={{ border: "1px solid black", borderCollapse: "collapse" }}> {i18n.t("eachPost.candidate")} </th>{this.state.data.mj_options.map((obj: any) => {
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
                    <div style={{ textAlign: 'left', backgroundColor: '#F3F3F3', padding: '2px', margin: '1px', border: 'solid 1px', borderRadius: '3px'}}>
                      {data.content}
                    </div>
                    

                    <div style={{ padding: '1px', margin: '1px' }} onChange={e => this.change(e, voteMjId)}>
                      {this.props.mjOptions.map((option: any) => {
                        const mjOptionId = option.id;
                        return (
                          <span style={{  padding: '1px', margin: '1px'}}>
                            
                            <label htmlFor={mjOptionId}>
                              <input  type="radio" name={voteMjId} value={mjOptionId}></input>
                              {option.content}
                            </label>
                          </span>
                        )
                      })}
                    </div>

                  </div>
                )
              })}

              <button  style={{ marginTop: '10px' }} type="submit" >{i18n.t("newPost.vote")}</button>
            </form>
            <div style={{ color : 'red'}}>
              {this.state.errorMessage ? this.state.errorMessage : ''}
            </div>
          </div>
        </div>
      );
    }
  }
}




export default withRouter(EachVoteMj);