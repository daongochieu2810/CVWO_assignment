import React from 'react';
import axios from 'axios';
class Signup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password:'',
            password_confirmation: '',
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
        const {username,email,password,password_confirmation} = this.state
        let user = {
            username: username,
            email: email,
            password: password,
            password_confirmation: password_confirmation
        }
        axios.post('/users', {user}, {withCredentials: true})
        .then(response => {
            if(response.data.status === 'created') {
                this.props.handleLogin(response.data)
                this.redirect()
            } else {
                this.setState({
                    errors: response.data.errors
                })
            }
        })
        .catch(error=>console.log('api errors:',error))
    }
    redirect = () => {
        this.props.history.push('/')
    }
   handleErrors = () => {
    var errors = this.state.errors
    var result = Object.keys(errors).map(function(key) {
        var currType = errors[key];
        var ans = currType.map(function(type){
            return type['error']
        })
        return key+ " : "+ans
    })
    return (
      <div>
        <ul>
            {result.map((error)=> <li key={error}>{error}</li>)}
        </ul>
      </div>
    )
    }
    render() {
        const {username,email,password,password_confirmation} = this.state
        const styling = {
            width: "500px",
            height: "500px",
            margin: "90px 0px 0px 500px"
        }
        return(
            <div className='container bg-dark' style={styling}>
            <h1 className='text-white'><center>Sign Up</center></h1>
            <form onSubmit={this.handleSubmit}>
                <div className='form-group'>
                <input
                    className='form-control'
                    placeholder='username'
                    type='text'
                    name='username'
                    defaultValue={username}
                    onChange={this.handleChange} 
                />
                </div>
                <div className='form-group'>
                <input
                    className='form-control'
                    placeholder='email'
                    type='text'
                    name='email'
                    defaultValue={email}
                    onChange={this.handleChange} 
                />
                </div>
                <div className='form-group'>
                <input
                    className='form-control'
                    placeholder='password'
                    type='password'
                    name='password'
                    defaultValue={password}
                    onChange={this.handleChange} 
                />
                </div>
                <div className='form-group'>
                <input
                    className='form-control'
                    placeholder='password_confirmation'
                    type='password'
                    name='password_confirmation'
                    defaultValue={password_confirmation}
                    onChange={this.handleChange} 
                />
                </div>
                <button
                    className='btn btn-secondary btn-block'
                    placeholder='submit'
                    type='submit'
                >
                Sign Up
                </button>
            </form>
            <div className="text-white">
                {this.state.errors ? this.handleErrors() : null}
            </div>
            </div>

        )
    }
}
export default Signup