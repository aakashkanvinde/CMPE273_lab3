import React, { Component } from 'react';
import Navigation from '../LandingPage/Navigation';
import Header from '../LandingPage/Header';
import Cookies from 'js-cookie';
import cookie from 'react-cookies';
import axios from 'axios';
import InnerNavigation from '../LandingPage/InnerNavigation';
import './Courseinformation.css';

export class Courseinformation extends Component {
    constructor(props){
        super(props);
        // if (!Cookies.get('id')) {
        //   alert("Please login first.");
        //   this.props.history.push("/");
        // }
        this.state = {
            courseId: this.props.match.params.id,
            details:"",
            action:"",
            status:""
        }
        this.enrolledHandler = this.enrolledHandler.bind(this);
        this.waitlistedHandler = this.waitlistedHandler.bind(this);
        this.droppedHandler = this.droppedHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    enrolledHandler(){
      this.setState({
        action: "enroll"
      });
    }
    waitlistedHandler(){
      this.setState({
        action: "waitlist"
      });
    }
    droppedHandler(){
      this.setState({
        action: "drop"
      });
    }

    submitHandler = (event) => {
      event.preventDefault();
      const data = { action: this.state.action };
      axios.post(`http://localhost:3001/courses/${this.state.courseId}/home`,data)
      .then((response)=>{
        if(response.data.message==="success"){
          alert("Action completed.");
          this.props.history.index = 0;
          this.props.history.push("/courses");
        }
      });
    }

    componentDidMount(){
        axios.get(`http://localhost:3001/courses/${this.state.courseId}/home`)
        .then((response)=>{
            if(response.data.message==="error"){
              alert("Something went wrong!");
              this.prop.history.push("/courses");
            }
            else if(response.data.message==="success"){
              this.setState({
                details: response.data.data,
                status: response.data.status,
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

  render() {
    const isStudent = Cookies.get('role') === "Student";
    return (
      <div>
        <Navigation handleClickLogout = {this.handleLogout}/>
        <Header title={this.state.courseId} />
        <div className="pageContent">
            <div className="row courseInformation">
                <div className="col-2 innerNavigationColumn">
                    {(isStudent) ? (this.state.status === "enroll") ? <InnerNavigation courseId={this.state.courseId}/> : <span> </span> : <InnerNavigation courseId={this.state.courseId} />}
                </div>
                <div className="col-10 coursecolumn">
                  <h3 align="center" >{this.state.details.courseName}</h3><br/>
                    <table align="center" className="courseinformation">
                    <tbody>
                      <tr>
                        <td>Department</td>
                        <td>: {this.state.details.courseDepartment}</td>
                      </tr>
                      <tr>
                        <td className="courseDescription">Description</td>
                        <td>: {this.state.details.courseDescription}</td>
                      </tr>
                      <tr>
                        <td>Classroom</td>
                        <td>: {this.state.details.courseRoom}</td>
                      </tr>
                      <tr>
                        <td>Capacity</td>
                        <td>: {this.state.details.courseCapacity}</td>
                      </tr>
                      <tr>
                        <td>Waitlist</td>
                        <td>: {this.state.details.courseWaitlist}</td>
                      </tr>
                      <tr>
                        <td>Term</td>
                        <td>: {this.state.details.courseTerm}</td>
                      </tr>
                      {(isStudent) ? (this.state.status==="waitlist") ? <tr><td>Status</td><td> : Waitlisted</td></tr> : <tr></tr> :<tr></tr> }
                    </tbody>
                    </table>
                    <br/>

                    {(isStudent) ? 
                    (this.state.status === "none" ) ? 
                      <span>
                        <form className="courseInfoButton" onSubmit={this.submitHandler}>
                            <input align="center" type="submit" name="enrolled" value="Enroll" className="status btn btn-success" onClick={this.enrolledHandler} />&nbsp;
                            <input align="center" type="submit" name="waitlisted" value="Waitlist" className="status btn btn-danger" onClick={this.waitlistedHandler} />&nbsp;
                        </form>
                      </span> : 
                      <span>
                        <form onSubmit={this.submitHandler}>
                            <input align="center" type="submit" name="dropped" value="Drop" className="status btn btn-danger" onClick={this.droppedHandler} />
                        </form>
                      </span> : <span></span> }
                </div>
            </div>
        </div>
      </div>
    )
  }
}

// Export Courseinformation Component
export default Courseinformation;
