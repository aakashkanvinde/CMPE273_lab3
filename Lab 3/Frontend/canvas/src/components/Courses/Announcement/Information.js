import React, { Component } from 'react';
import Navigation from '../../LandingPage/Navigation';
import Header from '../../LandingPage/Header';
import cookie from 'react-cookies';
import axios from 'axios';
import './Announcement.css';
import InnerNavigation from '../../LandingPage/InnerNavigation';

export class Information extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props.match.params.id,
      announcementName: this.props.match.params.name,
      announcementDescription: "",
      announcementTime: "",
    }
  }

  componentDidMount(){
    axios.get(`http://localhost:3001/courses/${this.state.courseId}/announcement/${this.state.announcementName}`)
    .then((response)=>{
      // console.log(result);

      if(response.message === 'success'){
        this.setState({
          announcementDescription: response.data.data.description,
          announcementTime: response.data.data.time,
        })
        console.log("Announcement Description: "+ this.state.announcementDescription);
    }else{
      console.log("Announcement Description: "+ this.state.announcementDescription);
      alert("Something went wrong from the backend");
    }
    });
  }

  handleLogout = () => {
    cookie.remove('login', {path : '/'});
    axios.post('http://localhost:3001/logout').then(response => {
        console.log('Status Code: ',response.status);
        if(response.status === 200){
            this.setState({
                authFlag : false
            })
            console.log("Congrats on Logout");
        }else{
            this.setState({
                authFlag: true
            })
        }
    });
}

  render() {
    let announcement = [];
    Object.assign(announcement,this.state.announcement);
    return (
      <div>
        <Navigation handleClickLogout = {this.handleLogout} />
        <Header title={this.state.courseId} />
        <div className="pageContent">
          <div className="row">
            <div className="col-2 innerNavigationColumn">
              <InnerNavigation courseId={this.state.courseId} />
            </div>
            <div className="col-10 coursecolumn">
              <h3>{this.state.announcementName}</h3><br />
              <p>{this.state.announcementTime}</p>
              <p>{this.state.announcementDescription}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Exporting Information Component
export default Information;
