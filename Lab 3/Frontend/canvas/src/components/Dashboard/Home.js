import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Navigation from '../LandingPage/Navigation';
import Header from '../LandingPage/Header';
import Courses from '../Courses/Courses.js';
import './Home.css';



class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: "",
        };
    }

    componentDidMount(){
        axios.get('http://localhost:3001/userprofile')
        .then((res) => {
          if(res.data.message==="error"){
            alert("Something went wrong!");
          }
          else if(res.data.message==="success"){
            this.setState({
              user: res.data.data,
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

    render(){
        // redirect based on successful create
        let redirectVar = null;
        if(!cookie.load('login')){
            redirectVar = <Redirect to = "/" />
        }
        return(
            <div>
                {redirectVar}
                <div className="home-container">
                    <Navigation handleClickLogout = {this.handleLogout} />
                </div>
                <div align="center" className="welcomePage">
                    {/* <h1 className="hello">  Welcome {this.state.user.name} </h1> */}
                    {/* {(this.state.user.profileImage === null || this.state.user.profileImage === "")
                      ? <img src="https://photos.gograph.com/thumbs/CSP/CSP992/male-profile-picture-vector-stock_k14386009.jpg" alt="someProfilePicture1" className="profilePicture" />
                      : <img src={this.state.user.profileImage} alt="someProfilePicture2" className="profilePicture" />} */}
                </div>
            </div>
        );
    }
}

export default Home;