import React from 'react';


 


type userObject = {
  id: string;
  name: string;
  email: string;
  description: string;
  string_id: string;
  created_at: string;
  updated_at: string;
} 

interface ProfileProps {

}

interface ProfileState {
  user?: userObject;
}
 
class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    this.state = {
      user: {
        id: "",
        name: "",
        email: "",
        description: "",
        string_id: "",
        created_at: "",
        updated_at: "",
      } ,
    }
  }

  componentDidMount() {
    const userObj: userObject = JSON.parse(localStorage.getItem("user") || "{}");
    this.setState({
      user: userObj,
    });
  }

  render() {
    return (
      <div>
        {this.state.user?.name}
        {this.state.user?.description}
      </div >
    )
  }
}

 


export default Profile;