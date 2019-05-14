import React, { Component } from 'react';
import Navigation from '../../LandingPage/Navigation';
import Header from '../../LandingPage/Header';
import cookie from 'react-cookies';
import axios from 'axios';
import './Assignment.css'
import InnerNavigation from '../../LandingPage/InnerNavigation';

export class Assignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props.match.params.id,
    }
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
    return (
      <div>
        <Navigation handleClickLogout = {this.handleLogout}/>
        <Header title={this.state.courseId} />
        <div className="pageContent">
          <div className="row assignmentInformation">
            <div className="col-2 innerNavigationColumn"><InnerNavigation courseId={this.state.courseId} /></div>
            <div className="col-10 coursecolumn">
              <h3>Assignment</h3><br />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Export Assignment Component
export default Assignment;
