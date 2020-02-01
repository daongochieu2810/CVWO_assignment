import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Home from "./Home";
import NavBar from "./NavBar";
import Todos from "./Todos";
import Todo from "./Todo";
import NewTodo from "./NewTodo";
import UpdateTodo from "./UpdateTodo";
import Login from '../UserAuth/Login';
import Signup from '../UserAuth/Signup';
import axios from 'axios';
import CalendarPage from './CalendarPage';
import history from './history';
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            isLoggedIn: false,
            user: {}
        }
    }
    componentDidMount() {
        this.loginStatus()
        
    }
    
    loginStatus = () => {
       fetch("/logged_in")
       .then(response=>{
           if(response.ok) {
               return response.json()
           }
           throw new Error("cannot get logged in info")
       })
       .then(response =>{
           if(response.logged_in) {
               this.handleLogin(response)
           }
           else {
               this.handleLogout()
           }
       }
       )
        .catch(error=>console.log('api errors:',error))
    }
    handleLogin = (data) => {
        this.setState({
            isLoggedIn: true,
            user: data.user
        })
    }
    handleLogout = () => {
        this.setState({
            isLoggedIn: false,
            user: {}
        })
    }
    
    render() {
    return (
    <Router history={history}>
    <NavBar logInStatus={this.state.isLoggedIn} handleLogout={this.handleLogout}></NavBar>
    <Switch>
       <Route 
        exact path='/' 
        render={props => (
            <Home {...props} 
                    loggedInStatus={this.state.isLoggedIn}
            />
        )}
    />
      <Route 
        exact path='/todos' 
        render={props => (
            this.state.isLoggedIn ?
            <Todos {...props} 
                    user_id={this.state.user.id}
            />
            :
            <Login {...props}
                    loggedInStatus={this.state.isLoggedIn}
                    handleLogin={this.handleLogin} 
            />
        )}
    />
       <Route 
        exact path='/calendar' 
        render={props => (
            this.state.isLoggedIn ?
            <CalendarPage
                {...props}
                user_id={this.state.user.id} 
            />:
            <Login
                {...props}
                loggedInStatus={this.state.isLoggedIn}
                handleLogin={this.handleLogin}
            />
            
        )}
    />
       <Route 
        exact path='/todo/:id' 
        render={props => (
            <Todo {...props} 
                    user_id={this.state.user.id}
            />
        )}
    />
       <Route 
        exact path='/todo' 
        render={props => (
            <NewTodo {...props} 
                    user_id={this.state.user.id}
            />
        )}
    />
     
       <Route 
        exact path='/update/:id' 
        render={props => (
            <UpdateTodo {...props} 
                    user_id={this.state.user.id}
            />
        )}
    />
      <Route 
        exact path='/login' 
        render={props => (
            <Login {...props} handleLogin={this.handleLogin}
                    loggedInStatus={this.state.isLoggedIn}
            />
        )}
    />
    <Route exact path='/signup'
            render={props => (
                <Signup {...props} handleLogin={this.handleLogin}
                        loggedInStatus={this.state.isLoggedIn}
                />
            )}
    />
    </Switch>
  </Router>
  )
    }
}
export default App