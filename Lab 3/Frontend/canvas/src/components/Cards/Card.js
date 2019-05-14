import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import './Card.css';

export class Coursecard extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: "",
            name: "",
            term: "",
            number:""
        }
    }
  render() {
      let colorbackground = ["https://ih1.redbubble.net/image.530527489.1466/flat,550x550,075,f.jpg",
        "https://www.solidbackgrounds.com/images/2560x1440/2560x1440-sea-blue-solid-color-background.jpg",
        "https://cdn.shopify.com/s/files/1/1011/0376/products/PastelBlue.jpg?v=1512940787"];
        let redirectVar = null;
        if(!cookie.load('login')){
            redirectVar = <Redirect to = "/" />
        }
    return (
      <div>
        {redirectVar}
        <Link to={`/courses/${this.props.id}/home`} className="coursecardlink">
          <Card className="cards searchCourse">
              <img src={colorbackground[Number(this.props.number)%3]} alt="cardcolor" className="cardtemp" />
              <h3  style={{marginTop: `1em`}}><span className="cardlink">{this.props.id}</span></h3>
              <h3><span className="cardlink">{this.props.name}</span></h3>
              <h5><span className="cardlink term">{this.props.term}</span></h5>
          </Card>
        </Link>
      </div>
    );
  }
}

export default Coursecard;
