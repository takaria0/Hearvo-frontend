import React from 'react';
import axios from './Api';
import * as styles from '../css/Header.module.css';
import { Button, Input } from '@material-ui/core';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';


type userObject = {
  id: string;
  name: string;
  email: string;
  description: string;
  string_id: string;
  gender: string;
  age: string;
  created_at: string;
  updated_at: string;
  occupation: string;
}

interface ProfileDetailProps {

}

interface ProfileDetailState {
  edit?: boolean;
  user?: userObject;
  editDescription?: string;
  editGender?: string;
  editAge?: string;
  editOccupation?: string;
  editSuccess?: boolean;
}

class ProfileDetail extends React.Component<ProfileDetailProps, ProfileDetailState> {
  constructor(props: ProfileDetailProps) {
    super(props);

    const userObj: userObject = JSON.parse(localStorage.getItem("user") || "{}");
    this.state = {
      edit: false,
      user: userObj,
      editDescription: "",
      editGender: "",
      editAge: "",
      editOccupation: "",
      editSuccess: false,
    }
  }

  componentDidMount() {

  }

  submit(e: any) {
    e.preventDefault();
    const postObj = {
      description: this.state.editDescription,
      gender: this.state.editGender,
      age: this.state.editAge,
      occupation: this.state.editOccupation,
    }
    const jwt = getJwt();
    console.log("postObj", postObj);
    axios.put("/users", postObj, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res: any) => {
        console.log("success res",res)
        this.setState({
          user: res.data,
          editSuccess: true,
        })
      }).catch((res: any) => {
        console.log("failed res", res)
      });
  }

  change(e: any, field: string) {
    console.log("cnahge", this.state)
    console.log("field", field)
    e.preventDefault();
    this.setState({
      [field]: e.target.value,
    } as unknown as ProfileDetailState)

  }

  click(e: any, value: boolean) {
    e.preventDefault();

    this.setState({
      edit: value,
    })
  }


  editRender() {
    const baseJSX = (
      <div>
        <form onSubmit={e => this.submit(e)}>
        <ul>
          <li>
            ユーザーネーム: {this.state.user?.name}
          </li>
          <li>
            メールアドレス: {this.state.user?.email}
          </li>
          <li>
              説明: {this.state.user?.description}{"  "}<input type="string" placeholder={this.state.user?.description} onChange={e => this.change(e, "editDescription")}></input>
          </li>
          <li>
              性別: {this.state.user?.gender}{"  "}<select onChange={e => this.change(e, "editGender")}>
                <option value="女性">女性</option>
                <option value="男性">男性</option>
                <option value="どちらでもない">どちらでもない</option>
              </select>
          </li>
          <li>
              年齢: {this.state.user?.age}{"  "}<input min="1" max="130" type="number" placeholder={this.state.user?.age} onChange={e => this.change(e, "editAge")}></input>
          </li>
          <li>
              職業: {this.state.user?.occupation}{"  "}<input type="string" placeholder={this.state.user?.occupation} onChange={e => this.change(e, "editOccupation")}></input>
          </li>
        </ul>
          <Button type="submit" value="Submit" color="primary">保存</Button>
        </form>
      </div>
    );

    const editbeforeJSX = (
      <div>
      </div>
    );

    const editAfterJSX = (
      <div>
        Edit mode
        <h1>
          保存しました
        </h1>
      </div>
    );
    if(this.state.editSuccess === false) {
      return (
        <div>
          {baseJSX}
          {editbeforeJSX}
        </div>
      )
    } else {
      return (
        <div>
          {baseJSX}
          {editAfterJSX}
        </div>
      )
    }

  }

  viewRender() {
    return (
      <div>
        <ul>
          <li>
            ユーザーネーム: {this.state.user?.name}
          </li>
          <li>
            メールアドレス: {this.state.user?.email}
          </li>
          <li>
            説明: {this.state.user?.description}
          </li>
          <li>
            性別: {this.state.user?.gender}
          </li>
          <li>
            年齢: {this.state.user?.age}
          </li>
          <li>
            職業: {this.state.user?.occupation}
          </li>
        </ul>
      </div>
    )
  }

  render() {

    if(this.state.edit === false) {
      return (
        <div>
          <h1>プロフィール</h1>
          <div>
            <Button onClick={e => this.click(e, true)}>編集する</Button>
          </div>
          <div>
            {this.viewRender()}
          </div>
        </div>
      )
    } else {
      return (

        <div>
          <h1>プロフィール</h1>
          <div>
            <Button onClick={e => this.click(e, false)}>表示する</Button>
          </div>
          <div>
            {this.editRender()}
          </div>
        </div >
      )
    }


  }
}




export default ProfileDetail;