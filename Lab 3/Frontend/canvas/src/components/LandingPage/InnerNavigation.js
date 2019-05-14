import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./InnerNavigation.css";
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

export class InnerNavigation extends Component{
    constructor(props){
        super(props);
        this.state = {
            isClicked: false,
            classname: "",
        }

        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleButtonClick(){
        this.setState((prevState) => {
            return {isClicked: !prevState.isClicked};
        });
    }

    render(){
        // redirect based on successful create
        let redirectVar = null;
        if(!cookie.load('login')){
        redirectVar = <Redirect to = "/" />
        }
        return(
            <div className="innerNavigation">
                {redirectVar}
              <ul className="innerNavigationList">
                {/* <Link to={`/courses/${this.props.courseId}/home`} > */}
                    <li>
                        <Link to={`/courses/${this.props.courseId}/home`} >
                            {/* <button type="button" onClick={this.handleButtonClick} className = {this.state.isClicked ? "innerNavigationList btn btn-light btn-block active" : "innerNavigationList btn btn-light btn-block"} aria-pressed="true">Home</button> */}
                            <button type="button" className="innerNavigationList btn btn-light btn-block" >Home</button>
                        </Link>
                    </li>
                {/* </Link> */}
                {/* <Link to={`/courses/${this.props.courseId}/announcement`}> */}
                    <li>
                        <Link to={`/courses/${this.props.courseId}/announcement`}>
                            <button type="button" className="innerNavigationList btn btn-light btn-block" >Announcements</button>
                        </Link>

                    </li>
                {/* </Link> */}

                {/* <Link to={`/courses/${this.props.courseId}/assignment`}> */}
                    <li>
                        <Link to={`/courses/${this.props.courseId}/assignment`}>
                            <button type="button" className="innerNavigationList btn btn-light btn-block">Assignments</button>
                        </Link>
                    </li>
                {/* </Link> */}

                {/* <Link to={`/courses/${this.props.courseId}/grade`}> */}
                    <li>
                        <Link to={`/courses/${this.props.courseId}/quiz`}>
                            <button type="button" className="innerNavigationList btn btn-light btn-block">Quiz</button>
                        </Link>
                    </li>
                {/* </Link> */}

                {/* <Link to={`/courses/${this.props.courseId}/people`} > */}
                    <li>
                        <Link to={`/courses/${this.props.courseId}/grades`}>
                            <button type="button" className="innerNavigationList btn btn-light btn-block">Grades</button>
                        </Link>
                    </li>
                {/* </Link> */}

                {/* <Link to={`/courses/${this.props.courseId}/file`}> */}
                    <li>
                        <Link to={`/courses/${this.props.courseId}/files`}>
                            <button type="button" className="innerNavigationList btn btn-light btn-block">Files</button>
                        </Link>

                    </li>
                {/* </Link> */}

                {/* <Link to={`/courses/${this.props.courseId}/quiz`}> */}
                    <li>
                        <Link to={`/courses/${this.props.courseId}/people`} >
                            <button type="button" className="innerNavigationList btn btn-light btn-block">People</button>
                        </Link>

                    </li>
                {/* </Link> */}
              </ul>
            </div>
          );
    }
}

// Exporting InnerNavigation Component
export default InnerNavigation;