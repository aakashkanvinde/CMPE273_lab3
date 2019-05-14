import React, { Component } from 'react';
import Navigation from '../../LandingPage/Navigation';
import Header from '../../LandingPage/Header';
import cookie from 'react-cookies';
import InnerNavigation from '../../LandingPage/InnerNavigation';
import './Quiz.css'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';


export class Quiz extends Component {
  constructor(props) {
    super(props);
    // if (!Cookies.get('id')) {
    //   alert("Please login first.");
    //   this.props.history.push("/");
    // }
    this.state = {
      courseId: this.props.match.params.id,
      quizzes:""
    }
  }

  componentDidMount(){
    axios.get(`http://localhost:3001/courses/${this.state.courseId}/quiz`)
    .then((response)=>{
      if(response.data.message==="error"){
        alert("Something went wrong.");
        this.props.history.push(`http://localhost:3001/courses/${this.state.courseId}`);
      }
      else if(response.data.message==="success"){
        this.setState({
          quizzes: response.data.data
        })
      }
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
    let quizzes = [];
    Object.assign(quizzes, this.state.quizzes);
    return (
      <div>
        <Navigation handleClickLogout = {this.handleLogout} />
        <Header title={this.state.courseId} />
        <div className="pageContent">
          <div className="row quizRow">
            <div className="col-2 innerNavigationColumn"><InnerNavigation courseId={this.state.courseId} /></div>
            <div className="col-10 quizColumn">
              <h3>Quiz</h3><br/>
              <div>
                {quizzes.map((quiz,index)=>{
                  return <div className="quiztab" key={index}><Link to={`/courses/${this.state.courseId}/quiz/${quiz.quizId}`}>{quiz.quizId} - {quiz.quizName}</Link></div>
                })}
              </div>
              {(Cookies.get("role")==="Faculty")
              ?<Link to={`/courses/${this.state.courseId}/quiz/new`}><button className="btn btn-outline-primary quiz">New Quiz</button></Link>
              :null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Export Quiz Component
export default Quiz;
