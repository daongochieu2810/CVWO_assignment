import React from 'react';
import {Link} from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
export default class UpdateTodo extends React.Component {
    constructor(props){
        super(props)
        
        this.state = {
            title:"",
            details:"",
            deadline:"",
            urgency_point:0,
            done:false,
            tags: [],
            userID: 0,
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.stripHtmlEntities = this.stripHtmlEntities.bind(this)
        this.handleDateTime=this.handleDateTime.bind(this)
        this.handleTags=this.handleTags.bind(this)
    }
    handleTags() {
      var allTags = e.target.value;
      var Tags = allTags.split(",");
      this.setState({tags: Tags});

    }
    handleDateTime(e){
      let date = new Date(e)
      console.log("this is date from update " +date)
      this.setState({
        deadline: e
      })
    }
    stripHtmlEntities(str) {
        return String(str)
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
        // < and > are special characters
    }
    onChange(e) {
        
        e.target.name==="done" ? this.setState({done: !this.state.done}) :
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit(e) {
        e.preventDefault();
        let id = this.props.match.params.id
        const url = `/update/${id}`
        const { title,details,deadline,urgency_point,done,tags} = this.state
     
        if(title.length === 0) return
        const body = {
            title,
            details: details.replace(/\n/g,"<br> <br>"),
            deadline,
            urgency_point,
            done,
            tags
        }
      
        //security purpose
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url,{
            method: "PUT",
            headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if(response.ok){
                   
                    return response.json()
                }
                throw new Error("Cannot update")
            })
            .then(response => this.props.history.push(`/todo/${response.id}`))//go to newly created item
            .catch(error => console.log(error.message))
    }
    componentDidMount() {
        const url=`/show/${this.props.match.params.id}`
        fetch(url)
            .then(response=>{
                if(response.ok){
                    return response.json()
                }
                throw new Error("Cannot get item for update")
            })
            .then(response=>this.setState(()=>{
                console.log(response)
                return({
                title: response.title,
                details: response.details,
                deadline: response.deadline,
                urgency_point: response.urgency_point,
                done: response.done,
                tags: response.tags})
            }))
            .catch(error=>console.log(error.message))
            console.log(this.state)
    }
   
    render() {
    
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12 col-lg-6 offset-lg-3">
            <h1 className="font-weight-normal mb-5">
              Update Todo 
            </h1>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="todoTitle">Todo title</label>
                <input
                  defaultValue={this.state.title}
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
                  value={this.state.deadline==="" || this.state.deadline===null ?  "":new Date(this.state.deadline)}
                
                  onChange={this.handleDateTime}
                  name="deadline"
                />
              </div>
              <div className="form-group">
                <label htmlFor="todoUrgencyPoint">Todo Urgency Point</label>
                <input
                    value={parseInt(this.state.urgency_point,10)}
                    //placeholder={this.state.urgency_point}
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
                    defaultValue={this.state.tags.toString()}
                    required
                    onChange={this.handleTags} 
                />
              </div>
              <label htmlFor="todoDetails">Details</label>
              <textarea
                className="form-control"
                defaultValue={this.state.details}
                placeholder="add details"
                id="todoDetails"
                name="details"
                rows="5"
                required
                onChange={this.onChange}
              />
              <div className="custom-control custom-checkbox">
              <input  
                className="custom-control-input" 
                type="checkbox"
                name="done"
                onChange={this.onChange}
                checked={this.state.done}
                id="todoDone"
              />
              <label className="custom-control-label" htmlFor="todoDone">Done</label>
            </div>
            <br />
              <button type="submit" className="btn custom-button mt-3">
                Update
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