import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {Redirect} from 'react-router';
import './Navigation.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Header from './Header';


const sjsuLogo = {
    src: require('../../assets/sjsu.png'),    
    alt: 'sjsu_image',
}

export class Navigation extends Component{
    constructor(props){
        super(props);
        // this.handleLogout = this.handleLogout.bind(this);
    }

    render(){
        // redirect based on successful create
        let redirectVar = null;
        if(!cookie.load('login')){
            redirectVar = <Redirect to = "/" />
        }
        return(
            <div className="navigationBar" >
               {redirectVar}
                <header id = "navigationBar">
                    <ul className="navigationList">
                        <div>
                            <img className="navigationLogo" src={sjsuLogo.src} alt={sjsuLogo.alt} />
                        </div>
                        <br />
                        <li>
                            <Link to='/home'>
                                <i style={{fontSize: `4.5rem`}} className="glyphicon glyphicon-home" /><br/>
                                <span style={{fontSize: `2rem`}} className="navigationListText">  Home</span>
                            </Link>
                        </li>
                        <br /><hr />
                        <li>
                            <Link to='/userprofile'>
                                <i style={{fontSize: `4.5rem`}} className="glyphicon glyphicon-user" /><br />
                                <span style={{fontSize: `2rem`}} className="navigationListText">  Profile</span>
                            </Link>
                        </li>
                        <br /><hr />              
                        <li>
                            <Link to='/courses'>
                                <i style={{fontSize: `4.5rem`}} className="glyphicon glyphicon-book" /><br />
                                <span style={{fontSize: `2rem`}} className="navigationListText">   Courses</span>
                            </Link>
                        </li><br /><hr />  
                        <li>
                            <span className="navigationLogout">
                                <Link to="/" onClick = {this.props.handleClickLogout}>
                                    <i style={{fontSize: `4.5rem`}} className="glyphicon glyphicon-user" /><br />
                                    <span style={{fontSize: `2rem`}} className="navigationListText">  Logout</span>
                                </Link>
                            </span>
                        </li><br /><br/><hr />
                    </ul>
                </header>
            </div>
        );
    }
}

//Export Navigation Component
export default Navigation;