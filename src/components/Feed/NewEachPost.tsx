import React, { useEffect, useState, useRef } from 'react';
import { Dialog, Divider } from '@material-ui/core';
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
import StarIcon from '@material-ui/icons/Star';
import ShareIcon from '@material-ui/icons/Share';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PollIcon from '@material-ui/icons/Poll';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import AttributePlotPie from './AttributePlotPie';
import AttributePlotBar from './AttributePlotBar';
import RenderTopic from './RenderTopic';

const moment = require('moment-timezone');
moment.locale('ja');
moment.tz.setDefault('UTC');


const PostHeader = (props: any) => {

  const createdAtJSX = (
    <span style={{fontSize: 16, float: 'right', textAlign: 'right'}}>
      {getDiffTime(props.data.created_at.slice(0, -7).replace("T", " "))}&nbsp;
    </span >
  )

  switch(props.link) {
    case "posts":
      return (
          <div>
            <div style={{marginTop: 10, marginBottom: 10, marginRight: 10}}>
              <span className={styles.title}>{props.data.title}</span>
              <span>{createdAtJSX}</span>
            </div>

          <div style={{marginBottom: 10}}>
            <RenderTopic topics={props.data.topics} />
          </div>
          
              {/* {props.data.topics.length > 0 ? renderTopic(props.data): <div></div>} */}
              <div className={styles.content} style={{ marginLeft: '10px' }}>{toHashTag(props.data.content)}</div>
          </div>
      )
      break;

    default:
      const content = props.data.content.length > 200 ? props.data.content.slice(0, 200) + "..." : props.data.content;
      return (
        <div>
          <div style={{ marginTop: 10, marginBottom: 10, marginRight: 10 }}>
            <span className={styles.title}>
              <Link to={`/posts/${props.data?.id}`} className={styles.each_post_link}>{props.data.title}</Link></span>
            <span>{createdAtJSX}</span>
          </div>

          <div style={{ marginBottom: 10 }}>
            <RenderTopic topics={props.data.topics} />
          </div>
            {/* {props.data.topics.length > 0 ? renderTopic(props.data) : <div></div>} */}
          <div className={styles.content} style={{ marginLeft: '10px' }}>{toHashTag(content)}</div>
          
        </div>
      )
      break;
  }
}

const PostFooter = (props: any) => {
  return (
    <div>
      <div>
        {/* <div className={styles.footer}> */}
        <div style={{ marginLeft: 15, fontSize: 12, color: '#404040', marginBottom: 10}}>
          {getEndTime(props.data.end_at.slice(0, -3).replace("T", " "))}
        </div>
        {/* </div> */}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', marginBottom: 10 }}>
        {/* <span>
          <StarIcon style={{ fontSize: 20 }}/>
        </span > */}
        <span>
          <EqualizerIcon style={{ fontSize: 20 }} />
          {props.data.total_vote}
        </span>
        <span>
          <ChatBubbleIcon style={{ fontSize: 20 }} />&nbsp;{props.data.comments.length}
        </span >
        <span>
          <ShareIcon style={{ fontSize: 20 }}/>
        </span >
        <span>
          <MoreHorizIcon style={{ fontSize: 20 }}/>
        </span >
      </div>
    </div>

  )
};

const getDiffTime = (datetime: string) => {
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

  if (years > 0) {
    return `${years}${i18n.t("eachPost.yearBefore")}`
  } else if (months > 0) {
    return `${months}${i18n.t("eachPost.monthBefore")}`
  } else if (weeks > 0) {
    return `${weeks}${i18n.t("eachPost.weekBefore")}`
  } else if (days > 0) {
    return `${days}${i18n.t("eachPost.dayBefore")}`
  } else if (hours > 0) {
    return `${hours}${i18n.t("eachPost.hourBefore")}`
  } else if (minutes > 0) {
    return `${minutes}${i18n.t("eachPost.minuteBefore")}`
  } else {
    return `${seconds}${i18n.t("eachPost.secondBefore")}`
  }
  // return moment(datetime).fromNow()
}

const getEndTime = (datetime: string) => {
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
  if (signCheck < 0) {
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


  change(e: any, field: string) {
    this.setState({
      [field]: e.target.value,
    } as unknown as NewEachPostState)
  }



  // submit = (e: any) => {
  //   e.preventDefault();
  //   const jwt = getJwt();
  //   axios.get(`/posts?id=${this.props.data.id}&do_filter=yes&gender=${this.state.genderSelect}&min_age=${this.state.minAge}&max_age=${this.state.maxAge}&occupation=${this.state.occupation}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
  //     .then((res: any) => {
  //       const data = res.data;
  //       this.setState({ 
  //         data: data,
  //         doFilter: false,
  //        });
  //     }).catch((err) => {
  //     })
  // }

  // resetClick = (e: any) => {
  //   e.preventDefault();
  //   const jwt = getJwt();
  //   axios.get(`/posts?id=${this.props.data.id}&do_filter=no`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
  //     .then((res: any) => {
  //       const data = res.data;
  //       this.setState({ data });
        
  //     }).catch((err) => {
  //     })
  // }

  // filterClick = (e: any, val: boolean) => {
    // this.setState({doFilter: val});
  // }

  

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

        const baseItem = (
        <div>
          <li className={styles.li}>
              <PostHeader link={currentFirstURL} data={this.props.data}></PostHeader>
              {data.vote_type.id === 1 ? <div style={{ textAlign: 'center' }}><CompareResult data={data} parentId={data.id}></CompareResult></div> : ''}

            <div className={styles.vote_section}>
              {vote_type_id === 1 ? renderVoteSelectResult(plotData, layout) : renderVoteMjResult(this.props.data)}
            </div>
              <AttributePlotPie ageDist={this.props.data.age_distribution} genderDist={this.props.data.gender_distribution} />
              {/* <AttributePlotBar
              ageDist={this.props.data.age_distribution}
              genderDist={this.props.data.gender_distribution}
              total_vote={this.props.data.total_vote}
               /> */}
              <PostFooter data={this.props.data}></PostFooter>
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
            <PostHeader link={currentFirstURL} data={this.props.data}></PostHeader>
            <div className={styles.vote_section}>
              {vote_type_id === 1 ? renderVoteSelectResult(plotData, layout) : renderVoteMjResult(data)}
            </div>
            <PostFooter data={this.props.data}></PostFooter>

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
            <PostHeader link={currentFirstURL} data={this.props.data}></PostHeader>
            <div className={styles.vote_section}>
              <EachVoteSelect hasVoted={this.props.data.already_voted} isLogin={this.props.isLogin} voteContent={this.props.data.vote_selects} postId={this.props.data.id} data={this.props.data}></EachVoteSelect>
            </div>
            <PostFooter data={this.props.data}></PostFooter>
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
            <PostHeader link={currentFirstURL} data={this.props.data}></PostHeader>
            <div className={styles.vote_section}>
              <EachVoteMj hasVoted={this.props.data.already_voted} isLogin={this.props.isLogin} voteContent={this.props.data.vote_mjs} mjOptions={this.props.data.mj_options} postId={this.props.data.id}></EachVoteMj>
            </div>
            <div className={styles.footer}><div>{getDiffTime(this.props.data.created_at.slice(0, -7).replace("T", " "))}</div >
              <PostFooter data={this.props.data}></PostFooter>
            </div>
          </li>
        )


      case 3:
        if (currentFirstURL === 'posts') {
          return (
            <li className={styles.li}>
              <PostHeader link={currentFirstURL} data={this.props.data}></PostHeader>
              <div className={styles.vote_section}>
                <EachMultipleVote hasVoted={this.props.data.already_voted} alreadyEnd={this.props.data.vote_period_end} postId={this.props.data.id} isLogin={this.props.isLogin}></EachMultipleVote>
              </div>
              <div className={styles.footer}><div>{getDiffTime(this.props.data.created_at.slice(0, -7).replace("T", " "))}</div >
                <PostFooter data={this.props.data}></PostFooter>
              </div>
            </li>
          )
        }
        return (
          <li className={styles.li}>
            <PostHeader link={currentFirstURL} data={this.props.data}></PostHeader>
            <div className={styles.vote_section}>
              <EachMultipleVote hasVoted={this.props.data.already_voted} alreadyEnd={this.props.data.vote_period_end}　postId={this.props.data.id} isLogin={this.props.isLogin}></EachMultipleVote>
            </div>
            <PostFooter data={this.props.data}></PostFooter>
          </li>
        )
    }
  }
}

export default NewEachPost;