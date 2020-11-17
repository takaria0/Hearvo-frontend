import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from '../Api';

// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'

import EachFeed from './OldEachFeed';
import Plot from 'react-plotly.js';

const renderVoteResult = (data: any, layout: any) => {

  return (
    <div>
      <div >
        <Plot className={styles.plotly}
          data={data}
          layout={layout} //  width: 470, height: 300,
          config={{
            responsive: true,
            useResizeHandler: true
          }}
        />
      </div>
    </div>
  )
}

export interface EachVoteSelectProps {
  voteContent: any;
  postId: number;
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


      return (
        <div>
          Loading ...
        </div>
      )


    } else if (this.state.isClicked === true && this.state.isLoaded === true) {

      const x = this.state.voteSelectsCount.map((da: any) => {
        return (da.count * 100) / this.state.totalVote
      }).reverse();
      const y = this.state.voteSelectsCount.map((da: any) => {
        return da.content
      }).reverse();
      let plotData = [{ type: 'bar', x: x, y: y, orientation: 'h' }];
      let layout = { title: `合計票数: ${this.state.totalVote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }

      return (
        < div className={styles.vote_section} > { renderVoteResult(plotData, layout)}</div>
      )


    } else {


      return (
        
        <div className={styles.content}>
          {this.props.voteContent.map((data: any) => { 
            return (
              <div>
                { data.content}
                <button onClick={e => this.change(e, data.id)}>Vote</button>
              </div>
            )
          })}
        </div>
      );


    }

  }
}





export interface NewEachPostProps {
  data: any;
}

export interface NewEachPostState {

}

class NewEachPost extends React.Component<NewEachPostProps, NewEachPostState> {


  constructor(props: any) {
    super(props);

  }






  renderEachData = (data: any) => {


    const x = data.vote_selects_count.map((da: any) => {
      return (da.count * 100) / data.total_vote
    }).reverse();
    const y = data.vote_selects_count.map((da: any) => {
      return da.content
    }).reverse();
    let plotData = [{ type: 'bar', x: x, y: y, orientation: 'h' }];
    let layout = { title: `合計票数: ${data.total_vote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }

    return (
      <li className={styles.li}>
        <div className={styles.title}>{data.title}</div>
        <div className={styles.content}>{data.content}</div>
        <div className={styles.vote_section}>{renderVoteResult(plotData, layout)}</div>
        <div className={styles.footer}><div>{data.created_at.slice(0, -7).replace("T", " ")}</div >
          <div>コメント数: {data.comments.length}, 投票数: {this.props.data.total_vote}</div ></div>

      </li>
    )
  }

  render() {
    if (this.props.data.already_voted === true || this.props.data.vote_period_end === true) {
      return (
        <div>
          {this.renderEachData(this.props.data)}
        </div>
      );
    }
    else {
      return (
        <li className={styles.li}>
          <div className={styles.title}>{this.props.data.title}</div>
          <div className={styles.content}>{this.props.data.content}</div>
          <div className={styles.vote_section}><EachVoteSelect voteContent={this.props.data.vote_selects} postId={this.props.data.id}></EachVoteSelect></div>
          <div className={styles.footer}><div>{this.props.data.created_at.slice(0, -7).replace("T", " ")}</div >
      <div>コメント数: {this.props.data.comments.length}, 投票数: {this.props.data.total_vote}</div ></div>
        </li>
      )
    }

  }
}

export default NewEachPost;