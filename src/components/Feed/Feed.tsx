
import React from 'react';
import { Button } from '@material-ui/core';
import axios from '../Api';

import PostFeed from './PostFeed';
import * as styles from '../../css/feed.module.css';
import { getJwt } from '../../helpers/jwt';


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



type VoteSelectType = {
  id: number;
  content: string,
}

type voteCountObj = {

}

type VoteSelectListProps = {
  // using `interface` is also ok
  postId: number;
  voteSelectArray: VoteSelectType[];
};

type VoteSelectListState = {
  // using `interface` is also ok
  id: number;
  voted: boolean;
  voteCountArray: voteCountObj[];
  total_vote: number;
  vote_selects_count: object;
};

// Feed posts
class VoteSelectList extends React.Component<VoteSelectListProps, VoteSelectListState> {

  constructor(props: any) {
    super(props);
    this.state = {
      id: 0,
      voted: false,
      voteCountArray: [],
      total_vote: 0,
      vote_selects_count: {},
    };
  }

  handleSubmit(voteSelectId: number, event: any)  {
    event.preventDefault();


    this.setState({ id: voteSelectId });
    console.log("voteSelectId", voteSelectId)

    const jwt = getJwt();
    // if (!jwt) {
    //   this.props.history.push("/login");
    // }
    const voteSelectPostObj = {
      vote_select_id: voteSelectId
    };
    const config = {
      headers: { Authorization: `Bearer ${jwt}` }
    };

    console.log("voteSelectPostObj", voteSelectPostObj)

    axios.post(
      "/vote_select_users",
      voteSelectPostObj,
      config,
    ).then(res => {
      console.log(res);
      this.setState({
        voted: true
      });
    }).catch((err) => {
      console.log(err);
    })

    const countVotePostObj = { post_id: this.props.postId }
    console.log("countVotePostObj", countVotePostObj)
    axios.post(
      "/count_vote_selects",
      countVotePostObj,
      config,
      ).then((res) => {
      console.log(res);
      this.setState({
        total_vote: res.data.total_vote,
        vote_selects_count: res.data.vote_selects_count,
      });
    })
  }

  beforeVoteRender() {
    return (
      <div >
        <ul>
          {
            this.props.voteSelectArray.map((da) => {
              return (
                <li className={styles.li}>
                  <div className={styles.content}>
                    <Button variant="contained" color="primary" onClick={(e) => this.handleSubmit(da.id, e)}>
                      vote
                    </Button>
                    {'   '}{da.content}{'   '}{this.state.id}
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }

  afterVoteRender() {
    return (
      <div >
        <ul>
          {
            this.props.voteSelectArray.map((da, idx) => {

              // const voteSelectId = da.id.toString();
              // const voteCount = this.state.vote_selects_count;
              // console.log("voteCount"); console.log(voteCount)
              
              return (
                <li className={styles.li}>
                  <div className={styles.content}>
                    {da.content}{"  "}{22}
                  </div>
                </li>
              )
            })
          }
          total: {this.state.total_vote}
        </ul>
      </div>
    )
  }


  render() {

    if(this.state.voted === false) {
      return (
        this.beforeVoteRender() 
      );
    } else {
      return (
        this.afterVoteRender() 
      );
    }
  }

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
                    <VoteSelectList voteSelectArray={da.vote_selects} postId={da.id}></VoteSelectList>
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
    const jwt = getJwt();
    axios.get("/posts", { headers: { 'Authorization': 'Bearer ' + jwt } })
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
        <FeedCategory data={categoryData}></FeedCategory>
        <PostFeed></PostFeed>
        <FeedList data={this.state.postData}></FeedList>
      </div>
    );
  }
}

export default Feed;