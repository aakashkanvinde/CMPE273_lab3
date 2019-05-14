import React, { Component } from 'react';
import Navigation from '../LandingPage/Navigation';
import Header from '../LandingPage/Header';
import Card from '../Cards/Card';
import axios from 'axios';
import cookie from 'react-cookies';
import './Searchcourses.css';

export class Searchcourses extends Component {
    constructor(props){
        super(props);
        this.state = {
            search: "",
            courses: {}
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }

    searchChangeHandler = (event) => {
        this.setState({
            search: event.target.value
        })
    }

    componentDidMount(){
        axios.get("http://localhost:3001/courses/search")
        .then((response)=>{
            this.setState({
                courses: response.data.courses
            });
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
    let allCourses = [];
    Object.assign(allCourses, this.state.courses);

    return (
      <div>
        <Navigation handleClickLogout = {this.handleLogout}/>
        <Header title="Course Catalog" />
        <div className="pageContent">
          <div className="row searchcourses">
            <input type="text" name="search" className="searchinput" placeholder="Search any course by ID or Name" onChange={this.searchChangeHandler}/>
            <br></br>
            <div className="row displayCourses">
                {allCourses.map((course,index)=>{
                    return (course.courseName.toLowerCase().includes(this.state.search.toLowerCase())) || (course.courseId.toLowerCase().includes(this.state.search.toLowerCase()) || (course.courseTerm.toLowerCase().includes(this.state.search.toLowerCase()))) ?<Card key={index} number={index} id={course.courseId} name={course.courseName} term={course.courseTerm} /> : <span key={index}/>
                })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Export Searchcourses Component
export default Searchcourses;
