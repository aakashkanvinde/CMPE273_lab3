import React, { Component } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './Person.css';

export class Person extends Component {
    constructor(props){
        super(props);
        this.state = {
            personId:"",
            courseId: "",
            action:""
        }
        this.removeClickHandler = this.removeClickHandler.bind(this);
        this.enrollClickHandler = this.enrollClickHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    enrollClickHandler = (event)=>{
        this.setState({
            personId: this.props.personId,
            courseId: this.props.courseId,
            action: "enroll"
        });
    }
    removeClickHandler = (event)=>{
        this.setState({
            personId: this.props.personId,
            courseId: this.props.courseId,
            action: "remove"
        });
    }

    submitHandler = (event)=>{
        event.preventDefault();
        const data = {
            personId: this.state.personId,
            courseId: this.state.courseId,
            action: this.state.action
        };
        console.log(data);
        axios.post(`http://localhost:3001/courses/${this.props.courseId}/people`,data)
        .then((result)=>{
            console.log("From backend"+data);
            if(result.data.message==="error"){
                alert("Something went wrong.")
            }
            else if(result.data.message==="success"){
                if(result.data.permissionCode){
                    alert("Permission Code: "+ result.data.permissionCode);
                }
                else{
                    alert("Action Performed.");
                }
                window.location.reload();
            }
        });
    }

  render() {
    return (
      <div className="persontab">
        <div className="row">
            <div className="col-2 imagecol">
                {(this.props.personImage === null || this.props.personImage === "")
                ?<img src="https://photos.gograph.com/thumbs/CSP/CSP992/male-profile-picture-vector-stock_k14386009.jpg" alt="profilepicture" className="personimage" />
                :<img src={this.props.personImage } alt = "profilepicture" className="personimage"/>}
            </div>
            <div className="col-7 namecol">
                <h4><b>{this.props.personName}</b></h4>
            </div>
            <div className="col-3 statcol">
                {(Cookies.get('role') === "Faculty")
                ?(this.props.personStatus === "enroll")
                    ?<form onSubmit={this.submitHandler}><button className="btn btn-danger" onClick={this.removeClickHandler}>REMOVE</button></form>
                    :<form onSubmit={this.submitHandler}><button className="btn btn-success" onClick={this.enrollClickHandler}>ENROLL</button></form>
                :<span></span>
                }
            </div>
        </div>
      </div>
    )
  }
}

// Export Person Component
export default Person;
