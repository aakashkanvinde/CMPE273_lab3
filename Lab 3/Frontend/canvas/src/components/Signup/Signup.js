import React, {Component} from "react";
// import '../../App.css';
import '../Signup/Signup.css';
import axios from 'axios';
import ReactDOM from 'react-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import cookie from "react-cookies";
import { graphql, compose } from 'react-apollo';
import { signupMutation } from '../../mutation/mutations';
import {Link} from 'react-router-dom';


const sjsuLogo = {
    src: require('../../assets/sjsu.png'),
    alt: 'sjsu_image',
}

// Signup Component
class Signup extends Component{
    // constructor
    constructor(props){
        super(props);
        // State variable for signup component
        this.state = {
            userName: "",
            email: "",
            role: "",
            userId: "",
            password: "",
            authFlag: "",
        }

        // Binding the handlers
        this.userNameChangeHandler = this.userNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.roleChangeHandler = this.roleChangeHandler.bind(this);
        this.userIdChangeHandler = this.userIdChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
    }


    // Calling the willMount and setting the authFlag to false
    componentWillMount(){
        this.setState({
            authFlag: false
        })
    }


    // userNameChangeHandler updates the state variable with the text entered by user
    userNameChangeHandler = (event) => { 
        this.setState({
            userName: event.target.value
        })
    }

    // emailChangeHandler updates the state variable with the text entered by user
    emailChangeHandler = (event) => { 
        this.setState({
            email: event.target.value
        })
    }

    // roleChangeHandler updates the state variable with the text entered by user
    roleChangeHandler = (event) => { 
        this.setState({
            role: event.target.value
        })
    }

    // userIdChangeHandler updates the state variable with the text entered by user
    userIdChangeHandler = (event) => { 
        this.setState({
            userId: event.target.value
        })
    }

    // passwordChangeHandler updates the state variable with the text entered by user
    passwordChangeHandler = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    //submitSignup handler to send a request to the node backend
    async submitSignup(e) {

        // prevents page from refresh
        e.preventDefault();
        let {firstName,lastName,email,password,role}=this.state;
        var data={
            firstName,
            lastName,
            email,
            password,
            role
        }
    
        let res=await this.props.signupMutation({
            variables: {
                email,
                password,
                firstName,
                lastName,
                role
            },
        });
        if(_.has(res,"data.signup.email")){
        if(res.data.signup.email){
        alert("sign up successfull! redirecting to login page!")
        this.setState({
            signupSuccess:1
        })
        }else{
        alert("sign up failed! Email already exists")
        this.setState({
            signupSuccess:0
        })
        }
        }else{
        alert("sign up failed! Please try again !")
    
        this.setState({
            signupSuccess:0
        })
        }
    }


    // render method
    render(){
        //redirect based on successful signup
        let redirect = null;
        if(this.state.authFlag){
            redirect = <Redirect to= '/' />
        }

        return(
            <div>
                {redirect}
                {/* <div className = "container" >   */}
                    <div className = "nav"> 
                        <h2>Connecting to MySJSU</h2>
                        <hr />
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className = "signup-form">
                        <div className = "main-signupdiv">
                            <div class="panel">
                                <img src = {sjsuLogo.src} alt = {sjsuLogo.alt} />
                                <br />
                            </div>
                            <hr />
                            <br />
                            <h2>Sign up</h2>
                            <br />
                            <div className="btn-group btn-group-toggle">
                                {/* ROLE */}
                                {/* <label className = "btn btn-outline-primary" onClick = {this.roleChangeHandler}> */}
                                    <input className = "radioButton" onChange = {this.roleChangeHandler} type="radio" name="role" id="Student" value="Student"/>
                                    <label className = "form-check-label" for="Student">Student</label>
                                {/* </label> */}
                                {/* <label className = "btn btn-outline-primary" onClick = {this.roleChangeHandler}> */}
                                    <input className = "radioButton" onChange = {this.roleChangeHandler} type="radio" name="role" id="Faculty" value="Faculty"/>
                                    <label className = "form-check-label" for="Faculty">Faculty</label>
                                {/* </label> */}
                            </div>

                            <div className="form-group">
                                {/* User Name  */}
                                <input onChange = {this.userNameChangeHandler} type="text" className="form-control" name="userName" placeholder={this.state.role === 'Faculty' ? 'Faculty Name' : 'Student Name'} required/>
                            </div>

                            <div className="form-group">
                                {/* User Email */}
                                <input onChange = {this.emailChangeHandler} type="email" className="form-control" name="email" placeholder={this.state.role === 'Faculty' ? 'Faculty Email' : 'Student Email'} required/>
                            </div>

                            <div className="form-group">
                                {/* Student/Faculty ID */}
                                <input onChange = {this.userIdChangeHandler} type="number" className="form-control" maxlength="10" name="userId" pattern="\d+" placeholder={this.state.role === 'Faculty' ? 'Faculty ID' : 'Student ID'}/>
                            </div>

                            <div className="form-group">
                                {/* Password */}
                                <input onChange = {this.passwordChangeHandler} type="password" className="form-control" name="password" placeholder="Password"/>
                            </div>

                            {/* Submit button */}
                            <button onClick = {this.submitSignup} className="btn btn-success">SIGN UP</button>
                            <br />

                        </div>
                    </div>
                {/* </div> */}

            </div>
        );
    }

}

//export Signup Component
export default Signup;