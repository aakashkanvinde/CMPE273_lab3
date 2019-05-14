import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navigation from '../../LandingPage/Navigation';
import Header from '../../LandingPage/Header';
import Courses from '../Courses';
import { Link } from 'react-router-dom';
import './Announcement.css';
import Cookies from 'js-cookie';
import InnerNavigation from '../../LandingPage/InnerNavigation';

export class Announcement extends Component{
    constructor(props){
        super(props);
        // defining state
        this.state = {
            courseId: this.props.match.params.id,
            announcement: "",
        }
    }

    componentDidMount(){
        axios.get(`http://localhost:3001/courses/${this.state.courseId}/announcement`)
        .then((response)=>{
          console.log(response);
          if(response.data.message==="success"){
              console.log("Announcements displayed successfully.");
              this.setState({
                announcement: response.data.data,
              })
              // this.props.history.push('/courses');
          }
          else if(response.data.message==="error"){
              alert("Something went wrong!")
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
        let announcement = [];
        Object.assign(announcement,this.state.announcement);
        return(
            <div>
              {redirectVar}
              <Navigation handleClickLogout = {this.handleLogout}/>
              <Header title={this.state.courseId} />
              <div className="pageContent">
                <div className="row announcementRow">
                  <div className="col-2 innerNavigationColumn">
                    <InnerNavigation courseId={this.state.courseId} />
                  </div>
                  <div className="col-10 announcementcolumn">
                    <h3>Announcements</h3><br />
                    <div>
                        {announcement.map((announcement,index)=> {
                        return <div key={index} className="allAnnouncements">
                        <Link to={`/courses/${this.state.courseId}/announcement/${announcement.name}`}>
                            <span className="announcementTitle">
                                {announcement.name}
                            </span>
                        </Link>
                            <span className="announcementTime">
                                {announcement.time}
                            </span>
                        <br/>
                        {announcement.description.substring(0,100)+"..."}
                        </div>
                        })}
                    </div>
                    { (Cookies.get('role')==="Faculty") ? <Link to={`/courses/${this.state.courseId}/announcement/new`}><button className="announcement btn btn-outline-info">New Announcement</button></Link> : null }
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

// Export Announcement Component
export default Announcement;