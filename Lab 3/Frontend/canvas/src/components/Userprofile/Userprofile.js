import React, { Component } from 'react';
import Navigation from '../LandingPage/Navigation';
import Header from '../LandingPage/Header';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Userprofile.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

export class Userprofile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: "",
            id: Cookies.get('userId'),
            role: Cookies.get('role'),
        }
    }

    componentDidMount(){
        axios.get('http://localhost:3001/userprofile')
        .then((res) => {
          if(res.data.message==="error"){
            alert("Something went wrong!");
          }
          else if(res.data.message==="success"){
            this.setState({
              user: res.data.data
            });
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

    render(){
        // redirect based on successful create
        let redirectVar = null;
        if(!cookie.load('login')){
            redirectVar = <Redirect to = "/" />
        }
        return(
            <div>
              {redirectVar}
              <Navigation handleClickLogout = {this.handleLogout} />
              <Header title="Your Profile" />
              <div className="profilePageContent">
                <div className="row">
                  <div className="col-3 profilePageColumn">
                    {(this.state.user.profileImage === null || this.state.user.profileImage === "")
                      ? <img src="https://photos.gograph.com/thumbs/CSP/CSP992/male-profile-picture-vector-stock_k14386009.jpg" alt="someProfilePicture1" className="profilePicture" />
                      : <img src={this.state.user.profileImage} alt="someProfilePicture2" className="profilePicture" />}
                  </div>
                  <span className="verticalSeparator" />
                  <div className="col-6">
                    <br />
                    <h4>Profile Information</h4>
                    <table>
                      <tbody>
                        <tr>
                          <td>SJSU ID  </td>
                          <td>: {this.state.user.student_id}</td>
                        </tr>
                        <tr>
                          <td>Name  </td>
                          <td>: {this.state.user.name}</td>
                        </tr>
                        <tr>
                          <td>Email</td>
                          <td>: {this.state.user.email}</td>
                        </tr>
                      </tbody>
                    </table><br />
                    <h4>Personal Information</h4>
                    <table>
                      <tbody>
                        <tr>
                          <td>About</td>
                          <td>: {this.state.user.about}</td>
                        </tr>
                        <tr>
                          <td>Phone Number</td>
                          <td>: {this.state.user.phone}</td>
                        </tr>
                        <tr>
                          <td>City</td>
                          <td>: {this.state.user.city}</td>
                        </tr>
                        <tr>
                          <td>Country</td>
                          <td>: {this.state.user.country}</td>
                        </tr>
                        <tr>
                          <td>Company</td>
                          <td>: {this.state.user.company}</td>
                        </tr>
                        <tr>
                          <td>School</td>
                          <td>: {this.state.user.school}</td>
                        </tr>
                        <tr>
                          <td>Hometown</td>
                          <td>: {this.state.user.hometown}</td>
                        </tr>
                        <tr>
                          <td>Language</td>
                          <td>: {this.state.user.language}</td>
                        </tr>
                        <tr>
                          <td>Gender</td>
                          <td>: {this.state.user.gender}</td>
                        </tr>
                        <br />
                      </tbody>
                    </table>
                    <br />
                    <Link to="/userprofile/edit" ><button className="toEditbtn btn-info">Edit Profile</button></Link>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

// Export Userprofile Component
export default Userprofile;