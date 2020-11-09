import React from 'react';
import { Button } from '@material-ui/core';

import * as styles from '../css/feed.module.css';

type PostType = {
  post_id: number;
  title: string,
  content: string;
}

type VoteSelectType = {
  vote_select_id: number;
  post_id: number,
  content: string,
}

const someData: PostType[] = [
  {
    post_id: 1,
    title: "What do you think about Trump?",
    content: "Folks, I want you to answer this question"
  },
  {
    post_id: 2,
    title: "How much money do you make?",
    content: "Folks, I want you to answer this question"
  },
];


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



type FeedProps = {
  service: string;
};
type FeedState = {
};

type FeedListProps = {
  // using `interface` is also ok
  data: PostType[];
};
type FeedListState = {
};

type FeedCategoryProps = {
  data: Array<string>;
};
type FeedCategoryState = {
};

type VoteSelectListProps = {
  // using `interface` is also ok
  voteSelectArray: VoteSelectType[];
};

type VoteSelectListState = {
  // using `interface` is also ok
  vote_select_id: number;
};

// Feed posts
class VoteSelectList extends React.Component<VoteSelectListProps, VoteSelectListState> {

  constructor(props: any) {
    super(props);
    this.state = {
      "vote_select_id": 0,
    };
  }

  someFunc(voteSelectId: number, event: any) {
    this.setState({vote_select_id: voteSelectId});
  };

  render() {
    return (
      <div >
        <ul>
          {
            this.props.voteSelectArray.map((da) => {
              return (
                <li className={styles.li}>
                  <div className={styles.content}>
                    <Button variant="contained" color="primary" onClick={(e) => this.someFunc(da.vote_select_id, e)}>
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
                  <div className={styles.content}>
                    {da.content}
                  </div>
                  <div>
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


// Base Component
class Feed extends React.Component<FeedProps, FeedState> {

  componentDidMount() {

  }

  render() {
    return (
      <div className="feed">
        <h1 className={styles.header}>{this.props.service}</h1>
        <FeedCategory data={categoryData}></FeedCategory>
        
        <FeedList data={someData}></FeedList>
      </div>
    );
  }
}

export default Feed;