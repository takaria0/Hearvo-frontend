
import React from 'react';
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
  comments: [];
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
        <ul>
          {this.props.data.map((da) => {
            // console.log("eachPost"); // console.log(da);
            return (
              <div>
                <Link to={`${da?.user?.name}/posts/${da?.id}`} className={styles.each_post}>
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


// type FeedCategoryProps = {
//   data: Array<string>;
// };
// type FeedCategoryState = {
// };
// // Category
// class FeedCategory extends React.Component<FeedCategoryProps, FeedCategoryState> {

//   render() {
//     return (
//       <div className="feed-category">
//         <ul className={styles.menu}>
//           {
//           this.props.data.map((data)=> {
//             return (
//               <li className={styles.menulist}>
//                 <a>{data}</a>
//             </li>
//             )
//           })
//           }
//         </ul>
//       </div>
//     );
//   }
// }



type FeedProps = {
  keyword: string;
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
    const keyword = this.props.keyword;
    const jwt = getJwt();
    axios.get(`/posts?keyword=${keyword}`, { headers: { 'Authorization': 'Bearer ' + jwt } })
      .then(res => {
        const postData = res.data;
        this.setState({ postData });
      }).catch((err)=> {
        // // console.log(err.response.data);
      })
  }

  render() {
    return (
      <div className={styles.feed}>
        {/* <FeedCategory data={categoryData}></FeedCategory> */}
        
        <FeedList data={this.state.postData}></FeedList>
      </div>
    );
  }
}

export default Feed;