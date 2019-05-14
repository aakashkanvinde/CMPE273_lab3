import React, { Component } from 'react';
import Navigation from '../LandingPage/Navigation';
import Header from '../LandingPage/Header';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
import './Addcourse.css';
import { graphql, compose } from 'react-apollo';
import { addCourse } from '../../mutation/mutations';

export class Addcourse extends Component {
    constructor(props){
        super(props);
        let uid=0;
        if(cookie.load("cookie")){
            uid=cookie.load("cookie").email;
        }
        this.state = {
            courseId: "",
            courseName: "",
            courseDepartment: "",
            courseDescription: "",
            courseRoom: "",
            courseCapacity: "",
            courseWaitlist: "",
            courseTerm: "",
            courseYear:new Date().getFullYear(),
            uid:uid
        }
        this.courseIdHandler = this.courseIdHandler.bind(this);
        this.courseNameHandler = this.courseNameHandler.bind(this);
        this.courseDepartmentHandler = this.courseDepartmentHandler.bind(this);
        this.courseDescriptionHandler = this.courseDescriptionHandler.bind(this);
        this.courseRoomHandler = this.courseRoomHandler.bind(this);
        this.courseCapacityHandler = this.courseCapacityHandler.bind(this);
        this.courseWaitlistHandler = this.courseWaitlistHandler.bind(this);
        this.courseTermHandler = this.courseTermHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    courseIdHandler = (event) =>{
        this.setState({
            courseId:event.target.value
        });
    }
    courseNameHandler = (event) =>{
        this.setState({
            courseName:event.target.value
        });
    }
    courseDepartmentHandler = (event) =>{
        this.setState({
            courseDepartment:event.target.value
        });
    }
    courseDescriptionHandler = (event) =>{
        this.setState({
            courseDescription:event.target.value
        });
    }
    courseRoomHandler = (event) =>{
        this.setState({
            courseRoom:event.target.value
        });
    }
    courseCapacityHandler = (event) =>{
        this.setState({
            courseCapacity:event.target.value
        });
    }
    courseWaitlistHandler = (event) =>{
        this.setState({
            courseWaitlist:event.target.value
        });
    }
    courseTermHandler = (event) =>{
        this.setState({
            courseTerm:event.target.value
        });
    }

    async submitHandler(e) {
        e.preventDefault();
        let {message,courseSem,courseYear,...rest}=this.state;
        let res=await this.props.addCourse({
            variables: {
                ...rest
            },
        });
        alert("course added successfully!")
        this.setState({
        courseId:"",
        courseName:"",
        courseDepartment:"",
        courseDescription:"",
        courseRoom:"",
        courseCapacity:0,
        waitlistCapacity:0,
        courseTerm:"",
        message:"",
        courseSem:"Spring"
        })
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
        <Navigation handleClickLogout = {this.handleLogout} />
        <Header title="My Courses" />
        <div className="pageContent">
          <div className="row">
          <div className="col-3 profilecolumn"></div>
            <div className="col-6 addCourse">
                <form onSubmit={this.submitHandler}>
                    <table className="coursestable">
                        <tbody>
                            <tr>
                                <td>Course ID</td>
                                <td>: <input type="text" name="courseId" onChange={this.courseIdHandler} required /></td>
                            </tr>
                            <tr>
                                <td>Course Name</td>
                                <td>: <input type="text" name="courseName" onChange={this.courseNameHandler} required /></td>
                            </tr>
                            <tr>
                                <td>Course Department</td>
                                <td>: <input type="text" name="courseDepartment" onChange={this.courseDepartmentHandler} required /></td>
                            </tr>
                            <tr>
                                <td>Course Description</td>
                                <td>&nbsp;&nbsp;<textarea rows="5" cols="30" name="courseDescription" onChange={this.courseDescriptionHandler} required /></td>
                            </tr>
                            <tr>
                                <td>Course Room</td>
                                <td>: <input type="text" name="courseRoom" onChange={this.courseRoomHandler} required /></td>
                            </tr>
                            <tr>
                                <td>Course Capacity</td>
                                <td>: <input type="text" name="courseCapacity" onChange={this.courseCapacityHandler} pattern="\d+" title="Enter a valid number." required /></td>
                            </tr>
                            <tr>
                                <td>Waitlist Capacity</td>
                                <td>: <input type="text" name="courseWaitlist" onChange={this.courseWaitlistHandler} pattern="\d+" title="Enter a valid number." required /></td>
                            </tr>
                            <tr>
                                <td>Course Term</td>
                                <td>: <input type="text" name="courseTerm" onChange={this.courseTermHandler} required /></td>
                            </tr>
                            <tr><td><br/></td></tr>
                            <tr>
                                <td></td>
                                <td><input type="submit" className="btn btn-success" value="Add Course" />
                                &nbsp;<Link to="/courses"><button className="btn btn-danger">Cancel</button></Link></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Export Addcourse Component
export default compose(
    graphql(addCourse, { name: "addCourse" })
)(Addcourse);