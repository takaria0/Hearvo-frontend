import React, { useEffect, useState, useRef } from 'react';
import { Button, Dialog } from '@material-ui/core';
import { useHistory } from "react-router";
import axios from '../Api';
// import { ResponsivePie } from '@nivo/pie'
// import { ResponsiveBar } from '@nivo/bar'
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
import NoteIcon from '@material-ui/icons/Note';
import ClearIcon from '@material-ui/icons/Clear';
import { MyResponsivePie, MyResponsiveBar } from '../../helpers/NivoPlots';
import CompareResult from './CompareResult';
import i18n from "../../helpers/i18n";

const moment = require('moment-timezone');
moment.tz.setDefault('Etc/UTC');






const EachMultipleVote = (props: any) => {

  const jwt = getJwt();
  const history = useHistory();
  const [data, setData] = useState<any>([]);
  const [doesVoteStart, setDoesVoteStart] = useState<boolean>(false);
  const [doesVoteEnd, setDoesVoteEnd] = useState<boolean>(false);
  const [voteResult, setVoteResult] = useState<any>([]);
  const [dataIdx, setDataIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(()=> {
    
    axios.get(`/posts?parent_id=${props.postId}`, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
    .then(res => {
      setData(res.data);
      setIsLoading(false);
    })
    .catch(err => {
      setIsLoading(false);
    })

  }, []);

  const startClick = (e: any) => {
    e.preventDefault();

    if (props.isLogin === false) {
      history.push("/login");
      return
    }

    setDoesVoteStart(true);
  }

  const addResult = (e: any, vote_select_id: number, post_id: number) => {
    // e.preventDefault();
    if (data.length - 1 === dataIdx) {

      axios.post("/multiple_vote_users", { parent_id: props.postId, result: [...voteResult, { vote_select_id, post_id }] }, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
      .then(res => {

        setDoesVoteEnd(true);
        history.push(`/posts/${props.postId}`);
      })
      .catch(err => {

        setDoesVoteEnd(true);
        history.push(`/posts/${props.postId}`);
      });
      return
    }
    setVoteResult([...voteResult, { vote_select_id, post_id }]);
    setDataIdx(dataIdx + 1);
  }

  const voteSelectInput = () => {
    const currentData = data[dataIdx];
    return (
      <div className={styles.content}>
          <div style={{ padding: 50, }}>
          <h2>{i18n.t("newPost.continuasVote")} {dataIdx+1}</h2>
          <div>{currentData.title}</div>
          <div>{currentData.content}</div>
            {currentData.vote_selects.map((each: any) => { return (
              <div style={{ border: 'solid 1px', borderRadius: '5px', margin: '5px', padding: '5px' }} className={styles.vote_button}>
                <div onClick={e => addResult(e, each.id, currentData.id)}>{each.content}</div>
            </div>
            ) })}
          </div>
    </div>
    )
  }

  const voteSelectResult = () => {

    let ageDist: any; let genderDist: any;
    const resultJSX = data.map((each: any) => {
      let x, y, plotData, layout;
      ageDist = each.age_distribution;
      genderDist = each.gender_distribution;
      x = each.vote_selects_count.map((da: any) => {
        return (da.count * 100) / each.total_vote
      });
      y = each.vote_selects_count.map((da: any) => {
        return da.content
      });
      const voteIdList = each.vote_selects_count.map((da: any) => { return da.vote_select_id });
      plotData = [{ type: 'bar', x: x, y: y, orientation: 'h', myVote: each.my_vote, voteIdList: voteIdList }];
      layout = { title: `${i18n.t("eachPost.totalVote")}: ${each.total_vote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }
      return (
        <div>
          <h4>{each.title}</h4>
          <div>{each.content}</div>
          <div className={styles.vote_section} > {renderVoteSelectResult(plotData, layout)}</div>
        </div>

      )
    })

    const genderData = [
      { id: i18n.t("eachPost.male"), value: genderDist.male, color: "hsla(220, 64%, 50%, 1)" },
      { id: i18n.t("eachPost.female"), value: genderDist.female, color: "hsla(0, 56%, 50%, 1)" },
      { id: i18n.t("eachPost.other"), value: genderDist.other, color: "hsla(114, 100%, 23%, 1)" }];

    const ageData = [
      { id: '0-9', value: ageDist["0_9"]  },
      { id: '10-19', value: ageDist["10_19"]},
      { id: '20-29', value: ageDist["20_29"] },
      { id: '30-39', value: ageDist["30_39"] },
      { id: '40-49', value: ageDist["40_49"] },
      { id: '50-59', value: ageDist["50_59"] },
      { id: '60-69', value: ageDist["60_69"] },
      { id: '70-79', value: ageDist["70_79"] },
      { id: '80-89', value: ageDist["80_89"] },
      { id: '90-99', value: ageDist["90_99"] },
      { id: '100-109', value: ageDist["100_109"] },
      { id: '110-119', value: ageDist["110_119"] },
    ]

    return (
    <div>
      {resultJSX}
      <div>
          <h4>{i18n.t("eachPost.votersAttributes")}</h4>
          <h5 style={{ textAlign: 'center' }}>{i18n.t("eachPost.gender")}</h5>
          <div style={{height: 300}}> 
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
          <div style={{ height: 300 }}> 
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
    </div>
      );
  }

  if (isLoading) { return (<div>...</div>) }

  const currentFirstURL = window.location.pathname.split("/").length > 1 ? window.location.pathname.split("/")[1] : "";

  if (props.hasVoted || props.alreadyEnd) { 
    switch (currentFirstURL) {
      case "posts":
        return (
        <div>
            <div><CompareResult data={data} parentId={props.postId}></CompareResult></div>
            <div>{voteSelectResult()}</div>
        </div>);
      default:
        return (
        <div>
            <h2><NoteIcon style={{ marginBottom: -5, padding: 0 }}></NoteIcon> <ClearIcon style={{ marginBottom: -5, padding: 0 }}></ClearIcon> {data.length}</h2>
          <Link to={`/posts/${props.postId}`}><button style={{ border: 'solid', borderWidth: 1, borderRadius: 5, padding: 10 }}>{i18n.t("eachPost.seeResult")}</button></Link>
          </div>
          )
    }
  }

  

  if (!doesVoteStart) { return (
    <div>
      <h2><NoteIcon style={{ marginBottom: -5,  padding: 0 }}></NoteIcon> <ClearIcon style={{ marginBottom: -5, padding: 0 }}></ClearIcon> {data.length}</h2>
      <button style={{ border: 'solid', backgroundColor: '#60D4FF', color: 'white', borderWidth: 1, borderRadius: 5, padding: 10 }} onClick={e => startClick(e)}><b>{i18n.t("eachPost.startContinuasVote")}</b></button>
  </div>
  ) }

  if (doesVoteEnd) { history.push(`/posts/${props.postId}`); }

  return (<div><Dialog open={true}>{voteSelectInput()}</Dialog></div>);
};


export default EachMultipleVote;