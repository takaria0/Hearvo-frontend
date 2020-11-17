
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import axios from '../Api';

// import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'

import EachFeed from './EachFeed';


type VoteSelectType = {
  id: number;
  content: string,
}


type PostType = {
  id: number;
  title: string;
  content: string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  vote_selects: VoteSelectType[];
  user: {
    name: string;
  };
  comments: []; num_vote: number;
}


type FeedListProps = {
  // data: PostType[];
  data: Array<PostType>
};
type FeedListState = {
  data: Array<PostType>
};


// Feed posts
class FeedList extends React.Component<FeedListProps, FeedListState> {

  constructor(props: any) {
    super(props);

    this.state = {
      data: this.props.data,
    }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data
    })
  }

  render() {
    return (
      <div >
        <ul className={styles.ul}>
          {this.props.data.map((da) => {
            // // console.log("eachPost"); // // console.log(da);
            return (
              <div>
                <Link to={`${da?.user?.name}/posts/${da?.id}`} className={styles.each_post_link}>
                <EachFeed eachPost={da} postId={da?.id}></EachFeed>
                </Link>
              </div>
            )
          })
          }
        </ul>
      </div>
    );
  }
}





type FeedProps = {
  keyword: string;
};

type FeedState = {
  categoryData: Array<string>,
  postData: PostType[],
  page: number;
};


// Base Component
class Feed extends React.Component<FeedProps, FeedState> {

  constructor(props: any) {
    super(props);
    
    this.state = {
      categoryData: [],
      postData: [],
      page: 1,
    }
    document.title = "Hearvo"
    
  }

  loader = React.createRef<HTMLInputElement>();

  handleObserver = (entities: any) => {
    const target = entities[0];
    if (target.isIntersecting && this.state.page < 50) {
        this.setState({
          page: this.state.page + 1,
        })
    }
  }

  getData = (option: string) => {
    const keyword = window.location.pathname.replace("/", "");

    const jwt = getJwt();
    const page = this.state.page;
    // console.log("page", page)
    const keywordList = ["popular", "latest"]

    if(option === "update") {
      if (keywordList.includes(keyword)) {
        axios.get(`/posts?keyword=${keyword}&page=${page}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            const postData = res.data;
            const prevData = this.state.postData;
            this.setState({ 
              postData: [...prevData, ...postData]
              });
          }).catch((err) => {
            // // // console.log(err.response.data);
          })
      } else {
        axios.get(`/posts?keyword=popular&page=${page}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            const postData = res.data;
            const prevData = this.state.postData;
            this.setState({
              postData: [...prevData, ...postData]
            });
          }).catch((err) => {
            // // // console.log(err.response.data);
          })
      }
    } else {
      if (keywordList.includes(keyword)) {
        axios.get(`/posts?keyword=${keyword}&page=${page}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            const postData = res.data;
            this.setState({ postData });
          }).catch((err) => {
            // // // console.log(err.response.data);
          })
      } else {
        axios.get(`/posts?keyword=popular&page=${page}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
          .then(res => {
            const postData = res.data;
            this.setState({ postData });
          }).catch((err) => {
            // // // console.log(err.response.data);
          })
      }
    }
  }
  

  componentDidMount() {
    var options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    // initialize IntersectionObserver
    // and attaching to Load More div
    const observer = new IntersectionObserver(this.handleObserver, options);
    // console.log("this.loader", this.loader)
    // console.log("observer", observer)
    if (this.loader.current) {
      observer.observe(this.loader.current)
    }
    this.getData("");
  }

  // shouldComponentUpdate(nextProps: any, nextState: any) {
  //   if(nextState.page !== this.state.page) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  componentDidUpdate = (prevProps: any, prevState: any) => {
    if (prevState.page !== this.state.page) {
      this.getData("update");
      return
    } else {
      return 
    }
  }

  render() {
    return (
      <div className={styles.feed}>
        {/* <FeedCategory data={categoryData}></FeedCategory> */}
        
        <FeedList data={this.state.postData}></FeedList>

        <div className="loading" ref={this.loader}>
          <h2>Loading ...</h2>
        </div>
      </div>
    );
  }
}

export default Feed;