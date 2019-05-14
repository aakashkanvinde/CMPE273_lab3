import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
// import Sidebar from '../Sidebar/Sidebar';
import SideDrawer from '../SideDrawer/SideDrawer';
import Backdrop from '../SideDrawer/Backdrop';
import './Dashboard.css';
import Card from '../Cards/Card';
import Navigation from '../LandingPage/Navigation.js'

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            sideDrawerOpen: false,
            authFlag: true

        }
    }
    
    drawerToggleHandler = () => {
        // this.setState((prevState) => {
        //     return {sideDrawerOpen: !prevState.sideDrawerOpen};
        // });
        this.setState({
            sideDrawerOpen: !this.state.sideDrawerOpen,
        });
        console.log("Toggle clicked");
    };

    backdropClickHandler = () => {
        this.setState({
            sideDrawerOpen: false,
        }); 
    };

    logout = () => {
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

        // let sideDrawer;
        let backdrop;
        if(this.state.sideDrawerOpen){
            // sideDrawer = <SideDrawer />
            backdrop = <Backdrop click = {this.backdropClickHandler} />
        }        
        return(
            <div>
            {/* style={{height: '100vh'}} */}
              {redirectVar}
              {/* <div className="row">
                <div className="col-3"> */}
                    {/* <div className="dashboard-div">
                        <Sidebar handleLogout = {this.logout} sideDrawerClickHandler = {this.drawerToggleHandler}/> */}
                        {/* {sideDrawer} */}
                        {/* <span className>
                          <Card />
                        </span> */}
                        {/* <SideDrawer display={this.state.sideDrawerOpen}/>
                        {backdrop} */}
                    {/* </div> */}
                    {/* <div className="col-9"></div> */}

                {/* </div> */}
                <div>
                    <Navigation />
                </div>
              </div>
   
        );
    }
} 


// export Dashboard Component
export default Dashboard;