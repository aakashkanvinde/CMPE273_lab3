import React, { Component } from 'react';
import Navbar, { Navigation } from '../LandingPage/Navigation';
import Header from '../LandingPage/Header';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Userprofile.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { userProfile } from "../../actions/postActions";
import { graphql, compose } from 'react-apollo';
import { updateProfileMutation } from '../../mutation/mutations';

export class Edit extends Component{
    constructor(props){
        super(props);
        this.state = {
            phone: "",
            about: "",
            city: "",
            company: "",
            school: "",
            country: "",
            hometown: "",
            language: "",
            gender: "",
            profileImage: "",
        }

        // Binding Handlers
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.aboutChangeHandler = this.aboutChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.companyChangeHandler = this.companyChangeHandler.bind(this);
        this.schoolChangeHandler = this.schoolChangeHandler.bind(this);
        this.countryChangeHandler = this.countryChangeHandler.bind(this);
        this.hometownChangeHandler = this.hometownChangeHandler.bind(this);
        this.languageChangeHandler = this.languageChangeHandler.bind(this);
        this.genderChangeHandler = this.genderChangeHandler.bind(this);
        this.profileImageChangeHandler = this.profileImageChangeHandler.bind(this);
        this.submitEditHandler = this.submitEditHandler.bind(this);
    }
    
    phoneChangeHandler = (event) => {
        this.setState({
            phone: event.target.value
        });
    }
    
    aboutChangeHandler = (event) => {
        this.setState({
            about: event.target.value
        });
    }
    cityChangeHandler = (event) => {
        this.setState({
            city: event.target.value
        });
    }
    companyChangeHandler = (event) => {
        this.setState({
            company: event.target.value
        });
    }
    schoolChangeHandler = (event) => {
        this.setState({
            school: event.target.value
        });
    }
    countryChangeHandler = (event) => {
        this.setState({
            country: event.target.value
        });
    }
    hometownChangeHandler = (event) => {
        this.setState({
            hometown: event.target.value
        });
    }
    languageChangeHandler = (event) => {
        this.setState({
            language: event.target.value
        });
    }
    genderChangeHandler = (event) => {
        this.setState({
            gender: event.target.value
        });
    }
    profileImageChangeHandler = (event) => {
        this.setState({
            profileImage: event.target.value
        });
    }

    // onChange (e) {
    //   this.setState({ [e.target.name]:[e.target.value] });
    // }

    async submitEditHandler(e) {
        e.preventDefault();
        const data = {
            phone: this.state.phone,
            about: this.state.about,
            city: this.state.city,
            company: this.state.company,
            school: this.state.school,
            country: this.state.country,
            hometown: this.state.hometown,
            language: this.state.language,
            gender: this.state.gender,
            profileImage: this.state.profileImage,
        }

          let res=await this.props.updateProfileMutation({
            variables: {
              about,
              phone,
              language,
              hometown,
              gender,
              city,
              country,
              school,
              uid:cookie.load('cookie').email
            },
        });
        await this.setState({
          ...res.data.profileUpdate
        })
        this.cancel();
        //  this.props.onEditProfile(obj);
    }
    cancel=()=>{
      this.props.onEditSwitch(0);
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

  componentWillMount(){
    this.setState({
      authFlag: false
    })
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
              <Navigation handleClickLogout = {this.handleLogout}/>
              <Header title="Edit Profile" />
              <div className="pageContent">
                <div className="row">
                  <div className="col-3 profilePageColumn">
                  </div>
                  <div className="col-6"><br />
                  <h4>Enter new information</h4><br/>
                  <form className="editForm" onSubmit={this.submitEditHandler}>
                  <table>
                    <tbody>
                      <tr>
                        <td>Profile Picture</td>
                        <td>: <input type="text"  value={this.state.profileImage}  name="profileImage" placeholder="Image url" onChange={this.profileImageChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>Contact Number</td>
                        <td>: <input type="text" name="phone" maxLength="10"  placeholder="xxxxxxxxxx" pattern="\d{10}" title="Enter a valid contact number." value={this.state.phone}  onChange={this.phoneChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>About Me</td>
                        <td>: <input type="text" name="about" value={this.state.about} onChange={this.aboutChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>City</td>
                        <td>: <input type="text" name="city" value={this.state.city} onChange={this.cityChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>Country</td>
                        <td>: <input type="text" name="country" value={this.state.country} onChange={this.countryChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>Company</td>
                        <td>: <input type="text" name="company" value={this.state.company} onChange={this.companyChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>School</td>
                        <td>: <input type="text" name="school" value={this.state.school} onChange={this.schoolChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>Hometown</td>
                        <td>: <input type="text" name="hometown" value={this.state.hometown} onChange={this.hometownChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>Language</td>
                        <td>: <input type="text" value={this.state.language} name="language" onChange={this.languageChangeHandler} /></td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td className="edit gender">
                          <label>
                            <input type="radio" name="gender" value="Male" onChange={this.genderChangeHandler} checked={this.state.gender === "Male"} />&nbsp;
                            Male&nbsp;</label>
                          <label>
                            <input type="radio" name="gender" value="Female" onChange={this.genderChangeHandler} checked={this.state.gender === "Female"} />&nbsp;
                            Female&nbsp;</label>
                          <label>
                            <input type="radio" name="gender" value="Other" onChange={this.genderChangeHandler} checked={this.state.gender === "Other"} />&nbsp;
                            Other&nbsp;</label>
                        </td>
                      </tr>
                      <tr><td><br/></td></tr>
                      <tr>
                        {/* <td></td> */}
                        <td><input type="submit" value="Update" className="editbtn btn-primary" />&nbsp;
                            <Link to="/userprofile"><button className="editbtn btn-danger">Cancel</button></Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </form>
                  </div>
                </div>
              </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
  phone: state.posts.phone,
  about: state.posts.about,
  city: state.posts.city,
  company: state.posts.company,
  school: state.posts.school,
  country: state.posts.country,
  hometown: state.posts.hometown,
  language: state.posts.language,
  gender: state.posts.gender,
  profileImage: state.posts.profileImage,
}
);  


// Export Edit Component
// export default Edit;
export default compose(
  graphql(updateProfileMutation, { name: "updateProfileMutation" })
)(connect(mapStateToProps,{userProfile})(Edit));
