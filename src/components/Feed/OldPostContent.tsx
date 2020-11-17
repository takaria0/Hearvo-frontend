import React from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';

import { Link,withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, TextField, Fab, Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BackspaceIcon from '@material-ui/icons/Backspace';

import * as styles from '../../css/Feed/PostContent.module.css';


interface AddVoteSelectProps {
  title: string;
  content: string;
  end_at: string;
  endhour: string;
}

interface AddVoteSelectState {
  values: Array<string>;
  submitSuccess: boolean;
  // post_id?: number;
  // content?: string;
}

class AddVoteSelect extends React.Component<AddVoteSelectProps, AddVoteSelectState> {
  constructor(props: any) {
    super(props);
    this.state = { 
      values: ['', ''],
      submitSuccess: true,
     };
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  createUI() {
    return this.state.values.map((el, i) => {
      if(i < 2) {
        return (
          <div key={i}>
            <input required={true} minLength={1} className={styles.vote_select} placeholder="投票候補を入力" onChange={this.handleChange.bind(this, i)} value={el || ''} />
          </div>
        )
      } else {
        return (
          <div key={i}>
            <input required={true} minLength={1} className={styles.vote_select} placeholder="投票候補を入力" onChange={this.handleChange.bind(this, i)} value={el || ''} /><Button style={{ padding: "1px" }} variant="contained" color="secondary" aria-label="delete" onClick={this.removeClick.bind(this, i)} >削除</Button>
          </div>
        )
      }
      }
    )
  }

  handleChange(i: number, event: any) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
  }

  addClick() {
    if (this.state.values.length < 11) {
      this.setState(prevState => ({ values: [...prevState.values, ''] }))
    }
  }

  removeClick(i: number) {
    if(this.state.values.length > 2) {
      let values = [...this.state.values];
      values.splice(i, 1);
      this.setState({ values });
    }
  }

  handleSubmit(event: any) {
    console.log(1)
    const jwt = getJwt();
    const voteSelectObj = this.state.values.map((val) => {
      return {
        content: val
      }
    });
    console.log(2)
    const postObj = {
      title: this.props.title,
      content: this.props.content,
      end_at: this.props.end_at,
      vote_selects: voteSelectObj
    };
    console.log(3)

    console.log("postObj", postObj);

    if(
      this.props.title.length < 1
      || this.props.title.replace(" ", "").length < 1
      || this.props.content.length < 1
      || this.props.content.replace(" ", "").length < 1
      || parseInt(this.props.endhour) > 10000
      || parseInt(this.props.endhour) < 24
      ) {
        console.log("submission failed");
        this.setState({
          submitSuccess: false,
        })
      console.log(4)

        return
      }

    console.log(5)
    // console.log("postObj", postObj);
    axios.post(
      "/posts",
      postObj,
      { headers: { Authorization: `Bearer ${jwt}` } }
      )
      .then((res: any) => {
        this.setState({
          submitSuccess: true,
        })
        console.log(6)
        console.log("then res", res)
      }).catch((res: any) => {
        console.log(7)
        console.log("error res", res)
      });
    console.log(8)
  }

  render() {
      return (
        <form onSubmit={e => this.handleSubmit(e)}>
          {this.createUI()}
          <small><Button style={{ padding: "1px" }} color="primary" variant="contained" aria-label="add" onClick={this.addClick.bind(this)} >
            追加
        </Button></small>
          <div className={styles.submit_button}>
            <Button style={{ padding: "1px" }} type="submit" value="Submit" variant="contained" color="primary" >投稿</Button>
          </div>
        <div>
            {"送信に失敗しました。" ? !this.state.submitSuccess : ""}
        </div>
        </form>
      );
  }
}



interface PostFeedProps extends RouteComponentProps<{}> {
}

interface PostFeedState {
  title? : string;
  content?: string;
  endhour?: string;
  end_at?: string;
  edit?: boolean;
  keyword?: string;
}

class PostFeed extends React.Component<PostFeedProps, PostFeedState> {
  constructor(props: any) {
    super(props);

    const currentDate = new Date();
    const defaultEndAt = new Date(currentDate.setHours(currentDate.getHours() + 24)).toISOString().slice(0, -8);

    this.state = {
      title: "",
      content: "",
      endhour: "24",
      end_at: defaultEndAt,
      edit: false,
      keyword: "",
    }
    this.clickHandle = this.clickHandle.bind(this);
    this.change = this.change.bind(this);
  }

  change(e: any, field: string) {
    this.setState({
      [field]: e.target.value,
    } as unknown as PostFeedState)

    // console.log("this state", this.state);

    if (field === "endhour") {
      // console.log("endhour field")
      const dt = new Date();
      const endHour = e.target.value ? parseInt(e.target.value) : 0;
      if(endHour > 0 && endHour < 36000 ) {
        // console.log("endhour endHour endHour endHour")
        const endDate = new Date(dt.setHours(dt.getHours() + endHour));
        // console.log("endDate", endDate);
        const endDateString = endDate.toISOString().slice(0, -8);
        // console.log("endDateString", endDateString)
        this.setState({
          end_at: endDateString,
        })
      }
    } 
  }

  keywordChange(e:any, keyword: string) {
  }

  clickHandle(e: any, value: boolean) {
    e.preventDefault();
    this.setState({
      edit: value
    });
  }


  editMode = () => {
    return (
      <div>
        <div className={styles.mini_header}>
          <div className={styles.mini_header_inside}>
            <Link to="/popular">人気順</Link> <Link to="/latest">最新</Link> 検索<Button onClick={e => this.clickHandle(e, false)}>キャンセル</Button>
          </div>
        </div>
      
      <div className={styles.post_content}>
        <div className={styles.post_content_inside}>
          <div >
            <div>
              投稿の際は、最低限の礼節を弁えましょう。投票終了は最短で24時間後です。
            </div>
            <input required className={styles.title} id="post-title" placeholder="タイトルを入力" onChange={e => this.change(e, "title")} value={this.state.title} size={30} />
          </div>
          <div >
            <textarea required className={styles.content} id="post-content" placeholder="内容を入力" onChange={e => this.change(e, "content")} value={this.state.content} rows={4} />
          </div>
          <div style={{textAlign: "left"}}>
    終了: <input required={true} value={this.state.endhour} className={styles.date_button} type="number" min={24} max={168} id="post-end" placeholder="24" onChange={e => this.change(e, "endhour")} /> {this.state.endhour}時間後, 終了日時: {this.state.end_at}
          </div>
          <div>
            <AddVoteSelect title={this.state.title || ""} content={this.state.content || ""} end_at={this.state.end_at || ""} endhour={this.state.endhour || ""}></AddVoteSelect>
          </div>

        </div>
      </div >
      </div>
    )
  }

  normalMode = () => (
    <div className={styles.mini_header}>
      <div className={styles.mini_header_inside}>
        <Link to="/popular" >人気順</Link> <Link to="/latest">最新</Link> 検索<span style={{ float: "right", textAlign: "right" }}><button onClick={e => this.clickHandle(e, true)}>投稿する</button></span>
      </div>
      
    </div>
  )


  render() {

    if(this.state.edit === false) {
      return (
        <div>
          {this.normalMode()}
        </div>
      )
    } else {
      return (
        <div>
          {this.editMode()}
        </div>
      )
    }

  }
}




export default withRouter(PostFeed);