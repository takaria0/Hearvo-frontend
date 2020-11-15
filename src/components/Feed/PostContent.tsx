import React from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';

import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Button, TextField, Fab, Input } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BackspaceIcon from '@material-ui/icons/Backspace';

import * as styles from '../../css//Feed/PostContent.module.css';


interface AddVoteSelectProps {
  title: string;
  content: string;
  end_at: string;
}

interface AddVoteSelectState {
  values: Array<string>;
  // post_id?: number;
  // content?: string;
}

class AddVoteSelect extends React.Component<AddVoteSelectProps, AddVoteSelectState> {
  constructor(props: any) {
    super(props);
    this.state = { values: ['', ''] };
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  createUI() {
    return this.state.values.map((el, i) =>
      <div key={i}>


        <input required={true} minLength={1} className={styles.vote_select} placeholder="投票候補を入力"   onChange={this.handleChange.bind(this, i)} value={el || ''} /><Button style={{ padding: "1px" }} variant="contained" color="secondary" aria-label="delete" onClick={this.removeClick.bind(this, i)} >削除</Button>
        
      </div>
    )
  }

  handleChange(i: number, event: any) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
    // console.log("AddVoteSelect: this.state"); // console.log(this.state);
    // console.log("AddVoteSelect: this.props.title"); // console.log(this.props.title);
    // console.log("AddVoteSelect: this.props.content"); // console.log(this.props.content);
  }

  addClick() {
    this.setState(prevState => ({ values: [...prevState.values, ''] }))
  }

  removeClick(i: number) {
    let values = [...this.state.values];
    values.splice(i, 1);
    this.setState({ values });
  }

  handleSubmit(event: any) {
    // event.preventDefault();
    const jwt = getJwt();
    const voteSelectObj = this.state.values.map((val) => {
      return {
        content: val
      }
    });
    const postObj = {
      title: this.props.title,
      content: this.props.content,
      end_at: this.props.end_at,
      vote_selects: voteSelectObj
    }
    console.log("postObj", postObj);
    axios.post("/posts", postObj, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res: any) => {
      }).catch((res: any) => {
      });

  }

  render() {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        {this.createUI()}
        <small><Button style={{ padding: "1px" }} color="primary" variant="contained" aria-label="add" onClick={this.addClick.bind(this)} >
          追加
        </Button></small>
        <div className={styles.submit_button}>
          <Button style={{ padding: "1px"}} type="submit" value="Submit" variant="contained" color="primary" >投稿</Button>
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
}

class PostFeed extends React.Component<PostFeedProps, PostFeedState> {
  constructor(props: PostFeedProps) {
    super(props);

    this.state = {
      title: "",
      content: "",
      endhour: "",
      end_at: "",
      edit: false,
    }
  }

  change(e: any, field: string) {
    this.setState({
      [field]: e.target.value,
    } as unknown as PostFeedState)


    if (field === "endhour") {
      const dt = new Date();
      const endHour = e.target.value ? parseInt(e.target.value) : 0;
      const endDate = new Date(dt.setHours(dt.getHours() + endHour));
      console.log("endDate", endDate);
      const endDateString = endDate.toISOString().slice(0, -8);
      this.setState({
        end_at: endDateString,
      })
    } 
  }

  clickHandle(e: any, value: boolean) {
    e.preventDefault();
    this.setState({
      edit: value
    });
  }


  editMode() {
    return (
      <div>
        <div>
          <Button onClick={e => this.clickHandle(e, false)}>キャンセル</Button>
      </div>
      
      <div className={styles.post_content}>
        <div className={styles.post_content_inside}>
          <div >
            <input required={true} minLength={1} className={styles.title} id="post-title" placeholder="タイトルを入力" onChange={e => this.change(e, "title")} value={this.state.title} size={30} />
          </div>
          <div >
            <textarea required={true} minLength={1} className={styles.content} id="post-content" placeholder="内容を入力" onChange={e => this.change(e, "content")} value={this.state.content} rows={4} />
          </div>
          <div >
            終了: <input required={true} className={styles.date_button} type="number" min={24} max={168} id="post-end" placeholder="24" onChange={e => this.change(e, "endhour")} />時間後, 終了日時: {this.state.end_at}
          </div>
          <div>
            <AddVoteSelect title={this.state.title || ""} content={this.state.content || ""} end_at={this.state.end_at || ""}></AddVoteSelect>
          </div>

        </div>
      </div >
      </div>
    )
  }

  normalMode = () => (
    <div>
      <Button onClick={e => this.clickHandle(e, true)}>投稿する</Button>
    </div>
  )


  render() {
    if(this.state.edit === false) {
      return (
        <div>
          <this.normalMode></this.normalMode>
        </div>
      )
    } else {
      return (
        <div>
          <this.editMode></this.editMode>
        </div>
      )
    }

  }
}




export default withRouter(PostFeed);