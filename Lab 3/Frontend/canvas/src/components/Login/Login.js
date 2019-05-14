import React, {Component} from 'react';
// import '../../App.css';
import '../Login/Login.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Cookies from 'js-cookie';
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { loginPost } from "../../actions/postActions";
import { graphql, compose,withApollo } from 'react-apollo';
import { loginQuery } from '../../queries/queries';
import { loginMutation } from '../../mutation/mutations';



const sjsuLogo = {
    src: require('../../assets/sjsu.png'),
    alt: 'sjsu_image',
}


// Login Component
class Login extends Component{
    // call the constructor method
    constructor(props){
        super(props);
        // defining the state for this component
        // this.state = {
        //     userId: "",
        //     username: "",
        //     password: "",
        //     authFlag: false
        // }
        // Binding the handlers
        this.userIdChangeHandler = this.userIdChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    

    // Calling the willMount and setting the authFlag to false
    componentWillMount(){
        this.setState({
            authFlag: false
        })
    }

    // studentIdChangeHandler updates the state variable with the text entered by user
    userIdChangeHandler = (event) => { 
        this.setState({
            userId: event.target.value
            // username: event.target.value
        })
    }

    // passwordChangeHandler updates the state variable with the text entered by user
    passwordChangeHandler = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    //submitLogin handler to send a request to the node backend
    async submitLogin(event) {
        event.preventDefault();
        let {email,password}=this.state;
    
        let res = await this.props.client.query({
            query:loginQuery,
            variables: {
                email,
                password
            },
        });
    }

    // render method
    render(){
        //redirect based on successful login
        let redirect = null;
        if(cookie.load('login')){
            redirect = <Redirect to= '/home' />
        }
        return(
            <div>
                {redirect}
                <div className = "head" >
                    <div className = "nav"> 
                        <h2>Connecting to MySJSU</h2>
                        <hr />
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className = "login-form">
                        <div className = "main-div">
                            <div className="panel">
                                <img src = {sjsuLogo.src} alt = {sjsuLogo.alt} />
                                <br />
                            </div>
                            <hr />
                            <br />
                            <h2>Sign In</h2>
                            <div className="form-group">
                                  <input onChange = {this.userIdChangeHandler} type="text" className="form-control" pattern="\d+" name="userId" placeholder="User ID" required/> 
                            </div>

                            <div className="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" className="form-control" name="password" placeholder="Password" required/>
                            </div>

                            <button onClick = {this.submitLogin} className="btn btn-success">Login</button>
                            <br />
                            <a href="/signup"><h4>Not a Member yet? Sign Up here.</h4></a>  
                            <br />

                        </div>
                    </div>
                </div>

            </div>
        );
    }
}


  const mapStateToProps = state => ({
    userId: state.posts.userId,
    username: state.posts.username,
    password: state.posts.password,
    authFlag: false 
  }
);  


//export Login Component
// export default Login;
export default connect(mapStateToProps,{loginPost})(Login);