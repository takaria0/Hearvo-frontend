import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from '../Api';
// import 'bootstrap/dist/css/bootstrap.css';
// import CanvasJSReact from '../canvasjs.react';


import ProgressBar from 'react-bootstrap/ProgressBar'
// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import HowToVote from '@material-ui/icons/HowToVote';
import CommentIcon from '@material-ui/icons/Comment';
import Plot from 'react-plotly.js';
import EachVoteSelect from './EachVoteSelect';
import EachVoteMj from './EachVoteMj';
import CheckIcon from '@material-ui/icons/Check';
// import Linkify from 'react-linkify';
// import * as linkify from 'linkifyjs';
// import hashtag from 'linkifyjs/plugins/hashtag';


// hashtag(linkify);

const moment = require('moment-timezone');
moment.locale('ja');
moment.tz.setDefault('UTC');


const toHashTag = (content: string) => {
  const baseURL = window.location.origin;
  const splitedContent = content.replace(/　/g, " ").split(" ").map((str) => {
    if (str.startsWith("#")) {
      return <a href={`${baseURL}/search?q=${str.replace("#", "")}&type=hash_tag`} className="text-blue-500">{str}</a>;
    }
    return str + " ";
  })
  return splitedContent;
}




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
                  <div style={{ border: '1px solid black', borderRadius: '5px', margin: 2, }}>
                    <div style={{ backgroundColor: 'rgba(0, 0, 255, 0.1)', width: `${isNaN(x[idx]) ? 0 : x[idx]}%` }}>
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

export interface NewEachPostProps {
  data: any;
  isLogin: boolean;
}

export interface NewEachPostState {
  minAge: number;
  maxAge: number;
  genderSelect: string;
  occupation: string;
  data: any;
  doFilter: boolean;
  voteTypeId: number;
}

class NewEachPost extends React.Component<NewEachPostProps, NewEachPostState> {


  constructor(props: any) {
    super(props);

    this.state = {
      minAge: 0,
      maxAge: 130,
      genderSelect: "",
      occupation: "",
      data: this.props.data,
      voteTypeId: this.props.data.vote_type.id,
      doFilter: false,
    }
  }

  getDiffTime = (datetime: string) => {
    // console.log("記事の時間", datetime);
    // console.log("moment()の時間", moment().format("YYYY-MM-DD HH:mm:ss"));
    const diff = moment(moment(moment().format("YYYY-MM-DD HH:mm:ss"))).diff(datetime);
    const duration = moment.duration(diff);

    // 日・時・分・秒を取得
    const years = duration.years();
    const months = duration.months();
    const weeks = duration.weeks();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    // console.log("days", days)
    // console.log("hours", hours)
    // console.log("minutes", minutes)
    // console.log("seconds", seconds)
    if(years > 0) {
      return `${years}年前`
    } else if (months > 0) {
      return `${months}ヶ月前`
    } else if (weeks > 0) {
      return `${weeks}週間前`
    } else if(days > 0) {
      return `${days}日前`
    } else if(hours > 0) {
      return `${hours}時間前`
    } else if(minutes > 0) {
      return `${minutes}分前`
    } else {
      return `${seconds}秒前`
    }
    // return moment(datetime).fromNow()
  } 

  getEndTime = (datetime: string) => {
    const diff = moment(datetime).diff(moment(moment().format("YYYY-MM-DD HH:mm:ss")));
    const duration = moment.duration(diff);

    // 日・時・分・秒を取得
    const years = duration.years();
    const months = duration.months();
    const weeks = duration.weeks();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    // console.log("days", days)
    // console.log("hours", hours)
    // console.log("minutes", minutes)
    // console.log("seconds", seconds)

    const signCheck = duration.asSeconds();
    if(signCheck < 0) {
      return "投票終了"
    }

    if (years > 0) {
      return `${years}年後に投票終了`
    } else if (months > 0) {
      return `${months}ヶ月後に投票終了`
    } else if (weeks > 0) {
      return `${weeks}週間後に投票終了`
    } else if (days > 0) {
      return `${days}日後に投票終了`
    } else if (hours > 0) {
      return `${hours}時間後に投票終了`
    } else if (minutes > 0) {
      return `${minutes}分後に投票終了`
    } else {
      return `${seconds}秒後に投票終了`
    }
  }

  change(e: any, field: string) {
    this.setState({
      [field]: e.target.value,
    } as unknown as NewEachPostState)
  }



  submit = (e: any) => {
    e.preventDefault();
    const jwt = getJwt();
    axios.get(`/posts?id=${this.props.data.id}&do_filter=yes&gender=${this.state.genderSelect}&min_age=${this.state.minAge}&max_age=${this.state.maxAge}&occupation=${this.state.occupation}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then((res: any) => {
        const data = res.data;
        this.setState({ data });
      }).catch((err) => {
      })
  }

  resetClick = (e: any) => {
    e.preventDefault();
    const jwt = getJwt();
    axios.get(`/posts?id=${this.props.data.id}&do_filter=no`, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then((res: any) => {
        const data = res.data;
        this.setState({ data });
        
      }).catch((err) => {
      })
  }

  filterClick = (e: any, val: boolean) => {
    this.setState({doFilter: val});
  }

  renderTopic = (data: any) => (
    <div style={{ color: 'black' }}>
      &nbsp;&nbsp;{data.topics.map((elem: any) => {
        return (
          <span style={{ }}>
            <small style={{ border: '', borderRadius: '7px', padding: '2px', backgroundColor: '#D3D3D3' }}>{elem.topic.topic}</small>{'  '}
          </span>
        )
      })}
    </div>
  )

  

  renderEachData = (data: any, vote_type_id: number) => {
    let currentFirstURL = "";
    try {
      currentFirstURL = window.location.pathname.split("/")[1]
    } catch {
      currentFirstURL = "";
    }

    let x, y, plotData, layout;
    if(vote_type_id === 1) {
      x = data.vote_selects_count.map((da: any) => {
        return (da.count * 100) / data.total_vote
      });
      y = data.vote_selects_count.map((da: any) => {
        return da.content
      });
      plotData = [{ type: 'bar', x: x, y: y, orientation: 'h' }];
      layout = { title: `合計票数: ${data.total_vote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }
    }

    if(currentFirstURL !== "posts") {
      return (
        <li className={styles.li}>
          <Link to={`/posts/${data?.id}`} className={styles.each_post_link}><div className={styles.title}>{data.title}</div>
            {this.state.data.topics.length > 0 ? this.renderTopic(this.state.data) : ''}
          </Link>
          <div className={styles.content}>{toHashTag(data.content)}</div>
          <div className={styles.vote_section}>
            {vote_type_id === 1 ? renderVoteSelectResult(plotData, layout) : renderVoteMjResult(data)}
            </div>
          <div className={styles.footer}><div>{this.getDiffTime(data.created_at.slice(0, -7).replace("T", " "))}</div >
            <div>{this.getEndTime(this.state.data.end_at.slice(0, -3).replace("T", " "))} <CheckIcon style={{ fontSize: 12 }}></CheckIcon> {this.props.data.total_vote} <CommentIcon style={{ fontSize: 12 }}></CommentIcon> {data.comments.length} by {this.props.data.user_info.name}</div ></div>

        </li>
      )
    } 
    
    // only show detail query mode in /posts/:post_id
    if(currentFirstURL === "posts") {
      const renderCondition = () => 
        (
        <div>
          <button onClick={e => this.filterClick(e, false)}>戻る</button>
          <form onSubmit={e => this.submit(e)}>
            最小年齢: <input type="number" onChange={e => this.change(e, "minAge")} value={this.state.minAge} /><br></br>
              最大年齢: <input type="number" onChange={e => this.change(e, "maxAge")} value={this.state.maxAge} /><br></br>
              性別: <input type="text" onChange={e => this.change(e, "genderSelect")} value={this.state.genderSelect} /><br></br>
              職業: <input type="text" onChange={e => this.change(e, "occupation")} value={this.state.occupation} /><br></br>
            <button>更新</button>
          </form>
            <button onClick={e => this.resetClick(e)}>リセット</button>
          </div>
      )
      return (
        <li className={styles.li}>
          <Link to={`/posts/${data?.id}`} className={styles.each_post_link}><div className={styles.title}>{data.title}</div>
            {this.state.data.topics.length > 0 ? this.renderTopic(this.state.data) : ''}
          </Link>
          <div className={styles.content}>{toHashTag(data.content)}</div>
          {this.state.doFilter ? "" : <button onClick={e => this.filterClick(e, true)}>絞り込み</button>}
          {this.state.doFilter ? renderCondition() : ""}
          
          <div className={styles.vote_section}>
            {vote_type_id === 1 ? renderVoteSelectResult(plotData, layout) : renderVoteMjResult(data)}
            </div>
          <div className={styles.footer}><div>{this.getDiffTime(data.created_at.slice(0, -7).replace("T", " "))}</div >
            <div>{this.getEndTime(this.state.data.end_at.slice(0, -3).replace("T", " "))} <CheckIcon style={{ fontSize: 12 }}></CheckIcon> {this.state.data.total_vote} <CommentIcon style={{ fontSize: 12 }}></CommentIcon> {data.comments.length}  by {this.state.data.user_info.name}</div ></div>
        </li>
      )
    }
  }

  render() {
    if (this.state.data.already_voted === true || this.state.data.vote_period_end === true) {
      return (
        
        <div>
          {this.renderEachData(this.state.data, this.state.voteTypeId)}
        </div>
      );
    }
    else {
      return (
        <li className={styles.li}>
          <Link to={`/posts/${this.state.data?.id}`} className={styles.each_post_link}><div className={styles.title}>{this.state.data.title}</div>
            {this.state.data.topics.length > 0 ? this.renderTopic(this.state.data) : ''}
          </Link>
          <div className={styles.content}>{toHashTag(this.state.data.content)}</div>
          <div className={styles.vote_section}>
            
            {this.state.voteTypeId === 1 ? 
              <EachVoteSelect isLogin={this.props.isLogin} voteContent={this.state.data.vote_selects} postId={this.state.data.id}></EachVoteSelect>
             : 
              <EachVoteMj isLogin={this.props.isLogin} voteContent={this.state.data.vote_mjs} mjOptions={this.state.data.mj_options} postId={this.state.data.id}></EachVoteMj>
             }

            </div>
          <div className={styles.footer}><div>{this.getDiffTime(this.state.data.created_at.slice(0, -7).replace("T", " "))}</div >
            <div>{this.getEndTime(this.state.data.end_at.slice(0, -3).replace("T", " "))} <CheckIcon style={{ fontSize: 12 }}></CheckIcon> {this.state.data.total_vote} <CommentIcon style={{ fontSize: 12 }}></CommentIcon> {this.state.data.comments.length} by {this.state.data.user_info.name}</div >
            </div>
        </li>
      )
    }

  }
}

export default NewEachPost;