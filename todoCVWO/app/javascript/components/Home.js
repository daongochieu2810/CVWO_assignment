import React from "react";
import { Link } from "react-router-dom";
import Home from "./home.png";
import styled from 'styled-components';


const background = {
      width: "100%",
      height: "100%",
      backgroundImage: `url(${Home})`
    }


export default class Homepage extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
  return (
  <div>
  <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center " style={background}>
    <div className="jumbotron jumbotron-fluid bg-transparent position">
      <div className="container secondary-color">
        <h1 className="display-4">Todo App</h1>
        <p className="lead">
            Schedule things more efficiently
        </p>
        <hr className="my-4" />
        { this.props.loggedInStatus ?
        <Link
          to="/todos"
          className="btn btn-lg custom-button"
          role="button"
        >
           Get Started
        </Link>
        :
        <Link
          to="/login"
          className="btn btn-lg custom-button"
          role="button"
        >
           Get Started
        </Link>
        }
      </div>
    </div>
  </div>
  
  </div>)
}
}