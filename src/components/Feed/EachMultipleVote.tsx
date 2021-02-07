import React, { useEffect, useState, useRef } from 'react';
import { Button, Dialog } from '@material-ui/core';
import { useHistory } from "react-router";
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
import { renderVoteSelectResult } from '../../helpers/renderVoteSelectResult';
import { AnyNsRecord } from 'dns';

const moment = require('moment-timezone');
// moment.locale('ja');
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
    
    axios.get(`/posts?parent_id=${props.postId}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
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

      axios.post("/multiple_vote_users", { parent_id: props.postId, result: [...voteResult, { vote_select_id, post_id }] }, { headers: { 'Authorization': 'Bearer ' + jwt } })
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
    <div style={{ width: "100%" }} className={styles.content}>
          <div style={{ margin: 50 }}>
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

    const resultJSX = data.map((each: any) => {
      let x, y, plotData, layout;
      x = each.vote_selects_count.map((da: any) => {
        return (da.count * 100) / each.total_vote
      });
      y = each.vote_selects_count.map((da: any) => {
        return da.content
      });
      const voteIdList = each.vote_selects_count.map((da: any) => { return da.vote_select_id });
      plotData = [{ type: 'bar', x: x, y: y, orientation: 'h', myVote: each.my_vote, voteIdList: voteIdList }];
      layout = { title: `合計票数: ${each.total_vote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }
      return (
        <div>
          <div>{each.title}</div>
          <div>{each.content}</div>
          <div className={styles.vote_section} > {renderVoteSelectResult(plotData, layout)}</div>
        </div>

      )
    })

    return resultJSX;
  }


  const currentFirstURL = window.location.pathname.split("/").length > 1 ? window.location.pathname.split("/")[1] : "";

  if (props.hasVoted) { 
    switch (currentFirstURL) {
      case "posts":
        return (<div>{voteSelectResult()}</div>);
      default:
        return (<div><Link to={`/posts/${props.postId}`}>結果を見る</Link></div>)
    }
  }

  if (!doesVoteStart) { return (<div onClick={e => startClick(e)}>投票を開始</div>)}

  if (isLoading) { return (<div>...</div>) }

  if (doesVoteEnd) { history.push(`/posts/${props.postId}`); }

  return (<div><Dialog open={true}>{voteSelectInput()}</Dialog></div>);
};


export default EachMultipleVote;