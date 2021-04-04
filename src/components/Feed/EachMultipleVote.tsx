import React, { useEffect, useState, useContext } from 'react';
import { Button, Dialog, useMediaQuery, useTheme } from '@material-ui/core';
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
import AttributePlotPie from './AttributePlotPie';
import AttributePlotBar from './AttributePlotBar';
import { Mixpanel } from '../../helpers/mixpanel';
import CountryContext from '../../helpers/context';

// import FileCopyIcon from '@material-ui/icons/FileCopy';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

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
  const context = useContext(CountryContext);
  
  const fullScreen = useMediaQuery('(max-width:700px)');

  useEffect(() => {

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
    const post_id = props.postId;

    if (props.isLogin === false) {
      history.push("/login" + "?destination=" + "posts" + "&value=" + post_id)  //ログイン後、投稿詳細ページに飛ぶ     
      return;
    }

    // if a user accesed from different countries, stop voting.

    // if (context.country !== process.env.REACT_APP_COUNTRY) {
    //   return;
    // }

    setDoesVoteStart(true);
  }

  const addResult = (e: any, vote_select_id: number, post_id: number) => {
    // e.preventDefault();
    if (data.length - 1 === dataIdx) {
      const voteObj = { parent_id: props.postId, result: [...voteResult, { vote_select_id, post_id }] }

      axios.post("/multiple_vote_users", voteObj, { headers: { 'Authorization': 'Bearer ' + jwt, Country: process.env.REACT_APP_COUNTRY } })
        .then(res => {
          Mixpanel.track('Successful Multiple Vote', { ...voteObj });
          setDoesVoteEnd(true);
          history.push(`/posts/${props.postId}`);
        })
        .catch(err => {
          Mixpanel.track('Unsuccessful Multiple Vote', { ...voteObj });
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
        <div style={{ padding: 10, }}>
          <h2>{i18n.t("newPost.continuasVote")} {dataIdx + 1}</h2>
          <div>{currentData.title}</div>
          <div>{currentData.content}</div>
          {currentData.vote_selects.map((each: any) => {
            return (
              <div >
                <div style={{ border: 'solid 1px', borderRadius: '4px', margin: '5px', padding: '5px', }} className={styles.vote_button}
                onClick={e => addResult(e, each.id, currentData.id)}>{each.content}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const voteSelectResult = () => {

    let ageDist: any; let genderDist: any; let totalVote: any;
    const resultJSX = data.map((each: any) => {
      let x, y, plotData, layout;
      ageDist = each.age_distribution;
      genderDist = each.gender_distribution;
      totalVote = each.total_vote;
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


    return (
      <div>
        {resultJSX}
        <AttributePlotPie ageDist={ageDist} genderDist={genderDist} />
        {/* <AttributePlotBar
      ageDist={ageDist}
      genderDist={genderDist}
      total_vote={totalVote}
        /> */}
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
            <h2><InsertDriveFileIcon style={{ marginBottom: -5, padding: 0 }}></InsertDriveFileIcon> <ClearIcon style={{ marginBottom: -5, padding: 0 }}></ClearIcon> {data.length}</h2>
            <Link to={`/posts/${props.postId}`} style={{ textDecoration: 'none' }}><Button style={{ border: 'solid', fontSize: 16, backgroundColor: '#ff5525', color: 'white', borderWidth: 1, borderRadius: 100, padding: 9, fontWeight: 'bold' }}>{i18n.t("eachPost.seeResult")}</Button></Link>
          </div>
        )
    }
  }



  if (!doesVoteStart) {
    return (
      <div>
        <h2><InsertDriveFileIcon style={{ marginBottom: -5, padding: 0 }}></InsertDriveFileIcon><ClearIcon style={{ marginBottom: -5, padding: 0 }}></ClearIcon> {data.length}</h2>
        <Button style={{ border: 'solid', fontSize: 16, backgroundColor: '#3477cc', color: 'white', borderWidth: 1, borderRadius: 100, padding: 9 }} onClick={e => startClick(e)}><b>{i18n.t("eachPost.startContinuasVote")}</b></Button>
      </div>
    )
  }

  if (doesVoteEnd) { history.push(`/posts/${props.postId}`); }

  return (<div><Dialog open={true} fullScreen={fullScreen}>{voteSelectInput()}</Dialog></div>);
};


export default EachMultipleVote;