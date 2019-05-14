import React, { Component } from 'react';
import Navigation from '../../LandingPage/Navigation';
import Header from '../../LandingPage/Header';
import cookie from 'react-cookies';
import InnerNavigation from '../../LandingPage/InnerNavigation';
import axios from 'axios';
import './NewQuiz.css'

export class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props.match.params.id,
      quizId:"",
      quizName:"",
      question1: "",
      option11: "",
      option12: "",
      option13: "",
      option14: "",
      correctoption1: "",
      question2: "",
      option21: "",
      option22: "",
      option23: "",
      option24: "",
      correctoption2: "",
      date1: "",
      date2: ""
    }

    this.quizIdHandler = this.quizIdHandler.bind(this);
    this.quizNameHandler = this.quizNameHandler.bind(this);
    this.question1Handler = this.question1Handler.bind(this);
    this.option11Handler = this.option11Handler.bind(this);
    this.option12Handler = this.option12Handler.bind(this);
    this.option13Handler = this.option13Handler.bind(this);
    this.option14Handler = this.option14Handler.bind(this);
    this.correctoption1Handler = this.correctoption1Handler.bind(this);
    this.question2Handler = this.question2Handler.bind(this);
    this.option21Handler = this.option21Handler.bind(this);
    this.option22Handler = this.option22Handler.bind(this);
    this.option23Handler = this.option23Handler.bind(this);
    this.option24Handler = this.option24Handler.bind(this);
    this.correctoption2Handler = this.correctoption2Handler.bind(this);
    this.date1Handler = this.date1Handler.bind(this);
    this.date2Handler = this.date2Handler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  quizIdHandler = (event)=>{
    this.setState({
        quizId: event.target.value
    })
  }
  quizNameHandler = (event)=>{
    this.setState({
        quizName: event.target.value
    })
  }
  question1Handler = (event)=>{
      this.setState({
          question1: event.target.value
      })
  }
  option11Handler = (event)=>{
      this.setState({
          option11: event.target.value
      })
  }
  option12Handler = (event)=>{
      this.setState({
          option12: event.target.value
      })
  }
  option13Handler = (event)=>{
      this.setState({
          option13: event.target.value
      })
  }
  option14Handler = (event)=>{
      this.setState({
          option14: event.target.value
      })
  }
  correctoption1Handler = (event)=>{
      this.setState({
          correctoption1: event.target.value
      })
  }
  question2Handler = (event)=>{
      this.setState({
          question2: event.target.value
      })
  }
  option21Handler = (event)=>{
      this.setState({
          option21: event.target.value
      })
  }
  option22Handler = (event)=>{
      this.setState({
          option22: event.target.value
      })
  }
  option23Handler = (event)=>{
      this.setState({
          option23: event.target.value
      })
  }
  option24Handler = (event)=>{
      this.setState({
          option24: event.target.value
      })
  }
  correctoption2Handler = (event)=>{
      this.setState({
          correctoption2: event.target.value
      })
  }
  date1Handler = (event)=>{
      this.setState({
          date1: event.target.value
      })
  }
  date2Handler = (event)=>{
      this.setState({
          date2: event.target.value
      })
  }

  submitHandler = (event)=>{
      event.preventDefault();
      const data = {
          quizId : this.state.quizId,
          quizName : this.state.quizName,
          question1 : this.state.question1,
          option11 : this.state.option11,
          option12 : this.state.option12,
          option13 : this.state.option13,
          option14 : this.state.option14,
          correctoption1 : this.state.correctoption1,
          question2 : this.state.question2,
          option21 : this.state.option21,
          option22 : this.state.option22,
          option23 : this.state.option23,
          option24 : this.state.option24,
          correctoption2 : this.state.correctoption2,
          date1 : this.state.date1,
          date2 : this.state.date2,
      }
      axios.post(`http://localhost:3001/course/${this.state.courseId}/quiz/new`,data)
      .then((response)=>{
          console.log(response.data);
          if(response.data.message==="error"){
              alert("Something went wrong.")
              this.props.history.push(`/course/${this.state.courseId}/quiz`);
          }
          else if(response.data.message==="success"){
              alert("Quiz published.")
              this.props.history.push(`/course/${this.state.courseId}/quiz`);
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
    return (
      <div>
        <Navigation handleClickLogout = {this.handleLogout} />
        <Header title={this.state.courseId} />
        <div className="pageContent">
          <div className="row newQuizRow">
            <div className="col-2 innerNavigationColumn"><InnerNavigation courseId={this.state.courseId} /></div>
            <div className="col-10 newQuizColumn">
              <h3>Create Quiz</h3><br />
              <p>Enter the fields and choose ONE correct option for each question.</p>
              <div>
                  <form className="newQuizForm" onSubmit={this.submitHandler}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Quiz ID</td>
                                <td>: <input type="text" name="quizId" onChange={this.quizIdHandler} required/></td>
                            </tr>
                            <tr>
                                <td>Name</td>
                                <td>: <input type="text" name="quizName" onChange={this.quizNameHandler} required/></td>
                            </tr><tr><td><br/></td></tr>
                            <tr>
                                <td>Question 1</td>
                                <td>: <input type="text" name="question1" className="quizquestion" onChange={this.question1Handler} required /></td>
                            </tr>
                            <tr>
                                <td><label>Option A&nbsp;<input type="radio" name="answer1" value="a" onChange={this.correctoption1Handler} checked={this.state.correctoption1==="a"} required /></label></td>
                                <td>: <input type="text" name="option11" onChange={this.option11Handler} required /></td>
                                <td><label>Option B&nbsp;<input type="radio" name="answer1" value="b" onChange={this.correctoption1Handler} checked={this.state.correctoption1==="b"} /></label></td>
                                <td>: <input type="text" name="option12" onChange={this.option12Handler} required /></td>
                            </tr>
                            <tr>
                                <td><label>Option C&nbsp;<input type="radio" name="answer1" value="c" onChange={this.correctoption1Handler} checked={this.state.correctoption1==="c"} /></label></td>
                                <td>: <input type="text" name="option13" onChange={this.option13Handler} required /></td>
                                <td><label>Option D&nbsp;<input type="radio" name="answer1" value="d" onChange={this.correctoption1Handler} checked={this.state.correctoption1==="d"} /></label></td>
                                <td>: <input type="text" name="option14" onChange={this.option14Handler} required /></td>
                            </tr>
                            <tr>
                                <td>Question 2</td>
                                <td>: <input type="text" name="question2" className="quizquestion" onChange={this.question2Handler} required /></td>
                            </tr>
                            <tr>
                                <td><label>Option A&nbsp;<input type="radio" name="answer2" value="a" onChange={this.correctoption2Handler} checked={this.state.correctoption2==="a"} required /></label></td>
                                <td>: <input type="text" name="option21" onChange={this.option21Handler} required /></td>
                                <td><label>Option B&nbsp;<input type="radio" name="answer2" value="b" onChange={this.correctoption2Handler} checked={this.state.correctoption2==="b"} /></label></td>
                                <td>: <input type="text" name="option22" onChange={this.o212Handler} required /></td>
                            </tr>
                            <tr>
                                <td><label>Option C&nbsp;<input type="radio" name="answer2" value="c" onChange={this.correctoption2Handler} checked={this.state.correctoption2==="c"} /></label></td>
                                <td>: <input type="text" name="option23" onChange={this.option23Handler} required /></td>
                                <td><label>Option D&nbsp;<input type="radio" name="answer2" value="d" onChange={this.correctoption2Handler} checked={this.state.correctoption2==="d"} /></label></td>
                                <td>: <input type="text" name="option24" onChange={this.option24Handler} required /></td>
                            </tr><tr><td><br/></td></tr>
                            <tr>
                                <td>Available from</td>
                                <td>: <input type="date" name="date1" onChange={this.date1Handler} required /></td>
                                <td>Available till</td>
                                <td>: <input type="date" name="date2" onChange={this.date2Handler} required /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>&nbsp;&nbsp;<button type="submit" name="publish" className="newQuiz btn btn-primary" >Publish</button></td>
                            </tr>
                        </tbody>
                    </table>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Export NewQuiz Component
export default NewQuiz;
