import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from '@material-ui/core';
import axios from '../Api';
import { Helmet } from "react-helmet";

import ProgressBar from 'react-bootstrap/ProgressBar'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import CommentIcon from '@material-ui/icons/Comment';
import EachVoteSelect from './EachVoteSelect';
import EachVoteMj from './EachVoteMj';
import EachMultipleVote from './EachMultipleVote';
import CheckIcon from '@material-ui/icons/Check';
import { renderVoteSelectResult } from '../../helpers/renderVoteSelectResult';
import { MyResponsivePie } from '../../helpers/NivoPlots';
import CompareResult from './CompareResult';
import i18n from "../../helpers/i18n";


const moment = require('moment-timezone');
moment.locale('ja');
moment.tz.setDefault('UTC');


const plotAttributes = (genderData: any, ageData: any) => {
  const height = 300;
  return (
    <div>
      <h4 style={{ textAlign: 'center' }}>{i18n.t("eachPost.votersAttributes")}</h4>
      <div style={{ height }}>
        <h5 style={{ textAlign: 'center' }}>{i18n.t("eachPost.gender")}</h5>
        <MyResponsivePie data={genderData} colors={{ datum: 'data.color' }} legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            // symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}></MyResponsivePie>
      </div>
      <h5 style={{ textAlign: 'center' }}>{i18n.t("eachPost.age")}</h5>
      <div style={{ height }}>
        <MyResponsivePie data={ageData} colors={{ "scheme": "set3" }} legends={
          [
            {
              anchor: 'top-left',
              direction: 'column',
              justify: false,
              translateX: 0,
              translateY: 0,
              itemWidth: 100,
              itemHeight: 20,
              itemsSpacing: 0,
              symbolSize: 20,
              itemDirection: 'left-to-right'
            }
          ]}></MyResponsivePie>
      </div>
    </div>
  )
}


const toHashTag = (content: string) => {
  const baseURL = window.location.origin;
  const splitedContent = content.replace(/　/g, " ").split(" ").map((str) => {
    if (str.startsWith("#")) {
      return <Link style={{color: 'blue'}} className={styles.topic_link} to={`/search?q=${str.replace("#", "")}&type=hash_tag`}>{str}</Link>;
    }
    return str + " ";
  })
  return splitedContent;
}


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
  dataArray: any;
  filterArray: any;
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
      dataArray: [this.props.data],
      filterArray: [{
        doFilter: false,
        minAge: 0,
        maxAge: 130,
        genderSelect: "",
        occupation: "",
      }],
    }
  }

  componentDidUpdate = (prevProps: any, prevState: any) => {
    
    if(prevProps.data !== this.props.data) {
      return true;
    }

  }

  // occupationForm = () => {
  //   return (
  //     <div>
  //       <select name="job" onChange={e => this.change(e, "occupation")}>
  //         <option value="">選択してください</option>
  //         <option value="公務員">公務員</option>
  //         <option value="経営者・役員">経営者・役員</option>
  //         <option value="会社員">会社員</option>
  //         <option value="自営業">自営業</option>
  //         <option value="自由業">自由業</option>
  //         <option value="専業主婦">専業主婦</option>
  //         <option value="パート・アルバイト">パート・アルバイト</option>
  //         <option value="学生">学生</option>
  //         <option value="その他">その他</option>
  //       </select>
  //     </div>
  //   )
  // }

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

    if(years > 0) {
      return `${years}${i18n.t("eachPost.yearBefore")}`
    } else if (months > 0) {
      return `${months}${i18n.t("eachPost.monthBefore")}`
    } else if (weeks > 0) {
      return `${weeks}${i18n.t("eachPost.weekBefore")}`
    } else if(days > 0) {
      return `${days}${i18n.t("eachPost.dayBefore")}`
    } else if(hours > 0) {
      return `${hours}${i18n.t("eachPost.hourBefore")}`
    } else if(minutes > 0) {
      return `${minutes}${i18n.t("eachPost.minuteBefore")}`
    } else {
      return `${seconds}${i18n.t("eachPost.secondBefore")}`
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

    const signCheck = duration.asSeconds();
    if(signCheck < 0) {
      return i18n.t("eachPost.voteEnd")
    }

    if (years > 0) {
      return `${years}${i18n.t("eachPost.yearLater")}`
    } else if (months > 0) {
      return `${months}${i18n.t("eachPost.monthLater")}`
    } else if (weeks > 0) {
      return `${weeks}${i18n.t("eachPost.weekLater")}`
    } else if (days > 0) {
      return `${days}${i18n.t("eachPost.dayLater")}`
    } else if (hours > 0) {
      return `${hours}${i18n.t("eachPost.hourLater")}`
    } else if (minutes > 0) {
      return `${minutes}${i18n.t("eachPost.minuteLater")}`
    } else {
      return `${seconds}${i18n.t("eachPost.secondLater")}`
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
    axios.get(`/posts?id=${this.props.data.id}&do_filter=yes&gender=${this.state.genderSelect}&min_age=${this.state.minAge}&max_age=${this.state.maxAge}&occupation=${this.state.occupation}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
      .then((res: any) => {
        const data = res.data;
        this.setState({ 
          data: data,
          doFilter: false,
         });
      }).catch((err) => {
      })
  }

  resetClick = (e: any) => {
    e.preventDefault();
    const jwt = getJwt();
    axios.get(`/posts?id=${this.props.data.id}&do_filter=no`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
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
            <Link className={styles.topic_link}  to={`/topic?tp=${elem.topic.topic}`}>
            <small style={{ border: '', borderRadius: '7px', padding: '2px', backgroundColor: '#D3D3D3' }}>{elem.topic.topic}</small>
            </Link>
            {'  '}
          </span>
        )
      })}
    </div>
  )

  

  renderEachData = (data: any, vote_type_id: number, currentFirstURL: string) => {

    // plot result data
    let x, y, plotData, layout;
    if(vote_type_id === 1) {
      x = data.vote_selects_count.map((da: any) => {
        return (da.count * 100) / data.total_vote
      });
      y = data.vote_selects_count.map((da: any) => {
        return da.content
      });
      const voteIdList = data.vote_selects_count.map((da: any) => { return da.vote_select_id });
      plotData = [{ type: 'bar', x: x, y: y, orientation: 'h', myVote: this.props.data.my_vote, voteIdList: voteIdList }];
      layout = { title: `${i18n.t("eachPost.totalVote")}: ${data.total_vote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }
    }

    // plot gender data

    switch(currentFirstURL) {
      // post detail page. posts/id 
      case "posts":
        const mobStyle = { paddingBottom: '10px' }
        // const renderCondition = () =>
        // (
        //   <Dialog open={this.state.doFilter}>
        //     <div style={{ margin: '30px' }}>
        //       <button onClick={e => this.filterClick(e, false)}>戻る</button>
        //       <div>以下の条件で絞り込みをした結果を表示します。</div>
        //       <form onSubmit={e => this.submit(e)}>
        //         <div>最小年齢</div>
        //         <div style={mobStyle}><input type="number" onChange={e => this.change(e, "minAge")} value={this.state.minAge} /></div>
        //         <div>最大年齢</div>
        //         <div style={mobStyle}>
        //           <input type="number" onChange={e => this.change(e, "maxAge")} value={this.state.maxAge} /></div>
        //         <div>性別</div>
        //         <div style={mobStyle}>
        //           <select onChange={e => this.change(e, "genderSelect")}>
        //             <option value="">性別</option>
        //             <option value="1">女性</option>
        //             <option value="0">男性</option>
        //             <option value="2">どちらでもない</option>
        //           </select></div>
        //         <div> 職業</div>
        //         <div style={mobStyle}>{this.occupationForm()}</div>
        //         <div style={mobStyle}><button >更新</button></div>
        //       </form>
        //       <button onClick={e => this.resetClick(e)}>リセット</button>
        //     </div>
        //   </Dialog>
        // )

        const genderData = [
          { id: i18n.t("eachPost.male"), value: this.props.data.gender_distribution.male, color: "hsla(220, 64%, 50%, 1)" },
          { id: i18n.t("eachPost.female"), value: this.props.data.gender_distribution.female, color: "hsla(0, 56%, 50%, 1)" },
          { id: i18n.t("eachPost.other"), value: this.props.data.gender_distribution.others, color: "hsla(114, 100%, 23%, 1)" }];

        const ageData = [
          { id: '0-9', value: this.props.data.age_distribution["0_9"] },
          { id: '10-19', value: this.props.data.age_distribution["10_19"] },
          { id: '20-29', value: this.props.data.age_distribution["20_29"] },
          { id: '30-39', value: this.props.data.age_distribution["30_39"] },
          { id: '40-49', value: this.props.data.age_distribution["40_49"] },
          { id: '50-59', value: this.props.data.age_distribution["50_59"] },
          { id: '60-69', value: this.props.data.age_distribution["60_69"] },
          { id: '70-79', value: this.props.data.age_distribution["70_79"] },
          { id: '80-89', value: this.props.data.age_distribution["80_89"] },
          { id: '90-99', value: this.props.data.age_distribution["90_99"] },
          { id: '100-109', value: this.props.data.age_distribution["100_109"] },
          { id: '110-119', value: this.props.data.age_distribution["110_119"] },
        ]

        const baseItem = (
        <div>
          <li className={styles.li}>
            <Link to={`/posts/${this.props.data?.id}`} className={styles.each_post_link}><div className={styles.title}>{this.props.data.title}</div>
              {this.props.data.topics.length > 0 ? this.renderTopic(this.props.data) : <div></div>}

              <div className={styles.content} style={{ marginLeft: '10px' }}>{toHashTag(this.props.data.content)}</div>
            </Link>

            {/* {this.state.doFilter ? renderCondition() : ""} */}

              {data.vote_type.id === 1 ? <div style={{ textAlign: 'center' }}><CompareResult data={data} parentId={data.id}></CompareResult></div> : ''}
              


            <div className={styles.vote_section}>
              {vote_type_id === 1 ? renderVoteSelectResult(plotData, layout) : renderVoteMjResult(this.props.data)}
            </div>

              {plotAttributes(genderData, ageData)}

            <div className={styles.footer}><div>{this.getDiffTime(this.props.data.created_at.slice(0, -7).replace("T", " "))}</div ><div>{this.getEndTime(this.props.data.end_at.slice(0, -3).replace("T", " "))} <CheckIcon style={{ fontSize: 12 }}></CheckIcon> {this.props.data.total_vote} <CommentIcon style={{ fontSize: 12 }}></CommentIcon> {data.comments.length} </div ></div>
          </li>
        </div>
        )

        let itemArray = [];
        itemArray.push(baseItem);
        return (<div>{itemArray.map((item: any) => (item))}</div>)

      // default feed
      default:
        return (
          <li className={styles.li}>
            <Link to={`/posts/${data?.id}`} className={styles.each_post_link}><div className={styles.title}>{this.props.data.title}</div>
              {this.props.data.topics.length > 0 ? this.renderTopic(this.props.data) : <div></div>}
              <div className={styles.content} style={{ marginLeft: '10px' }}>{toHashTag(this.props.data.content)}</div>
            </Link>
            <div className={styles.vote_section}>
              {vote_type_id === 1 ? renderVoteSelectResult(plotData, layout) : renderVoteMjResult(data)}
            </div>

            <div className={styles.footer}><div>{this.getDiffTime(data.created_at.slice(0, -7).replace("T", " "))}</div >
              <div>{this.getEndTime(this.props.data.end_at.slice(0, -3).replace("T", " "))} <CheckIcon style={{ fontSize: 12 }}></CheckIcon> {this.props.data.total_vote} <CommentIcon style={{ fontSize: 12 }}></CommentIcon> {data.comments.length}</div ></div>

          </li>
        )
    }
  }




  render() {
    const currentFirstURL = window.location.pathname.split("/").length > 1 ? window.location.pathname.split("/")[1] : "";

    switch(this.state.voteTypeId) {

      case 1:
        if (this.props.data.already_voted === true || this.props.data.vote_period_end === true) {
          return (
            <div>{this.renderEachData(this.props.data, this.props.data.vote_type.id, currentFirstURL)}</div>
          );
        }

        return (
          <li className={styles.li}>
            
            <Link to={`/posts/${this.props.data?.id}`} className={styles.each_post_link}>
              <div className={styles.title}>{this.props.data.title}</div>
              {this.props.data.topics.length > 0 ? this.renderTopic(this.props.data) : <div></div>}
              <div className={styles.content} style={{ marginLeft: '10px' }}>{toHashTag(this.props.data.content)}</div>
            </Link>
            <div className={styles.vote_section}>
              <EachVoteSelect hasVoted={this.props.data.already_voted} isLogin={this.props.isLogin} voteContent={this.props.data.vote_selects} postId={this.props.data.id} data={this.props.data}></EachVoteSelect>
            </div>
            <div className={styles.footer}>
              <div>{this.getDiffTime(this.props.data.created_at.slice(0, -7).replace("T", " "))}</div >
              <div>{this.getEndTime(this.props.data.end_at.slice(0, -3).replace("T", " "))} <CheckIcon style={{ fontSize: 12 }}></CheckIcon> {this.props.data.total_vote} <CommentIcon style={{ fontSize: 12 }}></CommentIcon> {this.props.data.comments.length}</div >
            </div>
          </li>
        )


      case 2:
        if (this.props.data.already_voted === true || this.props.data.vote_period_end === true) {
          return (
            <div>{this.renderEachData(this.props.data, this.props.data.vote_type.id, currentFirstURL)}</div>
          );
        }

        return (
          <li className={styles.li}>
            <Link to={`/posts/${this.props.data?.id}`} className={styles.each_post_link}><div className={styles.title}>{this.props.data.title}</div>
              {this.props.data.topics.length > 0 ? this.renderTopic(this.props.data) : <div></div>}
              <div className={styles.content} style={{ marginLeft: '10px' }}>{toHashTag(this.props.data.content)}</div>
            </Link>
            <div className={styles.vote_section}>
              <EachVoteMj hasVoted={this.props.data.already_voted} isLogin={this.props.isLogin} voteContent={this.props.data.vote_mjs} mjOptions={this.props.data.mj_options} postId={this.props.data.id}></EachVoteMj>
            </div>
            <div className={styles.footer}><div>{this.getDiffTime(this.props.data.created_at.slice(0, -7).replace("T", " "))}</div >
              <div>{this.getEndTime(this.props.data.end_at.slice(0, -3).replace("T", " "))} <CheckIcon style={{ fontSize: 12 }}></CheckIcon> {this.props.data.total_vote} <CommentIcon style={{ fontSize: 12 }}></CommentIcon> {this.props.data.comments.length}</div >
            </div>
          </li>
        )


      case 3:
        return (
          <li className={styles.li}>
            <Link to={`/posts/${this.props.data?.id}`} className={styles.each_post_link}><div className={styles.title}>{this.props.data.title}</div>
              {this.props.data.topics.length > 0 ? this.renderTopic(this.props.data) : <div></div>}
              <div className={styles.content} style={{ marginLeft: '10px' }}>{toHashTag(this.props.data.content)}</div>
            </Link>
            <div className={styles.vote_section}>
              <EachMultipleVote hasVoted={this.props.data.already_voted} alreadyEnd={this.props.data.vote_period_end}　postId={this.props.data.id} isLogin={this.props.isLogin}></EachMultipleVote>
            </div>
            <div className={styles.footer}><div>{this.getDiffTime(this.props.data.created_at.slice(0, -7).replace("T", " "))}</div >
              <div>{this.getEndTime(this.props.data.end_at.slice(0, -3).replace("T", " "))} <CheckIcon style={{ fontSize: 12 }}></CheckIcon> {this.props.data.total_vote} <CommentIcon style={{ fontSize: 12 }}></CommentIcon> {this.props.data.comments.length}</div >
            </div>
          </li>
        )
    }
  }
}

export default NewEachPost;