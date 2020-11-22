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

export interface EachVoteMjProps {
  voteContent: any;
  mjOptions: any;
  postId: number;
}
 
export interface EachVoteMjState {
  isClicked: boolean;
  isLoaded: boolean;
  voteMjCount: any;
  mjCountResult: any;
  mjContent: any;
  totalVote: number;
  resData: any,
}
 
class EachVoteMj extends React.Component<EachVoteMjProps, EachVoteMjState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isClicked: false,
      isLoaded: false,
      voteMjCount: [],
      mjCountResult: [],
      mjContent: [],
      resData: [],
      totalVote: 0,
    }
  }

  submit = (e: any) => {
    e.preventDefault();
    this.setState({
      isClicked: true,
    });
    const jwt = getJwt();
    // if (!jwt) {
    //   this.props.history.push("/login");
    // }
    const voteMjPostObj = {
      vote_mj_obj: this.state.voteMjCount,
      post_id: this.props.postId,
    };
    const config = {
      headers: { Authorization: `Bearer ${jwt}` }
    };
    axios.post(
      "/vote_mj_users",
      voteMjPostObj,
      config,
    ).then(res => {
      console.log("res", res);
      const countVotePostObj = { post_id: this.props.postId }
      axios.post(
        "/count_vote_mjs",
        countVotePostObj,
        config,
      ).then((res) => {

        this.setState({
          resData: res.data,
          mjCountResult: res.data.vote_mj_count,
          mjContent: res.data.vote_mj_obj,
          totalVote: res.data.total_vote,
        });

        this.setState({
          isLoaded: true,
        });
      })

    }).catch((err) => {
      // // console.log(err);
    })
  };

  change(e: any, voteMjId: number) {
    console.log("this.state.voteMjCount", this.state.voteMjCount);
    console.log("voteMjId", voteMjId);
    console.log("e.target.value", e.target.value);
    const filteredArray = this.state.voteMjCount.filter((el: any) => { return el.vote_mj_id != voteMjId; });
    filteredArray.push({
      vote_mj_id: voteMjId,
      mj_option_id: parseInt(e.target.value),
    });

    this.setState({
      voteMjCount: filteredArray,
    })
  }

  render() { 

    if ((this.state.isClicked === true && this.state.isLoaded === false)) {
      return (<div>Loading ...</div>)
    } 
    if (this.state.isClicked === true && this.state.isLoaded === true) {
      return (
        <li className={styles.li}>
          <div>
              < div >
              {this.state.resData.vote_mj_obj.map((data: any, idx: number) => {
                const countData = this.state.resData.vote_mj_count[idx];
                const content = data.content;
                const vote_mj_id = countData.vote_mj_id;
                const countObj = countData.count;
                return (
                  <div>
                    <div>{content}:</div>
                    <table style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse" }}>
                      <tr>{this.state.resData.mj_options.map((obj: any) => {
                        const mj_option_id = obj.id;
                        const mj_option_count = countObj.filter((el: any) => { return el.mj_option_id === mj_option_id })
                        return (
                          <th style={{ border: "1px solid black", borderCollapse: "collapse" }}>{obj.content}</th>
                        )
                      })}</tr>
                      <tr>{this.state.resData.mj_options.map((obj: any) => {
                        const mj_option_id = obj.id;
                        const mj_option_count = countObj.filter((el: any) => { return el.mj_option_id === mj_option_id })
                        return (
                          <td style={{ border: "1px solid black", borderCollapse: "collapse" }}>{mj_option_count.length > 0 ? mj_option_count[0].count : 0}</td>
                        )
                      })}</tr>
                    </table>
                  </div>
                )
              })}
              {/* {this.state.resData.vote_mj_obj.map((data: any, idx: number) => {
                const countData = this.state.resData.vote_mj_count[idx];
                const content = data.content;
                const vote_mj_id = countData.vote_mj_id;
                const countObj = countData.count;
                return (
                  <div>
                    <div>{content}:</div>
                    {this.state.resData.mj_options.map((obj: any) => {
                      const mj_option_id = obj.id;
                      const mj_option_count = countObj.filter((el: any) => { return el.mj_option_id === mj_option_id })
                      return (
                        <b>
                          {obj.content}, 投票数:{mj_option_count.length > 0 ? mj_option_count[0].count : 0}
                        </b>
                      )
                    })}
                  </div>
                )
              })} */}


            </div>
          </div>
        </li>
      )
    }

    if (this.state.isClicked === false && this.state.isLoaded === false) {
  
      return ( 
      <div>
          <div className={styles.content}>
            <form onSubmit={e => this.submit(e)}>
            {this.props.voteContent.map((data: any) => {
              const voteMjId = data.id;
              return (
                <div>
                  { data.content}: 
                  {/* <button onClick={e => this.change(e, data.id)}>Vote</button>
                  */}
                  
                  <div onChange={e => this.change(e, voteMjId)}>
                  {this.props.mjOptions.map((option: any) => {
                    const mjOptionId = option.id;
                    return (
                    <b>
                      {/* <input type="radio" name={mjOptionId}><label>{option.content}</label></input> */}
                        {/* <input type="radio" id="male" name="gender" value="male">
                          <label htmlFor="male">Male</label>
                        </input> */}
                        <input type="radio" name={voteMjId} value={mjOptionId}></input><label htmlFor={mjOptionId}>{option.content}</label>
                      </b>
                    )
                  })}
                  </div>
                  
                </div>
              )
            })}
            <button type="submit" >提出</button>
            </form>
          </div>
      </div> 
      );
    }
  }
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
      return (<div>Loading ...</div>)
    } 
    
    if (this.state.isClicked === true && this.state.isLoaded === true) {

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





export interface NewEachPostProps {
  data: any;
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

  

  renderEachData = (data: any) => {
    let currentFirstURL = "";
    try {
      currentFirstURL = window.location.pathname.split("/")[1]
    } catch {
      currentFirstURL = "";
    }
    const x = data.vote_selects_count.map((da: any) => {
      return (da.count * 100) / data.total_vote
    }).reverse();
    const y = data.vote_selects_count.map((da: any) => {
      return da.content
    }).reverse();
    let plotData = [{ type: 'bar', x: x, y: y, orientation: 'h' }];
    let layout = { title: `合計票数: ${data.total_vote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true }, annotations: [], autosize: true }


    if(currentFirstURL !== "posts") {
      return (
        <li className={styles.li}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.content}>{data.content}</div>
          <div className={styles.vote_section}>{renderVoteResult(plotData, layout)}</div>
          <div className={styles.footer}><div>{data.created_at.slice(0, -7).replace("T", " ")}</div >
            <div>終了時間: {this.state.data.end_at.slice(0, -3).replace("T", " ")}, コメント数: {data.comments.length}, 投票数: {this.props.data.total_vote}, by: {this.props.data.user_info.name}</div ></div>

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
          <div className={styles.title}>{data.title}</div>
          <div className={styles.content}>{data.content}</div>
          {this.state.doFilter ? "" : <button onClick={e => this.filterClick(e, true)}>絞り込み</button>}
          {this.state.doFilter ? renderCondition() : ""}
          
          <div className={styles.vote_section}>{renderVoteResult(plotData, layout)}</div>
          <div className={styles.footer}><div>{data.created_at.slice(0, -7).replace("T", " ")}</div >
            <div>終了時間: {this.state.data.end_at.slice(0, -3).replace("T", " ")}, コメント数: {data.comments.length}, 投票数: {this.state.data.total_vote}, by: {this.state.data.user_info.name}</div ></div>
        </li>
      )
    }
  }

  render() {
    if (this.state.data.already_voted === true || this.state.data.vote_period_end === true) {
      return (
        
        <div>
          {this.state.voteTypeId === 1 ?
            this.renderEachData(this.state.data)
            :
            <li className={styles.li}>
              <div>
                <div className={styles.title}>{this.state.data.title}</div>
                <div className={styles.content}>{this.state.data.title}</div>
              < div className={styles.vote_section}>
                {this.state.data.vote_mjs.map((data: any, idx: number) => {
                  const countData = this.state.data.vote_mj_count[idx];
                  const content = data.content;
                  const vote_mj_id = countData.vote_mj_id;
                  const countObj = countData.count;
                  return (
                    <div>
                      <div>{content}:</div>
                      <table style={{ margin: "auto", border: "1px solid black", borderCollapse: "collapse" }}>
                      <tr>{this.state.data.mj_options.map((obj: any) => {
                        const mj_option_id = obj.id;
                        const mj_option_count = countObj.filter((el: any) => { return el.mj_option_id === mj_option_id})
                        return (
                            <th style={{ border: "1px solid black", borderCollapse: "collapse" }}>{obj.content}</th>
                        )
                      })}</tr>
                      <tr>{this.state.data.mj_options.map((obj: any) => {
                        const mj_option_id = obj.id;
                        const mj_option_count = countObj.filter((el: any) => { return el.mj_option_id === mj_option_id })
                        return (
                          <td style={{ border: "1px solid black", borderCollapse: "collapse" }}>{mj_option_count.length > 0 ? mj_option_count[0].count : 0}</td>
                        )
                      })}</tr>
                    </table>
                    </div>
                  )
                })}
              </div>
                <div className={styles.footer}><div>{this.state.data.created_at.slice(0, -7).replace("T", " ")}</div >
                  <div>終了時間: {this.state.data.end_at.slice(0, -3).replace("T", " ")}, コメント数: {this.state.data.comments.length}, 投票数: {this.state.data.total_vote}, by: {this.state.data.user_info.name}</div ></div>
            </div>
            </li>
          }
          
        </div>
      );
    }
    else {
      return (
        <li className={styles.li}>
          <div className={styles.title}>{this.state.data.title}</div>
          <div className={styles.content}>{this.state.data.content}</div>
          <div className={styles.vote_section}>
            
            {this.state.voteTypeId === 1 ? 
              <EachVoteSelect voteContent={this.state.data.vote_selects} postId={this.state.data.id}></EachVoteSelect>
             : 
              <EachVoteMj voteContent={this.state.data.vote_mjs} mjOptions={this.state.data.mj_options} postId={this.state.data.id}></EachVoteMj>
             }
            
            
            </div>
          <div className={styles.footer}><div>{this.state.data.created_at.slice(0, -7).replace("T", " ")}</div >
            <div>終了時間: {this.state.data.end_at.slice(0, -3).replace("T", " ")}, コメント数: {this.state.data.comments.length}, 投票数: {this.state.data.total_vote}, by: {this.state.data.user_info.name}</div >
            </div>
        </li>
      )
    }

  }
}

export default NewEachPost;