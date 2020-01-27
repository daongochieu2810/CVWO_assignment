import React from 'react';
import {Link} from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
export default class NewTodo extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            title: "",
            details: "",
            deadline: "",
            urgency_point: 0,
            done: false,
            tags: [],
            userID: props.user_id,
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.stripHtmlEntities = this.stripHtmlEntities.bind(this)
        this.handleDateTime=this.handleDateTime.bind(this)
        this.handleTags = this.handleTags.bind(this);
    }
    handleTags(e) {
      var allTags = e.target.value;
      var Tags = allTags.split(",");
      this.setState({tags: Tags});

    }
    stripHtmlEntities(str) {
        return String(str)
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
        // < and > are special characters
    }
    handleDateTime(e){
      let date = new Date(e)
      console.log("this is new date "+date)
      this.setState({
        deadline: date
      })
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit(e) {
        e.preventDefault();
      
        const url = "todos/create"
        const { title,details,deadline,urgency_point,done,tags,userID} = this.state
     
        if(title.length === 0) return
        const body = {
            title,
            details: details.replace(/\n/g,"<br> <br>"),
            deadline,
            urgency_point,
            done,
            tags,
            userID
        }
      
        //security purpose
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url,{
            method: "POST",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if(response.ok){
                   // console.log(response.json())
                    return response.json()
                }
                throw new Error("Network response was not ok")
            })
            .then(response => this.props.history.push(`/todo/${response.id}`))//go to newly created item
            .catch(error => console.log(error.message))
    }
    render() {
     
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">
            <h1 className="font-weight-normal mb-5">
              Add a new Todo to the Todo List.
            </h1>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="todoTitle">Todo title</label>
                <input
                  type="text"
                  name="title"
                  id="todoTitle"
                  className="form-control"
                  required
                  onChange={this.onChange}
                />
              </div>
               <div className="form-group">
                <label htmlFor="todoDeadline">Deadline</label>
                <div className="divider"></div>
                <DateTimePicker
                  id="todoDeadline"
                  value={this.state.deadline}
                  onChange={this.handleDateTime}
                  name="deadline"
                />
              </div>
              <div className="form-group">
                <label htmlFor="todoUrgencyPoint">Todo Urgency Point</label>
                <input
                    type="number"
                    name="urgency_point"
                    id="todoUrgencyPoint"
                    className="form-control"
                    required
                    onChange={this.onChange} 
                />
              </div>
              <div className="form-group">
               <label htmlFor="todoTags">Tags</label>
                <input
                    type="text"
                    name="tags"
                    id="todoTags"
                    className="form-control"
                    required
                    onChange={this.handleTags} 
                />
              </div>
              <label htmlFor="todoDetails">Details</label>
              <textarea
                className="form-control"
                placeholder="add details"
                id="todoDetails"
                name="details"
                rows="5"
                required
                onChange={this.onChange}
              />
              <button type="submit" className="btn custom-button mt-3">
                Create Todo
              </button>
              <Link to="/todos" className="btn btn-link mt-3">
                Back to todos
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }

}