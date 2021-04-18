import React, { useEffect, useState, useRef, useContext } from 'react';
import { Button } from '@material-ui/core';
import axios from '../../Api';
// import 'bootstrap/dist/css/bootstrap.css';
// import CanvasJSReact from '../canvasjs.react';
import { useHistory } from "react-router";

import ProgressBar from 'react-bootstrap/ProgressBar'
// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../../css/Feed.module.css';
import { getJwt } from '../../../helpers/jwt';
import { RouteComponentProps, Link, Redirect, withRouter } from 'react-router-dom'
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import CommentIcon from '@material-ui/icons/Comment';
import { renderVoteSelectResult } from '../../../helpers/renderVoteSelectResult';
import i18n from '../../../helpers/i18n';
import { Mixpanel } from '../../../helpers/mixpanel';
import CountryContext from '../../../contexts';

const moment = require('moment-timezone');
// moment.locale('ja');
moment.tz.setDefault('Etc/UTC');


const VoteSelect = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(props.data);
  const [periodEnd, setPeriodEnd] = useState(props.periodEnd);
  const [hasVoted, setHasVoted] = useState(props.hasVoted);
  const history = useHistory();
  const context = useContext(CountryContext);

  useEffect(() => {
    // setHasVoted(props.data.vote_period_end);
    // setPeriodEnd(props.data.already_voted);
  }, [data, isLoading, periodEnd, hasVoted])

  const callApi = (voteSelectPostObj: any, config: any) => {
    // if a user accesed from different countries, stop voting.
    // if (context.country !== process.env.REACT_APP_COUNTRY) return;
    axios.post("/vote_select_users", voteSelectPostObj, config)
      .then(res => {
        Mixpanel.track('Successful Vote', { ...voteSelectPostObj });
        axios.get(`/posts?id=${data.id}`, config)
          .then((res) => {
            setData(res.data);
            setIsLoading(false);
            setHasVoted(true);
          })
      }).catch((err) => {
        Mixpanel.track('Unsuccessful Vote', { ...voteSelectPostObj });
      })
  };


  const onVote = (e:any, id: number) => {
    setIsLoading(true);
    const jwt = getJwt();
    if (!jwt) { history.push("/login") }
    const voteSelectPostObj = { vote_select_id: id, post_id: props.postId };
    const config = { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } };

    callApi(voteSelectPostObj, config);
  };

  // Loading
  if (isLoading) return (<div></div>);

  // Vote Result
  if (periodEnd || hasVoted) {
    const postDetailObj = props.postDetailType === "target" ? props.data.target_post_detail : props.data.current_post_detail;
    const x = postDetailObj.vote_selects.map((da: any) => { return (da.count * 100) / postDetailObj.num_vote });
    const y = postDetailObj.vote_selects.map((da: any) => { return da.content });
    const voteIdList = postDetailObj.vote_selects.map((da: any) => { return da.id });
    let plotData = [{ type: 'bar', x: x, y: y, orientation: 'h', myVote: props.data.my_vote, voteIdList: voteIdList }];
    let layout = { title: `${i18n.t("eachPost.totalVote")}: ${postDetailObj.num_vote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }
    return (<div className={styles.vote_section} > { renderVoteSelectResult(plotData, layout)}</div>)
  }
  
  // Vote Input 
  return (
    <div style={{ width: "100%" }} className={styles.content}>
      {props.voteContent.map((data: any) => {
        return (
          <div style={{ whiteSpace: 'nowrap', border: 'solid 1px', borderRadius: '5px', margin: '5px', padding: '5px' }} className={styles.vote_button}>
            <div onClick={e => onVote(e, data.id)}>{data.content}</div>
          </div>
        )
      })}
    </div>
  )
}










// export interface EachVoteSelectProps extends RouteComponentProps<{}> {
//   voteContent: any;
//   postId: number;
//   isLogin: boolean;
//   hasVoted: boolean;
//   data: any;
//   postDetailType: string;
//   periodEnd: boolean;
// }

// export interface EachVoteSelectState {
//   isLoaded: boolean;
//   voteSelectsCount: any;
//   totalVote: number;
// }

// class EachVoteSelect extends React.Component<EachVoteSelectProps, EachVoteSelectState> {

//   constructor(props: any) {
//     super(props);

//     this.state = {
//       isLoaded: true,
//       voteSelectsCount: {},
//       totalVote: 0,
//     }
//   }

//   change(e: any, id: number, context: any) {
//     const post_id = this.props.postId;
//     if (this.props.isLogin === false) {
//       this.props.history.push("/login" + "?destination=" + "posts" + "&value=" + post_id)  //ログイン後、投稿詳細ページに飛ぶ
//       return;
//     }
//     // if a user accesed from different countries, stop voting.
//     // if (context.country !== process.env.REACT_APP_COUNTRY) {
//     //   return;
//     // }
//     this.setState({isLoaded: false});
//     const jwt = getJwt();
//     // if (!jwt) {
//     //   this.props.history.push("/login");
//     // }
//     const voteSelectPostObj = { vote_select_id: id, post_id: this.props.postId };
//     const config = { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } };


//   }

//   render() {
//     // Loading
//     if(!this.state.isLoaded) return (<div></div>);

//     // Voted
//     if (this.props.hasVoted === true) {
//       const postDetailObj = this.props.postDetailType === "target" ? this.props.data.target_post_detail : this.props.data.current_post_detail;
//       const x = postDetailObj.vote_selects.map((da: any) => { return (da.count * 100) / postDetailObj.num_vote});
//       const y = postDetailObj.vote_selects.map((da: any) => {return da.content});
//       const voteIdList = postDetailObj.vote_selects.map((da: any) => {return da.id});
//       let plotData = [{ type: 'bar', x: x, y: y, orientation: 'h', myVote: this.props.data.my_vote, voteIdList: voteIdList }];
//       let layout = { title: `${i18n.t("eachPost.totalVote")}: ${this.state.totalVote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }

//       return (<div className={styles.vote_section} > { renderVoteSelectResult(plotData, layout)}</div>)

//     } 


//     return (
//       <CountryContext.Consumer>
//         {context => (
//           <div style={{ width: "100%" }} className={styles.content}>
//             {this.props.voteContent.map((data: any) => {
//               return (
//                 <div style={{ whiteSpace: 'nowrap', border: 'solid 1px', borderRadius: '5px', margin: '5px', padding: '5px' }} className={styles.vote_button}>
//                   <div onClick={e => this.change(e, data.id, context)}>{data.content}</div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </CountryContext.Consumer>
//     );
//   }
// }


// export default withRouter(EachVoteSelect);
export default VoteSelect;

