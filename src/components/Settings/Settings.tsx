import React from 'react';
import axios from '../Api';
import { RouteComponentProps } from 'react-router-dom'
import { getJwt } from '../../helpers/jwt';
import Dialog from '@material-ui/core/Dialog';
import Header from '../Header/Header';
import i18n from "../../helpers/i18n";




const Settings = (props: any) => {

  return (
    <div>
      This is Settings
    </div>
  )
};




const inlineStyles = {

};









// interface SettingsProps extends RouteComponentProps<{}>{

// }

// interface SettingsState {
//   isAccountDelete: boolean;
//   confirmToggle: boolean;
//   confirmPassword: string;
//   responseMessage: string;
// }

// class Settings extends React.Component<SettingsProps, SettingsState> {
//   constructor(props: SettingsProps) {
//     super(props);

//     this.state = {
//       isAccountDelete: false,
//       confirmToggle: false,
//       confirmPassword: '',
//       responseMessage: '',
//     }
//     document.title = i18n.t("settings.settings");
//   }

//   componentDidMount() {

//   }


//   submitAcccountDelete(e: any) {
//     e.preventDefault();
//     const jwt = getJwt();
//     const confirmPassword = this.state.confirmPassword;

//     if (confirmPassword.length === 0) {
//       this.setState({
//         responseMessage: i18n.t('settings.enterPassword'),
//       })
//       return
//     }


//     if (confirmPassword.length < 8) {
//       this.setState({
//         responseMessage: i18n.t('settings.passwordLength'),
//       })
//       return
//     }


//     axios.delete("/users?", { headers: { Authorization: `Bearer ${jwt}`, Country: process.env.REACT_APP_COUNTRY, confirmPassword: confirmPassword } })
//       .then((res: any) => {
//         this.setState({
//           responseMessage: i18n.t('settings.deletedAccount'),
//         })
//         if (typeof window !== 'undefined') {localStorage.clear()};
//         this.props.history.push("/login");
//       }).catch((res: any) => {
//         this.setState({
//           responseMessage: i18n.t('settings.failedToDelete'),
//         })
//       });
//   }

//   boolChange(e: any, field: string) {
//     e.preventDefault();
//     const value = eval('this.state.' + field);
//     this.setState({
//       [field]: !value,
//     } as unknown as SettingsState)

//   }

//   change(e: any, field: string) {
//     e.preventDefault();
//     this.setState({
//       [field]: e.target.value,
//     } as unknown as SettingsState)
//   }

//   openConfirm = (e: any) => {
//     e.preventDefault();
//     this.setState({
//       confirmToggle: true
//     })
//   }

//   closeConfirm = (e: any) => {
//     e.preventDefault();
//     this.setState({
//       confirmToggle: false,
//       responseMessage: '',
//       confirmPassword: ''
//     })
//   }

//   // renderPasswordChange = () => {
//   //   return (
//   //     <div>
//   //       <form>
//   //       <div style={{  margin: '10px'}}>
//   //         <input type='password' placeholder='現在のパスワード' style={{ width: '200px', padding: '5px' }}></input>
//   //       </div>
//   //       <div style={{  margin: '10px' }}>
//   //         <input type='password' placeholder='変更後のパスワード' style={{ width: '200px', padding: '5px' }}></input>
//   //       </div>
//   //       <div style={{  margin: '10px' }}>
//   //         <input type='password' placeholder='変更後のパスワード（確認用）' style={{ width: '200px', padding: '5px' }}></input>
//   //       </div>
//   //       <button>変更</button>
//   //       </form>
//   //     </div>
//   //   )
//   // }

//   renderAccountDelete = () => {

// // <form onSubmit={openConfirmationModal}
// //    // ... form
// // </ form>
//     return (
//       <div style={{ textAlign: 'center', margin: '10px' }}>
//         {i18n.t("settings.deleteDesc1")}<b style={{ color: 'red' }}>{i18n.t("settings.deleteDesc2")}</b>

//         <form style={{textAlign: 'center'}} onSubmit={e => this.openConfirm(e)}>
//           <button style={{ border: 'none', color: 'white', backgroundColor: 'red', marginTop: '10px', padding: '10px', borderRadius: '5px' }}><b>{i18n.t("settings.deleteAccount")}</b></button>
//         </form>

//         <Dialog  open={this.state.confirmToggle}>
//           <div style={{ marginTop: '10px', textAlign: 'center'}}>
//             {i18n.t("settings.confirmPassword")}
//             <form>
//               <input maxLength={32} required style={{ padding: '10px', margin: '5px'}} type="password" value={this.state.confirmPassword} onChange={e => this.change(e, 'confirmPassword')}></input>
//             </form>
//           </div>
//           <div style={{ fontSize: '20px', padding: '20px', margin: '5px' }}>{i18n.t("settings.confirmMessage")}</div>
//           <div style={{textAlign: 'center', marginBottom: '10px'}}>
//             <span>
//               <button style={{ border: 'none', borderRadius: '5px', color: 'white', backgroundColor: 'red', width: '100px', padding: '10px', marginRight: '50px' }} onClick={e => this.submitAcccountDelete(e)}>{i18n.t("settings.yes")}</button>
//           </span>
//           <span>
//               <button style={{ border: 'none', borderRadius: '5px', width: '100px', padding: '10px' }} onClick={e => this.closeConfirm(e)}>{i18n.t("settings.no")}</button>
//           </span>
//           <div style={{ color: 'red', padding: '10px'}}>
//             {this.state.responseMessage ? this.state.responseMessage : ''}
//           </div>
//           </div>
//           </Dialog>

//       </div>
//     )
//   }


//   render() {
//     return (
//       <div>
//         <Header></Header>
//       <div style={{ textAlign: 'center' }}>
//         <ul style={{ margin: '10px', padding: 0, textDecoration: "none"}}>

//           {/* <li style={{ textDecoration: "none" }}><h2>パスワード変更</h2></li>
//           {this.renderPasswordChange()} */}
//           {/* <li style={{ textDecoration: "none" }} onClick={e => this.boolChange(e, 'isAccountDelete')}><h2>{i18n.t("settings.deleteAccountNoun")}</h2></li>
//           <div style={{textAlign: 'center'}}>
//               {this.renderAccountDelete()}
//           </div> */}
          
//         </ul>
//         <div>
//           {/* {this.state.isAccountDelete ? this.renderAccountDelete() : ''} */}
//         </div>
//       </div>
//       </div>
//     )
//   }
// }




export default Settings;