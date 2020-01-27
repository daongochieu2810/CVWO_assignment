import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
//import styled from 'styled-components';

class Login extends React.Component {
     constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            errors: ''
        }
    }
    handleChange = (e) => {
        const {name,value} = e.target
        this.setState({
            [name]: value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const {username,email,password} = this.state
        let user = {
            username: username,
            email: email,
            password: password
        }
        axios.post('/login', {user}, {withCredentials: true})
        .then(response => {
            if(response.data.logged_in) {
                this.props.handleLogin(response.data)
                this.redirect()
            } else {
                this.setState({
                    errors: response.data.errors
                })
            }
        })
        .catch(error => console.log('api errors:',error))
    }
    redirect = () => {
        this.props.history.push('/')
    }
    handleErrors = () => {
        return (
            <div>
                <ul>
                {this.state.errors.map(error => {
                    return <li key={error}>{error}</li>
                })}
                </ul>
            </div>
        )
    }
    componentDidMount() {
        return this.props.loggedInStatus ? this.redirect : null;
    }
    render() {
        const styling = {
            width: "500px",
            height: "500px",
            margin: "90px 0px 0px 500px"
        }
        const {username,email,password} = this.state
        return(
            <div className='container bg-dark' style={styling}>
                <h1 className="text-white"><center>Log In</center></h1>
                <form onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                    <input
                        className='form-control'
                        placeholder="username"
                        type='text'
                        name="username"
                        defaultValue={username}
                        onChange={this.handleChange} 
                    />
                    </div>
                    <div className='form-group'>
                    <input
                        className='form-control'
                        placeholder="email"
                        type='text'
                        name='email'
                        defaultValue={email}
                        onChange={this.handleChange} 
                    />
                    </div>
                    <div className='form-group'>
                    <input
                        className='form-control'
                        placeholder="password"
                        name='password'
                        type='password'
                        defaultValue={password}
                        onChange={this.handleChange} 
                    />
                    </div>
                    <button
                        className='btn btn-secondary btn-block'
                        placeholder="submit"
                        type="submit"
                    >
                    Log In
                    </button>
                    <div className="text-white">
                    or <Link to='/signup'>sign up</Link>
                    </div>
                </form>
                <div className="text-white">
                    {this.state.errors ? this.handleErrors() : null}
                </div>
            </div>
           
        )
    }
}
export default Login