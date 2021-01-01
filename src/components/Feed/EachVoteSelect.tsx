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
import Plot from 'react-plotly.js';

const moment = require('moment-timezone');
// moment.locale('ja');
moment.tz.setDefault('Etc/UTC');


const renderVoteSelectResult = (data: any, layout: any) => {
  const x = data[0].x;
  const y = data[0].y;
  return (
    <div>
      <div>
        <ul className={styles.vote_ul}>
          <div>
            {
              y.map((label: string, idx: number) => {
                x[idx] = Math.round(x[idx]);
                return (
                  <div style={{ border: 'solid 1px', borderRadius: '5px', marginBottom: '5px'}}>
                    <div style={{ paddingLeft: '2px', paddingTop: '3px', paddingBottom: '3px', backgroundColor: 'rgba(0, 0, 255, 0.1)', width: `${isNaN(x[idx]) ? 0 : x[idx]}%` }}>
                      <div style={{ whiteSpace: 'nowrap', padding: 2 }}>
                        <div style={{ textAlign: 'left' }}>
                          {label} {isNaN(x[idx]) ? 0 : x[idx]}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </ul>
      </div>
    </div>
  )
}

export interface EachVoteSelectProps extends RouteComponentProps<{}> {
  voteContent: any;
  postId: number;
  isLogin: boolean;
  hasVoted: boolean;
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
      headers: { Authorization: `Bearer ${jwt}` }
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
      return (<div>Loading ...</div>)
    }

    if ((this.state.isClicked || this.props.hasVoted === true) && this.state.isLoaded === true) {

      const x = this.state.voteSelectsCount.map((da: any) => {
        return (da.count * 100) / this.state.totalVote
      });
      const y = this.state.voteSelectsCount.map((da: any) => {
        return da.content
      });
      let plotData = [{ type: 'bar', x: x, y: y, orientation: 'h' }];
      let layout = { title: `合計票数: ${this.state.totalVote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }
      return (
        <div className={styles.vote_section} > { renderVoteSelectResult(plotData, layout)}</div>
      )

    } else {
      return (
        <div style={{ width: "100%" }} className={styles.content}>
          {this.props.voteContent.map((data: any) => {
            return (
              <div >
                <div>
                  <div style={{ border: 'solid 1px', borderRadius: '5px', margin: '5px', padding: '5px'}}  className={styles.vote_button}>
                    <div  onClick={e => this.change(e, data.id)}>
                      <div>
                      {data.content}
                      </div>
                      </div>
              </div>
              </div>
              </div>
            )
          })}
        </div>
      );
    }
  }
}


export default withRouter(EachVoteSelect);

