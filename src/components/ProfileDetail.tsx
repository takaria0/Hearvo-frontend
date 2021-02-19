import React, { useState, useEffect } from 'react';
import axios from './Api';
import * as styles from '../css/Home.module.css';
import { Button, Input } from '@material-ui/core';
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';
import Header from './Header';
import SideBar from './SideBar';
import Feed from './Feed/Feed';
import TopicFollowButton from './TopicFollowButton';
import i18n from "../helpers/i18n";
import { spawn } from 'child_process';
import PersonIcon from '@material-ui/icons/Person';
import PostAddIcon from '@material-ui/icons/PostAdd';
// 0 -> male
// 1 -> female
// 2 -> others
const genderIntToString = (num: number | undefined) => {
  switch(num) {
    case 0:
      return i18n.t("eachPost.male")
      break;
    case 1:
      return i18n.t("eachPost.female")
      break;
    case 2:
      return i18n.t("eachPost.other")
      break;
    
    default:
      return ""
      break;
  }
}



// type userObject = {
//   id: string;
//   name: string;
//   email: string;
//   description: string;
//   string_id: string;
//   gender: number;
//   age: string;
//   created_at: string;
//   updated_at: string;
//   occupation: string;
//   birth_year: string;
// }

// interface ProfileDetailProps {

// }

// interface ProfileDetailState {
//   edit?: boolean;
//   user?: userObject;
//   editDescription: string;
//   editGender: string;
//   editAge: string;
//   editOccupation: string;
//   editSuccess: boolean;
//   editBirthYear: string;
//   handleMessage: string;
// }

// class ProfileDetail extends React.Component<ProfileDetailProps, ProfileDetailState> {
//   constructor(props: ProfileDetailProps) {
//     super(props);

//     const userObj: userObject = JSON.parse(localStorage.getItem("user") || "{}");
//     this.state = {
//       edit: false,
//       user: userObj,
//       editDescription: "",
//       editGender: "",
//       editAge: "",
//       editBirthYear: "",
//       editOccupation: "",
//       editSuccess: false,
//       handleMessage: "",
//     }
//     document.title = "Profile";
//   }

//   componentDidMount() {

//   }

//   occupationForm = () => {
//     return (
//       <div>
//         <select name="job" onChange={e => this.change(e, "editOccupation")}> 
//           <option value="">選択してください</option>
//           <option value="公務員">公務員</option>
//           <option value="経営者・役員">経営者・役員</option>
//           <option value="会社員">会社員</option>
//           <option value="自営業">自営業</option>
//           <option value="自由業">自由業</option>
//           <option value="専業主婦">専業主婦</option>
//           <option value="パート・アルバイト">パート・アルバイト</option>
//           <option value="学生">学生</option>
//           <option value="その他">その他</option>
//         </select>
//       </div>
//     )
//   }

//   birthDayForm = () => {
//     const currentYear = new Date().getUTCFullYear();
//     let yearOption = [];
//     for (let year = currentYear - 120; year < currentYear; year++) {
//       yearOption.push(
//         (<option value={year}>{year}</option>)
//       )
//     }
//     yearOption = yearOption.reverse();
//     return (
//       <div>
//         {/* <label htmlFor="dob-day" >生年</label> */}
//         <div>
//           <select name="dob-year" id="dob-year" onChange={e => this.change(e, "editBirthYear")}>
//             <option value="">年</option>
//             {yearOption}
//           </select>
//         </div>
//       </div>
//     )
//   }

//   submit(e: any) {
//     e.preventDefault();

//     if(this.state.editGender.length === 0) {
//       this.setState({
//         handleMessage: '性別を選択してください'
//       })
//       return
//     }

//     if (this.state.editBirthYear.length === 0) {
//       this.setState({
//         handleMessage: '生年を選択してください'
//       })
//       return
//     }

//     // if (this.state.editOccupation.length === 0) {
//     //   this.setState({
//     //     handleMessage: '職業を選択してください'
//     //   })
//     //   return
//     // }


//     const postObj = {
//       // description: this.state.editDescription,
//       gender: this.state.editGender,
//       birth_year: this.state.editBirthYear,
//       // occupation: this.state.editOccupation,
//     }
//     const jwt = getJwt();

//     axios.put("/users", postObj, { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
//       .then((res: any) => {

//         this.setState({
//           user: res.data,
//           editSuccess: true,
//         })
//         localStorage.setItem('user', JSON.stringify(res.data))
//       }).catch((res: any) => {

//       });
//   }

//   change(e: any, field: string) {
//     e.preventDefault();
//     this.setState({
//       [field]: e.target.value,
//     } as unknown as ProfileDetailState)

//   }

//   click(e: any, value: boolean) {
//     e.preventDefault();

//     this.setState({
//       edit: value,
//     })
//   }


//   editRender() {
//     const baseJSX = (
//       <div>
//         <form onSubmit={e => this.submit(e)}>
//         <ul>
//           <li className={styles.li}>
//             ユーザーネーム: {this.state.user?.name}
//           </li>
//           <li className={styles.li}>
//             メールアドレス: {this.state.user?.email}
//           </li>
//           {/* <li className={styles.li}>
//               説明: {this.state.user?.description}
//               <div>
//                 <br></br>
//                 <textarea  rows={3} style={{width: "90%"}}  maxLength={250} placeholder={this.state.user?.description} onChange={e => this.change(e, "editDescription")}></textarea >
//               </div>
//           </li> */}

//           <li className={styles.li}>
//               性別: {genderIntToString(this.state.user?.gender)}
//               <div>
//                 <br></br>
//                 <select onChange={e => this.change(e, "editGender")}>
//                   <option value="">性別</option>
//                   <option value="1">女性</option>
//                   <option value="0">男性</option>
//                   <option value="2">どちらでもない</option>
//                 </select>
//               </div>
//           </li>
//           <li className={styles.li}>
//               生年: {this.state.user?.birth_year}年生まれ
//               <div>
//                 <br></br>
//                 {this.birthDayForm()}
//               </div>
//           </li>
// {/* 
//           <li className={styles.li}>
//               職業: {this.state.user?.occupation}
//               <div>
//                 <br></br>
//                 {this.occupationForm()}
//               </div>
//           </li> */}
          
//         </ul>
//           <Button type="submit" variant="contained" value="Submit" color="primary">保存</Button>
//         </form>
//         <div style={{color: 'red'}}>
//           {this.state.handleMessage ? this.state.handleMessage : ''}
//         </div>
//       </div>
//     );

//     const editbeforeJSX = (
//       <div>
//       </div>
//     );

//     const editAfterJSX = (
//       <div>
//         <h1>
//           保存しました
//         </h1>
//       </div>
//     );
//     if(this.state.editSuccess === false) {
//       return (
//         <div>
//           {baseJSX}
//           {editbeforeJSX}
//         </div>
//       )
//     } else {
//       return (
//         <div>
//           {baseJSX}
//           {editAfterJSX}
//         </div>
//       )
//     }

//   }

//   viewRender() {
//     return (
//       <div>
//         <ul>
//           <li className={styles.li}>
//             ユーザーネーム: {this.state.user?.name}
//           </li>
//           {/* <li className={styles.li}>
//             メールアドレス: {this.state.user?.email}
//           </li> */}
//           {/* <li className={styles.li}>
//             説明: {this.state.user?.description}
//           </li> */}
//           <li className={styles.li}>
//             性別: {genderIntToString(this.state.user?.gender)}
//           </li>
//           <li className={styles.li}>
//             年齢: {this.state.user?.birth_year}年生まれ
//           </li>
//           {/* <li className={styles.li}>
//             職業: {this.state.user?.occupation}
//           </li> */}
//         </ul>
//       </div>
//     )
//   }

//   render() {

//     if(this.state.edit === false) {
//       return (
//         <div>
//           <Header></Header>
//         <div className={styles.body}>
//           <div className={styles.profile_body}>

          
//           <h1>プロフィール</h1>
//           {/* <div>
//             <Button onClick={e => this.click(e, true)}>編集する</Button>
//           </div> */}
//           <div>
//             {this.viewRender()}
//           </div>
//           </div>
//           </div></div>
//       )
//     } else {
//       return (
//         <div>
//           <Header></Header>
//         <div className={styles.body}>
//           <div className={styles.profile_body}>
//           <h1>プロフィール</h1>
//           <div>
//             <Button onClick={e => this.click(e, false)}>表示する</Button>
//           </div>
//           <div>
//             {this.editRender()}
//           </div>
//           </div>
//         </div >
//         </div>
//       )
//     }


//   }
// }


const FollowingTopicList = (props: any) => {
  const jwt = getJwt();
  const [topicList, setTopicList] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/topics/users", { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
      .then(res => {
        setTopicList(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      })
  }, []);

  if(isLoading) {return (<span></span>)}

  return (
    <div>
      {topicList.map((topic: any) => {
        return (
          <div style={{ padding: 10, border: 'solid', borderRadius: 5, borderWidth: 1, backgroundColor: 'white', marginTop: 5 }}>
          <div >
            <span>
            <Link style={{textDecoration: 'none'}} to={`/topic?tp=${topic.topic}`}>{topic.topic}</Link>
            </span>
              <span style={{ textAlign: 'right', float: 'right' }}>
                <TopicFollowButton topicWord={topic.topic}></TopicFollowButton>
              </span>

            <div>
                <PostAddIcon style={{ fontSize: 16 }} />{topic.num_of_posts} &nbsp;&nbsp; 
                <PersonIcon style={{ fontSize: 16 }} />{topic.num_of_users} 
            </div>

          </div>
          
          </div>
        )
      })}
    </div>
  )
};


const ProfileDetail = (props: any) => {
  const jwt = getJwt();
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const keywordArray = window.location.pathname.split("/");


  useEffect(() => {
    axios.get("/users?profile_detail=true", { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY } })
    .then(res => {
      setUser(res.data);
      setIsLoading(false);
    })
    .catch(err => {
      setIsLoading(false);
    })
  }, []);

  if (isLoading) { return (<span><Header></Header>
    <div className={styles.body}>
      <div className={styles.feed}></div>
      <div className={styles.side_bar}><SideBar></SideBar></div></div>
  </span>) }

  return (
    <div>
      <Header></Header>
      <div className={styles.body}>
        <div className={styles.feed}>
          <h2>{user.name}</h2>

          <span><Link style={{ textDecoration: 'none' }} to="/profile/following">{i18n.t("profile.following")} {user.num_of_following_topics}</Link></span>&nbsp;&nbsp;&nbsp;
          
          <span><Link style={{ textDecoration: 'none' }} to="/profile/voted">{i18n.t("profile.numOfVotes")} {user.num_of_votes}</Link></span>

          <div style={{ float: 'right', textAlign: 'right' }}><small>{i18n.t("profile.joined")} {user.created_at.slice(0, 10)}</small></div>
          <div style={{ marginTop:10, border: 'solid', borderWidth: 1, paddingTop: 10, paddingBottom: 10, display: 'flex', justifyContent: 'space-evenly'}}>
            <span>
              <Link style={{ textDecoration: 'none' }} to="/profile/voted">{i18n.t("profile.voteRecord")}</Link>
            </span>&nbsp;
            <span>
              <Link style={{ textDecoration: 'none' }} to="/profile/myposts">{i18n.t("profile.myPost")}</Link>
            </span>
          </div>
          <div>
            {keywordArray.includes("following") ?
              <FollowingTopicList></FollowingTopicList>
             : 
             <Feed isLogin={true} keyword={'myposts'} isPosted={false} isPostedHandeler={null}></Feed>}
            
          </div>
        </div>

        <div className={styles.side_bar}>
          <SideBar></SideBar>
        </div>
      </div>
    </div>
  )
}



export default ProfileDetail;