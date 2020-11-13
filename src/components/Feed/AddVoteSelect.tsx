import React from 'react';
import axios from '../Api';
import { getJwt } from '../../helpers/jwt';


import { withRouter, RouteComponentProps } from 'react-router-dom'




interface AddVoteSelectProps extends RouteComponentProps<{}> {
  title: string;
  content: string;
}

interface AddVoteSelectState {
  values: Array<string>;
  // post_id?: number;
  // content?: string;
}

class AddVoteSelect extends React.Component<AddVoteSelectProps, AddVoteSelectState> {
  constructor(props: any) {
    super(props);
    this.state = { values: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  createUI() {
    return this.state.values.map((el, i) =>
      <div key={i}>
        <input type="text" value={el || ''} onChange={this.handleChange.bind(this, i)} />
        <input type='button' value='remove' onClick={this.removeClick.bind(this, i)} />
      </div>
    )
  }

  handleChange(i: number, event: any) {
    let values = [...this.state.values];
    values[i] = event.target.value;
    this.setState({ values });
    console.log("AddVoteSelect: this.state"); console.log(this.state);
    console.log("AddVoteSelect: this.props.title"); console.log(this.props.title);
    console.log("AddVoteSelect: this.props.content"); console.log(this.props.content);
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
    console.log("handleSubmit");
    event.preventDefault();
    const jwt = getJwt();
    const voteSelectObj = this.state.values.map((val) => {
      return {
        content: val
      }
    });
    const postObj = {
      title: this.props.title,
      content: this.props.content,
      vote_selects: voteSelectObj
    }
    console.log("postObj"); console.log(postObj);
    axios.post("/posts", postObj, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res: any) => {
        this.props.history.push("/");
      }).catch((res: any) => {
        this.props.history.push("/");
      });
    
  }

  render() {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        {this.createUI()}
        <input type='button' value='add more' onClick={this.addClick.bind(this)} />
        <input type="submit" value="Submit" />
      </form>
    );
  }





  // change(e: any, field: string) {
  //   this.setState({
  //     [field]: e.target.value,
  //   } as unknown as AddVoteSelectState)

  // }





  // submit(e: any) {
  //   e.preventDefault();
  //   const jwt = getJwt();
  //   axios.post("/posts", {
  //     post_id: this.state.post_id,
  //     content: this.state.content,
  //   }, { headers: { Authorization: `Bearer ${jwt}` } })
  //     .then((res: any) => {
  //       this.props.history.push("/");
  //     }).catch((res: any) => {
  //       this.props.history.push("/");
  //     })
  // };




}




export default withRouter(AddVoteSelect);