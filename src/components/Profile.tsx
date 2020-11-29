import React from 'react';
import * as styles from '../css/Header.module.css';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { withRouter, RouteComponentProps, Link, Redirect } from 'react-router-dom'
import { getJwt } from '../helpers/jwt';
import axios from './Api';
import ListIcon from '@material-ui/icons/List';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';

type userObject = {
  id: string;
  name: string;
  email: string;
  description: string;
  string_id: string;
  created_at: string;
  updated_at: string;
} 

interface ProfileProps extends RouteComponentProps<{}> {

}

interface ProfileState {
  user?: userObject;
  anchorEl: any;
  isLogin: boolean;
  isLoaded: boolean;
  searchValue: string;
}
 
class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    const userObj: userObject = JSON.parse(localStorage.getItem("user") || "{}");
    this.state = {
      user: userObj,
      anchorEl: 0,
      isLogin: false,
      isLoaded: false,
      searchValue: "",
    }
    
  }
  searchSubmit = (e: any) => {
    e.preventDefault();
    // console.log("SEARCH: window.location.pathname", window.location.pathname)
    if (this.state.searchValue !== "" && window.location.pathname !== "/search") {
      // console.log("this.state.searchValue", this.state.searchValue)
      const searchWord = this.state.searchValue;
      // console.log("searchWord Submit", searchWord)
      this.props.history.push({
        pathname: '/search',
        search: `?q=${searchWord}`
      })
      this.setState({ searchValue: "" });
    }

    if (window.location.pathname === "/search") {
      // console.log("SEARCH: matches");
      const searchWord = this.state.searchValue;
      // console.log("searchWord Submit", searchWord)
      this.props.history.push({
        pathname: '/search',
        search: `?q=${searchWord}`
      })
      this.setState({ searchValue: "" });
    }
  }

  searchChange = (e: any) => {
    this.setState(
      { searchValue: e.target.value }
    )
  }

  componentDidMount = () => {
    const jwt = getJwt();
    axios.get(`/users`, { headers: { Authorization: `Bearer ${jwt}` } }).then((res: any) => {
      this.setState({
        isLogin: true,
        isLoaded: true
      });
    }).catch((err: any) => {
      this.setState({
        isLogin: false,
        isLoaded: true
      });
    })
  }

  handleClick = (event: any) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  };

  handleClose = (e: any, val: any) => {

    this.setState({
      anchorEl: 0
    })

    if(val === "/login") {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      this.props.history.push(`${val}`);
      return
    }

    if (val !== "none") {
      this.props.history.push(`${val}`);
      return
    }
  };

  searchBar = () => {
    return (
      <form style={{ display: "inline" }} onSubmit={e => this.searchSubmit(e)}>

        <input type="text" className={styles.search_bar} value={this.state.searchValue} onChange={e => this.searchChange(e)} placeholder="検索"
        ></input>
        <IconButton type="submit">
          <SearchIcon style={{ fontSize: 16, display: "none" }}></SearchIcon>
        </IconButton>

      </form>
    )
  }

  listBar = () => {
    return (
      <b>
      {
        this.state.isLogin
          ?
          <b><Button className={styles.profile} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
            <ListIcon ></ListIcon>
            {/* プロフィール */}
          </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={e => this.handleClose(e, "none")}
            >
              <MenuItem onClick={e => this.handleClose(e, "/profile")}>{this.state.user?.name}</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/profile/feed/myposts")}>自分の投稿</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/profile/feed/voted")}>投票した投稿</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/")}>利用規約</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/")}>プライバシーポリシー</MenuItem>
                <MenuItem onClick={e => this.handleClose(e, "/settings")}>設定</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/login")}>ログアウト</MenuItem>
            </Menu>
          </b>
          :
            <b><Button className={styles.profile} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
            <ListIcon ></ListIcon>
          </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={e => this.handleClose(e, "none")}
            >
              <MenuItem onClick={e => this.handleClose(e, "/")}>利用規約</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/")}>プライバシーポリシー</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/login")}>ログイン</MenuItem>
              <MenuItem onClick={e => this.handleClose(e, "/signup")}>アカウント作成</MenuItem>
            </Menu>
          </b>
          // <Link to='/login' className={styles.profile}>ログイン</Link>
      }
      </b>
    )
  }

  beforeLoginListbar = () => {
    return (
      <b><Button className={styles.profile} aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
        <ListIcon ></ListIcon>
        {/* プロフィール */}
      </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={e => this.handleClose(e, "none")}
        >
        </Menu>
      </b>
    )
  }

  render() {

    return (
      <div style={{textAlign: "left"}}>
        <br></br>
          {/* <MenuItem component={Link} to={'/'}>Hearbo</MenuItem> */}

        <Link to="/" className={styles.hearvo} ><b style={{ fontSize: 20, marginLeft: 10, marginTop: 20 }}>Hearvo</b></Link><span>&nbsp;&nbsp;&nbsp;</span><small className={styles.remark} >your voice must be heard</small>

        <span style={{ float: "right", marginRight: 10, marginLeft: 10 }} >
          {this.searchBar()}
          {this.state.isLoaded ? this.listBar() : this.beforeLoginListbar() }
          <b>
            </b>  

        </span>


        <br></br><br></br>
      </div>
    )
  }
}

 


export default withRouter(Profile);