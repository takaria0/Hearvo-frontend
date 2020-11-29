import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from '../Api';

// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'

import EachFeed from './OldEachFeed';
import Plot from 'react-plotly.js';
import NewEachPost from './NewEachPost';


export interface NewFeedProps {
  keyword: string;
  isPosted: boolean;
  isPostedHandeler: any;
  isLogin: boolean;
}
 
export interface NewFeedState {
  isLoaded: boolean,
  voteLoading: boolean,
  page: number,
  dataArray: any[],
  location: string;
  searchQuery: string;
}
 
class NewFeed extends React.Component<NewFeedProps, NewFeedState> {

  constructor(props: any) {
    super(props);

    this.state = {
      isLoaded: false,
      voteLoading: false,
      page: 1,
      dataArray: [],
      location: window.location.href,
      searchQuery: "",
    };
    document.title = "Hearvo"
  };

  loader = React.createRef<HTMLInputElement>();

  handleObserver = (entities: any) => {
    const target = entities[0];
    // console.log("target", target)
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
    if (this.loader.current) {
      observer.observe(this.loader.current)
    }
    this.getData(this.state.page);
  };

 

  getData = (page: number) => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchWord = urlParams.get('q');
    const keywordArray = window.location.pathname.split("/");
    const keyword = keywordArray.includes("popular") ? "popular" : (keywordArray.pop() || "");
    const jwt = getJwt();
    const keywordList = ["popular", "latest", "myposts", "voted", "search"];

    let newpage;
    if(page === 0) {
      newpage = 1;

      if (searchWord !== null) {
        axios.get(`/posts?search=${searchWord}&page=${newpage}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({
              dataArray: res.data,
              isLoaded: true,
              searchQuery: window.location.search,
            });
          }).catch((err) => {
          })
        return
      }


      if (keywordList.includes(keyword)) {
        const time = keyword === "popular" ? keywordArray.pop() : "";
        axios.get(`/posts?keyword=${keyword}&page=${newpage}&time=${time}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({
              dataArray: res.data,
              isLoaded: true,
            });
          }).catch((err) => {
          })
      } else {
        axios.get(`/posts?keyword=popular&page=${newpage}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({
              dataArray: res.data,
              isLoaded: true,
              
            });
          }).catch((err) => {
          })
      }
    } else {
      newpage = page;
      
      if (searchWord !== null) {
        axios.get(`/posts?search=${searchWord}&page=${newpage}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({
              dataArray: res.data,
              isLoaded: true,
              searchQuery: window.location.search,
            });
          }).catch((err) => {
          })
        return
      }


      if (keywordList.includes(keyword)) {
        const time = keyword === "popular" ? keywordArray.pop() : "";
        axios.get(`/posts?keyword=${keyword}&page=${newpage}&time=${time}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({
              dataArray: [...this.state.dataArray, ...res.data],
              isLoaded: true,
            });
          }).catch((err) => {
          })
      } else {
        axios.get(`/posts?keyword=popular&page=${newpage}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            this.setState({
              dataArray: [...this.state.dataArray, ...res.data],
              isLoaded: true,
            });
          }).catch((err) => {
          })
      }
    }
  }

  componentDidUpdate = (prevProps: any, prevState: any) => {
    if (prevState.page !== this.state.page) {
      this.getData(this.state.page);
    }

    // console.log("prevState.location", prevState.location)
    // console.log("window.location.pathname", window.location.pathname)
    if (prevState.location !== window.location.href) {
      // console.log("location changes before", prevState.location);
      // console.log("after", window.location.href);
      this.setState({
        location: window.location.href,
        dataArray: [],
      })
      this.getData(0);
    }


    if (prevProps.isPosted !== this.props.isPosted || this.props.isPosted === true ) {
      this.getData(0)
      this.props.isPostedHandeler(false);
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
            
            { this.state.dataArray.length > 0 ?
              this.state.dataArray.map((data: any, idx: number) => { return <Link to={`/posts/${data?.id}`} className={styles.each_post_link}><NewEachPost isLogin={this.props.isLogin} data={data} ></NewEachPost></Link>})
            : 
            "該当なし"
            }            
            
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