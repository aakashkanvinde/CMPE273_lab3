import React, { Component } from 'react';
import Navigation from '../../LandingPage/Navigation';
import Header from '../../LandingPage/Header';
import cookie from 'react-cookies';
import InnerNavigation from '../../LandingPage/InnerNavigation';
import axios from 'axios';
import './Announcement.css'

export class Newannouncement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseId: this.props.match.params.id,
            announcementName:"",
            announcementDescription:"",
            announcementTime:""
        }
        this.announcementNameHandler = this.announcementNameHandler.bind(this)
        this.announcementDescriptionHandler = this.announcementDescriptionHandler.bind(this)
        this.timeSetHandler = this.timeSetHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
    }

    announcementNameHandler = (event)=>{
        this.setState({
            announcementName: event.target.value
        });
    }
    announcementDescriptionHandler = (event)=>{
        this.setState({
            announcementDescription: event.target.value
        });
    }
    timeSetHandler = (event)=>{
        let date = new Date();
        this.setState({
            announcementTime: date.toDateString()+" "+date.toLocaleTimeString()
        });
    }
    
    submitHandler = (event)=>{
        event.preventDefault();
        const data = {
            courseId: this.state.courseId,
            announcementName: this.state.announcementName,
            announcementDescription: this.state.announcementDescription,
            announcementTime: this.state.announcementTime
        }
        axios.post(`http://localhost:3001/courses/${this.state.courseId}/announcement/new`,data)
        .then((result)=>{
            console.log(result.data);
            if(result.data.message==="error"){
                alert("Something went wrong!");
                this.props.history.push(`/courses/${this.state.courseId}/announcement`);
            }
            else if(result.data.message==="success"){
                alert("Announcement published.");
                this.props.history.push(`/courses/${this.state.courseId}/announcement`);
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
        return (
            <div>
                <Navigation handleClickLogout = {this.handleLogout}/>
                <Header title={this.state.courseId} />
                <div className="pageContent">
                    <div className="row announcementRow">
                        <div className="col-2 innerNavigationColumn"><InnerNavigation courseId={this.state.courseId} /></div>
                        <div className="col-10 coursecolumn">
                            <h3>New Announcements</h3><br />
                            <form onSubmit={this.submitHandler}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Title</td>
                                            <td>&nbsp;&nbsp;<input type="text" name="announcementName" onChange={this.announcementNameHandler} required /></td>
                                        </tr>
                                        <tr>
                                            <td className="annfield">Announcement</td>
                                            <td>&nbsp;&nbsp;<textarea name="announcementDescription" rows="5" onChange={this.announcementDescriptionHandler} cols="50" required /></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>&nbsp;&nbsp;<button name="publish" value="Publish" className="btn btn-primary" onClick={this.timeSetHandler} >Publish</button></td>
                                        </tr>
                                    </tbody>
                                </table>                       
                            </form>
                        </div>  
                    </div>
                </div>
            </div>
        )
    }
}

// Export Newannouncement Component
export default Newannouncement;
