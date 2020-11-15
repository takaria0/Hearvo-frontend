import React from 'react';
import { Button } from '@material-ui/core';
import axios from '../Api';
import * as styles from '../../css/Feed.module.css';
import { getJwt } from '../../helpers/jwt';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import { red } from '@material-ui/core/colors';
import Plot from 'react-plotly.js';


type VoteSelectType = {
  id: number;
  content: string,
}

type voteCountObj = {
}

interface VoteSelectListProps {
  // using `interface` is also ok
  postId: number;
  voteSelectArray: VoteSelectType[];
};

type VoteSelectListState = {
  // using `interface` is also ok
  voted: boolean;
  voteCountArray: voteCountObj[];
  total_vote: number;
  vote_selects_count: {
    vote_select_id: number,
    count: number,
    content: string,
  }[];
  postId: number;
  end: boolean;
};

// Feed posts
class VoteSelectList extends React.Component<VoteSelectListProps, VoteSelectListState> {

  constructor(props: any) {
    super(props);

    this.state = {
      voted: false,
      voteCountArray: [],
      total_vote: 0,
      vote_selects_count: [],
      postId: this.props.postId,
      end: false,
    };
    // console.log("VoteSelectList CONSTRUCTOOOOOOOOOOOO");
    // console.log("this.state");
    // console.log(this.state)
  }


  componentDidMount() {
    this.updateVoteContent();
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.postId !== prevProps.postId) {
      this.updateVoteContent();
    }
  }

  updateVoteContent() {
    const jwt = getJwt();
    // if (!jwt) {
    //   this.props.history.push("/login");
    // }
    const config = {
      headers: { Authorization: `Bearer ${jwt}` }
    };



    axios.get(
      `/vote_select_users?post_id=${this.state.postId}`,
      config,
    ).then((res) => {

      if (res.data.voted === true) {

        this.setState({
          voted: true,
          end: res.data.end
        });
        const countVotePostObj = { post_id: this.props.postId }
        axios.post(
          "/count_vote_selects",
          countVotePostObj,
          config,
        ).then((res) => {
          this.setState({
            total_vote: res.data.total_vote,
            vote_selects_count: res.data.vote_selects_count,
          });
        })

      } else {
        this.setState({
          voted: false,
          end: res.data.end
        });
      }
    })
  }

  handleSubmit(voteSelectId: number, event: any) {
    event.preventDefault();

    const jwt = getJwt();
    // if (!jwt) {
    //   this.props.history.push("/login");
    // }
    const voteSelectPostObj = {
      vote_select_id: voteSelectId,
      post_id: this.state.postId,
    };
    const config = {
      headers: { Authorization: `Bearer ${jwt}` }
    };
    axios.post(
      "/vote_select_users",
      voteSelectPostObj,
      config,
    ).then(res => {
      // // console.log(res);
      this.setState({
        voted: true,
      })
      const countVotePostObj = { post_id: this.props.postId }
      axios.post(
        "/count_vote_selects",
        countVotePostObj,
        config,
      ).then((res) => {
        // // console.log(res);
        this.setState({
          total_vote: res.data.total_vote,
          vote_selects_count: res.data.vote_selects_count,
        });
      })
    }).catch((err) => {
      // console.log(err);
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
                    {'   '}{da.content}{'   '}
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
    const x = this.state.vote_selects_count.map((da, idx) => {
      return (da.count *100 )/ this.state.total_vote
    }).reverse();
    const y = this.state.vote_selects_count.map((da, idx) => {
      return da.content
    }).reverse();

    // const annotations = this.state.vote_selects_count.map((da, idx) => {
    //   return {
    //     xref: 'x1',
    //     yref: 'y1',
    //     // x: ((da.count*100)/this.state.total_vote) + 10,
    //     // y: ySavings[i],
    //     text: ((da.count * 100) / this.state.total_vote) + '%',
    //     font: {
    //       family: 'Arial',
    //       size: 12,
    //       color: 'rgb(50, 171, 96)'
    //     },
    //     showarrow: false,
    //   };
    // })
    return (
      <div >
        <div>
          <Plot
            data={[
              {
                type: 'bar',
                x: x,
                y: y,
                orientation: 'h'
              },
            ]}
            layout={{ width: 700, height: 300, title: `合計票数: ${this.state.total_vote}`, xaxis: { range: [0, 100], title: "%" }, yaxis: { automargin: true}, annotations: [] }}
          />
        </div>
        {/* <ul>
          {

            this.state.vote_selects_count.map((da, idx) => {

              return (
                <li className={styles.li}>
                  <div className={styles.content}>
                    {da.content}, 票数: {da.count}
                  </div>
                </li>
              )
            })
          }
          合計票数: {this.state.total_vote}
        </ul> */}
      </div>
    )
  }


  render() {
    // console.log("VoteSelectList renderrrrrrrrrrrrrrrrrrrrr");
    // console.log("this.state");
    if (this.state.voted === true || this.state.end === true) {
      return (
        this.afterVoteRender()
      );
    } else {
      return (
        this.beforeVoteRender()
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
  user: {
    name: string;
  };
  comments: [];
}


interface Props {
  eachPost: PostType;
  postId: number;
}
 
interface State {
  data: PostType;
  postId: number;
}
 
class EachFeed extends React.Component<Props, State> {

  constructor(props: any) {
    super(props)

    this.state = {
      data: this.props.eachPost,
      postId: this.props.postId,
    }
    // console.log("EACH FEED CONSTRUCTOOOOOOOOOOOO");
    // console.log("this.state");
    // console.log(this.state)
  }

  componentDidUpdate(prevProps: any) {
    
    if (prevProps.eachPost.id !== this.props.eachPost.id) {
      this.setState({
        data: this.props.eachPost
      })
    }
  }

  endHour = () => {
    const eachPostData = this.props.eachPost;
    const hoursDiff = Math.round(Math.abs(new Date().getTime() - new Date(eachPostData?.end_at).getTime()) / 3600000)

    const endDate = eachPostData?.end_at;

    if (hoursDiff <= 0 || hoursDiff >= 168) {
      return (
        <b>
          終了
        </b>
      )
    } else {
      return (
        <b>
          終了日: {endDate}
        </b>
      )
    }
  }
  
  render() { 
    const eachPostData = this.props.eachPost;
    // console.log("EACH FEED renderrrrrrrrrrrrrrrrrrrrr");
    // console.log("this.state");
    return (
      <div>
        
        {
          <div className={styles.each_post}>
            <li className={styles.li}>
              <div className={styles.title}>
                {eachPostData.title}
              </div>
              <div className={styles.content}>
                {eachPostData.content}
              </div>
              <div className={styles.vote_section}>
                <VoteSelectList voteSelectArray={eachPostData.vote_selects} postId={this.state.postId} ></VoteSelectList>
              </div>
              <div className={styles.created_at}>
                created_at:<b> {eachPostData.created_at.slice(0, -7)}</b>, modified_at:<b>{eachPostData.updated_at.slice(0, -7)}</b>, by: <b>{eachPostData?.user?.name}</b>, コメント数: <b>{eachPostData?.comments.length}</b>, <this.endHour></this.endHour>
                
                
              </div>
            </li>
          </div>
        }
      </div>
    )
}
};
 
export default EachFeed;