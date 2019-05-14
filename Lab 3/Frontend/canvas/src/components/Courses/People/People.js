import React, { Component } from 'react';
import Navigation from '../../LandingPage/Navigation';
import Header from '../../LandingPage/Header';
import cookie from 'react-cookies';
import InnerNavigation from '../../LandingPage/InnerNavigation';
import axios from 'axios';
import Person from './Person';
import './People.css'

export class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props.match.params.id,
      people:"",
    }
  }

  componentDidMount(){
    axios.get(`http://localhost:3001/courses/${this.state.courseId}/people`)
    .then((result)=>{
      if(result.data.message==="error"){
        alert("Something went wrong.");
      }
      else if(result.data.message==="success"){
        this.setState({
          people: result.data.people,
        })
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
    let people = [];
    Object.assign(people,this.state.people);
    return (
      <div>
        <Navigation handleClickLogout = {this.handleLogout}/>
        <Header title={this.state.courseId} />
        <div className="pageContent">
            <div className="row peopleRow">
                <div className="col-2 innerNavigationColumn"><InnerNavigation courseId={this.state.courseId}/></div>
                <div className="col-10 peopleColumn">
                  <h3>People</h3><br/>
                  {
                    people.map((person,index)=>{
                      return <Person key={index} personId={person.student_id} personImage={person.profileImage} personName={person.name} personStatus={person.enrollmentStatus} courseId={this.state.courseId}/>
                    })
                  }
                </div>
            </div>
        </div>
      </div>
    )
  }
}

// Exporting People Component
export default People;
