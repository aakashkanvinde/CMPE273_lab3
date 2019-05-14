import React, { Component } from 'react';
import Navigation from '../LandingPage/Navigation';
import Header from '../LandingPage/Header';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Card from '../Cards/Card';
import './Courses.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

export class Courses extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: Cookies.get('userId'),
            role: Cookies.get('role'),
            courses: "",
        }
        // if (!Cookies.get('id')) {
        //     alert("Please login first.");
        //     this.props.history.push("/");
        // }
    }

    componentDidMount(){
        axios.get("http://localhost:3001/courses").then((res) => {
            if(res.status === 200){
                console.log("res.data.data: "+res.data.data);
                this.setState({
                    courses: res.data.data
                })
            }else{
                this.props.history.push('/')
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
            alert("Please Login first");
            redirectVar = <Redirect to = "/" />
        }
        let allCourses = [];
        // this.state.courses.map((index) => {});
        Object.assign(allCourses, this.state.courses);
        // allCourses.push(this.state.courses);
        console.log("allCourses: "+this.state.courses);
        const role = (this.state.role === 'Student');
        return(
            <div>
                {redirectVar}
                <Navigation handleClickLogout = {this.handleLogout} />
                <Header title="All Courses" />
                <div className="Content">
                    <div className="row allCourses"> 
                     {allCourses.map((course, index) => {
                      return <Card key={index} number={index} id={course.CourseId} name={course.CourseName} term={course.CourseTerm} />
                     })}
                    </div>
                        {/* <hr/> */}
                {/* { role ? <Link to="/courses/search"><button className="btn btn-primary">Courses Lookup</button> </Link> : <Link to="/courses/new"><button className="btn btn-success">Add Courses</button></Link> } */}
                    {role 
                    ? <Link to="/courses/search"><button className="courses btn btn-success">Search Course</button> </Link>
                    : <Link to="/courses/new"><button className="courses btn btn-success">Add Course</button></Link>}

                </div>
            </div>
        );

    }
}

//Export Component
export default Courses;