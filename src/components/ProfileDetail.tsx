import React from 'react';
import axios from './Api';
import * as styles from '../css/ProfileDetail.module.css';
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
  birth_year: string;
}

interface ProfileDetailProps {

}

interface ProfileDetailState {
  edit?: boolean;
  user?: userObject;
  editDescription: string;
  editGender: string;
  editAge: string;
  editOccupation: string;
  editSuccess: boolean;
  editBirthYear: string;
  handleMessage: string;
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
      editBirthYear: "",
      editOccupation: "",
      editSuccess: false,
      handleMessage: "",
    }
    document.title = "Profile";
  }

  componentDidMount() {

  }

  occupationForm = () => {
    return (
      <div>
        <select name="job" onChange={e => this.change(e, "editOccupation")}> 
          <option value="">選択してください</option>
          <option value="公務員">公務員</option>
          <option value="経営者・役員">経営者・役員</option>
          <option value="会社員">会社員</option>
          <option value="自営業">自営業</option>
          <option value="自由業">自由業</option>
          <option value="専業主婦">専業主婦</option>
          <option value="パート・アルバイト">パート・アルバイト</option>
          <option value="学生">学生</option>
          <option value="その他">その他</option>
        </select>
      </div>
    )
  }

  birthDayForm = () => {
    const currentYear = new Date().getUTCFullYear();
    let yearOption = [];
    for (let year = currentYear - 120; year < currentYear; year++) {
      yearOption.push(
        (<option value={year}>{year}</option>)
      )
    }
    yearOption = yearOption.reverse();
    return (
      <div>
        {/* <label htmlFor="dob-day" >生年</label> */}
        <div>
          <select name="dob-year" id="dob-year" onChange={e => this.change(e, "editBirthYear")}>
            <option value="">年</option>
            {yearOption}
          </select>
        </div>
      </div>
    )
  }

  submit(e: any) {
    e.preventDefault();

    if(this.state.editGender.length === 0) {
      this.setState({
        handleMessage: '性別を選択してください'
      })
      return
    }

    if (this.state.editBirthYear.length === 0) {
      this.setState({
        handleMessage: '生年を選択してください'
      })
      return
    }

    if (this.state.editOccupation.length === 0) {
      this.setState({
        handleMessage: '職業を選択してください'
      })
      return
    }


    const postObj = {
      description: this.state.editDescription,
      gender: this.state.editGender,
      birth_year: this.state.editBirthYear,
      occupation: this.state.editOccupation,
    }
    const jwt = getJwt();

    axios.put("/users", postObj, { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res: any) => {

        this.setState({
          user: res.data,
          editSuccess: true,
        })
        localStorage.setItem('user', JSON.stringify(res.data))
      }).catch((res: any) => {

      });
  }

  change(e: any, field: string) {
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
          <li className={styles.li}>
            ユーザーネーム: {this.state.user?.name}
          </li>
          <li className={styles.li}>
            メールアドレス: {this.state.user?.email}
          </li>
          <li className={styles.li}>
              説明: {this.state.user?.description}
              <div>
                <br></br>
                <textarea  rows={3} style={{width: "90%"}}  maxLength={250} placeholder={this.state.user?.description} onChange={e => this.change(e, "editDescription")}></textarea >
              </div>
          </li>

          <li className={styles.li}>
              性別: {this.state.user?.gender}
              <div>
                <br></br>
                <select onChange={e => this.change(e, "editGender")}>
                  <option value="">性別</option>
                  <option value="女性">女性</option>
                  <option value="男性">男性</option>
                  <option value="どちらでもない">どちらでもない</option>
                </select>
              </div>
          </li>
          <li className={styles.li}>
              生年: {this.state.user?.birth_year}年生まれ
              <div>
                <br></br>
                {this.birthDayForm()}
                {/* <input min="1" max="130" type="number" placeholder={this.state.user?.birth_year} onChange={e => this.change(e, "editAge")}></input> */}
              </div>
          </li>
          <li className={styles.li}>
              職業: {this.state.user?.occupation}
              <div>
                <br></br>
                {this.occupationForm()}
                {/* <input type="string" maxLength={30} placeholder={this.state.user?.occupation} onChange={e => this.change(e, "editOccupation")}></input> */}
              </div>

          </li>
        </ul>
          <Button type="submit" variant="contained" value="Submit" color="primary">保存</Button>
        </form>
        <div style={{color: 'red'}}>
          {this.state.handleMessage ? this.state.handleMessage : ''}
        </div>
      </div>
    );

    const editbeforeJSX = (
      <div>
      </div>
    );

    const editAfterJSX = (
      <div>
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
          <li className={styles.li}>
            ユーザーネーム: {this.state.user?.name}
          </li>
          <li className={styles.li}>
            メールアドレス: {this.state.user?.email}
          </li>
          <li className={styles.li}>
            説明: {this.state.user?.description}
          </li>
          <li className={styles.li}>
            性別: {this.state.user?.gender}
          </li>
          <li className={styles.li}>
            年齢: {this.state.user?.birth_year}年生まれ
          </li>
          <li className={styles.li}>
            職業: {this.state.user?.occupation}
          </li>
        </ul>
      </div>
    )
  }

  render() {

    if(this.state.edit === false) {
      return (
        <div className={styles.body}>
          <div className={styles.profile_body}>

          
          <h1>プロフィール</h1>
          <div>
            <Button onClick={e => this.click(e, true)}>編集する</Button>
          </div>
          <div>
            {this.viewRender()}
          </div>
          </div>
        </div>
      )
    } else {
      return (

        <div className={styles.body}>
          <div className={styles.profile_body}>
          <h1>プロフィール</h1>
          <div>
            <Button onClick={e => this.click(e, false)}>表示する</Button>
          </div>
          <div>
            {this.editRender()}
          </div>
          </div>
        </div >
      )
    }


  }
}




export default ProfileDetail;