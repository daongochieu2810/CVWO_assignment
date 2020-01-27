import React from 'react';
import {Link} from 'react-router-dom';
import history from './history';
export default class NavBar extends React.Component {
    constructor(props) {
      super(props)
      this.state={
      }
     
    }
    handleCLick = () => {
        const url = '/logout'
        const token = document.querySelector(`meta[name="csrf-token"]`).content
        fetch(url,{
            method: "DELETE",
            headers: {
                "X-CSRF_Token": token,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            this.props.handleLogout()
            history.push('/')
        })
        .catch(error=>console.log(error))
    }
    
    render() {
        return(
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <Link className="navbar-brand" to="/">Todo App</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
      </li>
      {
      this.props.logInStatus ?
      <>
      <li className="nav-item">
        <Link className="nav-link" to="/todo">New Todo</Link>
      </li>
      
      <li className="nav-item">
        <Link className="nav-link" to="/todos">Show all Todos</Link>
      </li>
      </>:
      null
      }
      {
        this.props.logInStatus ?
         <li className="nav-item">
        <Link className="nav-link" to="/logout" onClick={this.handleCLick}>Log Out </Link> 
      </li>
        :
        <>
      <li className="nav-item">
    <Link className="nav-link" to="/login">Log In </Link>
      </li>
      <li className="nav-item">
    <Link className="nav-link" to="/signup">Sign Up</Link> 
      </li>
      </>
    }
    </ul>
   
  </div>
</nav>
        )
    }
}