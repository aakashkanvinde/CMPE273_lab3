import React, { Component } from 'react';
import Navigation from '../../LandingPage/Navigation';
import Header from '../../LandingPage/Header';
import Cookies from 'js-cookie';
import cookie from 'react-cookies';
import InnerNavigation from '../../LandingPage/InnerNavigation';
import axios from 'axios';
import './Grades.css';

export class Grades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props.match.params.id,
      quizGrades:""
    }
  }

  componentDidMount(){
    axios.get(`http://localhost:3001/courses/${this.state.courseId}/grades`)
    .then((response)=>{
      this.setState({
        quizGrades: response.data.quiz,
      })
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
    let quizGrades = [];
    Object.assign(quizGrades, this.state.quizGrades);
    const isStudent = Cookies.get("role")==="Student";
    return (
      <div>
        <Navigation handleClickLogout = {this.handleLogout}  />
        <Header title={this.state.courseId} />
        <div className="pageContent">
          <div className="row gradesRow">
            <div className="col-2 innerNavigationColumn">
              <InnerNavigation courseId={this.state.courseId} />
            </div>
            <div className="col-10 gradescolumn">
              <h3>Grades</h3><br/>
              <h5>Quiz</h5>
              {quizGrades.map((q, index)=>{
                // return <div key={index}>{q.sid} {q.name} {q.qname} {q.grade}<hr/></div>
                return <table key="index" className="quizGradeTable"><tbody><tr>
                    {(!isStudent) ? <td className="quizGradeTable1">{q.studentId}</td> :null }
                    {(!isStudent) ? <td className="quizGradeTable2">{q.name}</td> :null }
                    <td className="quizGradeTable3">{q.quizName}</td>
                    <td className="quizGradeTable4">{q.grades}/2</td>
                  </tr></tbody></table>
              })}<br/>
              <h5>Assignments</h5>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Export Grades Component
export default Grades;
