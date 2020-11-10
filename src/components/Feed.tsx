
import React from 'react';
import { Button } from '@material-ui/core';
import axios from './Api';

import * as styles from '../css/feed.module.css';


const TOKEN = process.env.REACT_APP_BEARER_TOKEN_LOCAL;

/*
*
* just some data for test
*
*/

const categoryData: Array<string> = [
  "popular",
  "latest",
  "science",
  "IT",
  "environment",
  "politics",
]

const voteSelectData: VoteSelectType[] = [
  {
    vote_select_id: 1,
    post_id: 1,
    content: "Good",
  },
  {
    vote_select_id: 2,
    post_id: 1,
    content: "Bad",
  },
]


type VoteSelectType = {
  vote_select_id: number;
  post_id: number,
  content: string,
}

type VoteSelectListProps = {
  // using `interface` is also ok
  voteSelectArray: VoteSelectType[];
};

type VoteSelectListState = {
  // using `interface` is also ok
  vote_select_id: number;
  user_id: number;
};

// Feed posts
class VoteSelectList extends React.Component<VoteSelectListProps, VoteSelectListState> {

  constructor(props: any) {
    super(props);
    this.state = {
      "vote_select_id": 0,
      "user_id": 0,
    };
  }

  handleSubmit(voteSelectId: number, event: any)  {
    event.preventDefault();

    this.setState({ vote_select_id: voteSelectId });

    const postObj = {
      user_id: this.state.user_id,
      vote_select_id: this.state.vote_select_id
    };

    axios.post("/vote_select_user", { postObj }, {headers: { 'Authorization': 'Bearer ' + TOKEN }})
      .then(res => {
        console.log(res);
      })
  }



  render() {
    return (
      <div >
        <ul>
          {
            this.props.voteSelectArray.map((da) => {
              return (
                <li className={styles.li}>
                  <div className={styles.content}>
                    <Button variant="contained" color="primary" onClick={(e) => this.handleSubmit(da.vote_select_id, e)}>
                      vote
                    </Button>
                    {'   '}{da.content}{'   '}{this.state.vote_select_id}
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}


type PostType = {
  post_id: number;
  title: string;
  content: string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
}


type FeedListProps = {
  data: PostType[];
};
type FeedListState = {
};


// Feed posts
class FeedList extends React.Component<FeedListProps, FeedListState> {
  
  render() {
    return (
      <div >
        <ul>
          {
            this.props.data.map((da) => {
              return (
                <li className={styles.li}>
                  <div className={styles.title}>
                    {da.title}
                  </div>
                  <div className={styles.created_at}>
                    <b>created_at:</b> {da.created_at}, <b>modified_at:</b> {da.updated_at}
                  </div>
                  <div className={styles.content}>
                    {da.content}
                  </div>
                  <div className={styles.vote_section}>
                    <VoteSelectList voteSelectArray={voteSelectData}></VoteSelectList>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}


type FeedCategoryProps = {
  data: Array<string>;
};
type FeedCategoryState = {
};
// Category
class FeedCategory extends React.Component<FeedCategoryProps, FeedCategoryState> {

  render() {
    return (
      <div className="feed-category">
        <ul className={styles.menu}>
          {
          this.props.data.map((data)=> {
            return (
              <li className={styles.menulist}>
                <a>{data}</a>
            </li>
            )
          })
          }
        </ul>
      </div>
    );
  }
}



type FeedProps = {
  service: string;

};
type FeedState = {
  categoryData: Array<string>,
  postData: PostType[],
};


// Base Component
class Feed extends React.Component<FeedProps, FeedState> {

  constructor(props: any) {
    super(props);
    this.state = {
      categoryData: [],
      postData: [],
    }
  }

  componentDidMount() {
    axios.get("/posts", { headers: { 'Authorization': 'Bearer ' + TOKEN } })
      .then(res => {
        const postData = res.data;
        this.setState({ postData });
      }).catch((err)=> {
        // console.log(err.response.data);
      })
  }

  render() {
    return (
      <div className="feed">
        <h1 className={styles.header}>{this.props.service}</h1>
        <FeedCategory data={categoryData}></FeedCategory>
        <FeedList data={this.state.postData}></FeedList>
      </div>
    );
  }
}

export default Feed;