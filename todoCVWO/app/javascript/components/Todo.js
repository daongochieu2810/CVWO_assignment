import React from 'react';
import {Link} from 'react-router-dom';
import * as moment from 'moment';
export default class Todo extends React.Component{
    constructor(props){
        super(props)
        
        this.state = {
            todo: {
                title: "",
                details: "",
                urgency_point: 0,
                deadline: "",
                done: false,
                tags: []
            }
        }
        this.deleteTodo = this.deleteTodo.bind(this)
        this.addHtmlEntities = this.addHtmlEntities.bind(this)
    }
    deleteTodo() {
        const {
            match: {
                params: {id}
            }
        } = this.props
        
        const url = `/destroy/${id}`
        const token = document.querySelector(`meta[name="csrf-token"]`).content
        fetch(url,{
            method: "DELETE",
            headers: {
                "X-CSRF_Token": token,
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if(response.ok){
                    return response.json()
                }
                throw new Error("Network response was not ok")
            })
            .then(()=>this.props.history.push("/todos"))
            .catch(error => console.log(error.message))
    }
    componentDidMount() {
       
        const {
            match: {
                params: {id}
            }
        } = this.props
        const  url = `/show/${id}`
        fetch(url)
            .then(response => {
                if(response.ok) {
                    return response.json()
                }
                throw new Error("Network response was not ok.")
            })
            .then(response => this.setState({todo: response}))
            .catch(()=>this.props.history.push("/todos")) //if todo does not exist then come back 

    }
    addHtmlEntities(str) {
        return String(str)
            .replace(/&lt;/g,"<")
            .replace(/&gt;/g,">")
        //replace all escaped opening and closing brackets with their html entities

    }
    render() {
    const { todo } = this.state;
    var date = moment(todo.deadline).format('HH:MM:SS DD-MM-YYYY');
    
    
    const todoDetails = this.addHtmlEntities(todo.details);

    return (
      <div className="">
        <div className="hero position-relative d-flex align-items-center justify-content-center">
        
          <div className="overlay position-absolute" style={{backgroundColor: "#37BC9B"}} />
          <h1 className="display-4 position-relative text-white">
            {todo.title}
          </h1>
        </div>
        <div className="container py-5">
          <div className="row">
            <div className="col-sm-12 col-lg-3">
              <ul className="list-group">
                <h5 className="mb-2">Urgency Point</h5>
                {todo.urgency_point}
              </ul>
            </div>
            <div className="col-sm-12 col-lg-7">
                <h5 className="mb-2"> Deadline </h5>
                {date} 
            </div>
            <div className="col-sm-12 col-lg-7">
              <h5 className="mb-2">Tags</h5>
              {todo.tags.map((tag,index) => index!==todo.tags.length-1 ? tag + "," : tag)}
            </div>
             <div className="col-sm-12 col-lg-7">
                <h5 className="mb-2"> Done </h5>
                {todo.done ? "Done":"Not Done"} 
            </div>
            <div className="col-sm-12 col-lg-7">
              <h5 className="mb-2">Details</h5>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${todoDetails}`
                }}
              />
            </div>
            
            <div className="col-sm-12 col-lg-2">
              <button type="button" className="btn btn-danger" onClick={this.deleteTodo}>
                Delete Todo
              </button>
            </div>
          </div>
          <Link to="/todos" className="btn btn-link">
            Back to all todos
          </Link>
        </div>
      </div>
    );
  }

}