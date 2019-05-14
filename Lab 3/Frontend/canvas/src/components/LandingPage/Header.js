import React, { Component } from 'react';
import './Header.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

export class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: ""
        }
    }
  render() {
    // redirect based on successful create
    let redirectVar = null;
    if(!cookie.load('login')){
        redirectVar = <Redirect to = "/" />
    }
    return (
      <div className="row container">
        <div className="col-12 pageHeader">
            {redirectVar}
            <h1 className="pageTitle" >{this.props.title}</h1>
        </div>
      </div>
    )
  }
}

// Export Header component
export default Header;
