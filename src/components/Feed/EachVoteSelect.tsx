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


const renderVoteSelectResult = (data: any, layout: any) => {
  const x = data[0].x;
  const y = data[0].y;
  // function roundToTwo(num: any) {
  //   return (Math.round(num + "e+2") + "e-2");
  // }
  // const dataPoints = y.map((label: string, idx: number) => {
  //   x[idx] = Math.round(x[idx]);
  //   return { y: x[idx], label: label }
  // });
  // const baseHeight = dataPoints.length * 30;
  // const options = {
  //   animationEnabled: true,
  //   barPercentage: 1,
  //   theme: "light2",
  //   // height: baseHeight,
  //   dataPointWidth: 100/dataPoints.length,
  //   title: {
  //     // text: "Most Popular Social Networking Sites"
  //   },
  //   axisX: {
  //     // title: "Social Network",
  //     reversed: true,
  //   },
  //   axisY: {
  //     // title: "Monthly Active Users",
  //     includeZero: true,
  //     maximum: 101,

  //     // labelFormatter: this.addSymbols
  //   },
  //   data: [{
  //     type: "bar",
  //     dataPoints: dataPoints
  //   }]
  // }

  return (
    <div>


      <div>
        <ul className={styles.vote_ul}>
          <div>
            {/* <CanvasJSChart options={options} />
                   */}
            {
              y.map((label: string, idx: number) => {
                x[idx] = Math.round(x[idx]);
                return (
                  <div>

                    {label} {isNaN(x[idx]) ? 0 : x[idx]}%

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

    console.log("voteSelectPostObj", voteSelectPostObj)
    console.log("config", config)
    axios.post(
      "/vote_select_users",
      voteSelectPostObj,
      config,
    ).then(res => {
      console.log("res", res);
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

    if (this.state.isClicked === true && this.state.isLoaded === true) {

      const x = this.state.voteSelectsCount.map((da: any) => {
        return (da.count * 100) / this.state.totalVote
      });
      const y = this.state.voteSelectsCount.map((da: any) => {
        return da.content
      });
      let plotData = [{ type: 'bar', x: x, y: y, orientation: 'h' }];
      let layout = { title: `合計票数: ${this.state.totalVote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }
      return (
        < div className={styles.vote_section} > { renderVoteSelectResult(plotData, layout)}</div>
      )

    } else {
      return (
        <div className={styles.content}>
          {this.props.voteContent.map((data: any) => {
            return (
              <div>
                { data.content}:
                <button onClick={e => this.change(e, data.id)}>Vote</button>
              </div>
            )
          })}
        </div>
      );
    }
  }
}


export default withRouter(EachVoteSelect);

