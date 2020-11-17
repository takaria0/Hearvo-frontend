import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from '../Api';

// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'

import EachFeed from './EachFeed';
import Plot from 'react-plotly.js';
import NewEachPost from './NewEachPost';


export interface NewFeedProps {
  keyword: string;
}
 
export interface NewFeedState {
  isLoaded: boolean,
  voteLoading: boolean,
  page: number,
  dataArray: any[],
}
 
class NewFeed extends React.Component<NewFeedProps, NewFeedState> {

  constructor(props: any) {
    super(props);

    this.state = {
      isLoaded: false,
      voteLoading: false,
      page: 1,
      dataArray: [],
    };
    document.title = "Hearvo"
  };

  loader = React.createRef<HTMLInputElement>();

  handleObserver = (entities: any) => {
    const target = entities[0];
    console.log("target", target)
    if (target.isIntersecting && this.state.page < 50) {
      this.setState({
        page: this.state.page + 1,
      })
    }
  }

  componentDidMount = () => {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(this.handleObserver, options);
    console.log("this.loader", this.loader)
    console.log("observer", observer)
    if (this.loader.current) {
      observer.observe(this.loader.current)
    }
    this.getData(this.state.page);
  };


  getData = (page: number) => {
    const keyword = window.location.pathname.replace("/", "");
    const jwt = getJwt();
    // const page = this.state.page;
    console.log("page", this.state.page);
    const keywordList = ["popular", "latest"]

      if (keywordList.includes(keyword)) {
        axios.get(`/posts?keyword=${keyword}&page=${page}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({
              dataArray: [...this.state.dataArray, ...res.data],
              isLoaded: true,
            });
          }).catch((err) => {
            console.log(err.response.data);
          })
      } else {
        axios.get(`/posts?keyword=popular&page=${page}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({
              dataArray: [...this.state.dataArray, ...res.data],
              isLoaded: true,
            });
          }).catch((err) => {
            console.log(err.response.data);
          })
      }
  }

  componentDidUpdate = (prevProps: any, prevState: any) => {
    if (prevState.page !== this.state.page) {
      this.getData(this.state.page);
      return
    } else {
      return
    }
  }

  click = (e: any) => {
    if(this.state.page < 49) {
      this.setState({
        page: this.state.page + 1
      })
    }
  }

  render() { 
    if(this.state.isLoaded === false) {
      return (
        <div>
          Loading ...
        </div>
      )
    } else {
      return (
        <div>
          <ul className={styles.ul}>
            
            {
              this.state.dataArray.map((data: any, idx: number) => { return <Link to={`/${data?.user?.name}/posts/${data?.id}`} className={styles.each_post_link}><NewEachPost data={data} ></NewEachPost></Link>})}            
            
          </ul>

          <div className="loading" ref={this.loader}>
            <h2><button onClick={e => this.click(e)}>More</button></h2>
          </div> 
        </div>
      );
    }
  }
}
 
export default NewFeed;