import React from 'react';
import {Link} from 'react-router-dom';
import Background from './background.png';
import * as moment from 'moment';

export default class Todos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            filtered: []
        }
        this.clearList = this.clearList.bind(this)
        this.checkDone = this.checkDone.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.getCurrentDate=this.getCurrentDate.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        
    }
    handleSearch(e) {
      var search = e.target.value;
      var current = this.state.todos;
      let newList;
      if(search!=="" && search!==null) {
      
        newList = current.filter(item => {
        for(var i = 0; i < item.tags.length;i++)
        {
        const toBeSearched = item.tags[i].toLowerCase();
        console.log(toBeSearched);
        const filter = search.toLowerCase();
        if(toBeSearched.includes(filter)) return true;
        else if(i===item.tags.length-1) return false;
        
        }
        })
      }
      else {
        newList = current;

      }
      this.setState({
        filtered: newList
      })
    
    }
    getCurrentDate(separator='-'){
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();

      return `${hours}${":"}${minutes<10 ? `0${minutes}`:`${minutes}`}${" "}${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
}
    clearList() {
     for(var i =0;i<this.state.todos.length;i++){
        const ID = this.state.todos[i].id
        const url = `/destroy/${ID}`
        const token = document.querySelector(`meta[name=csrf-token]`).content
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
                throw new Error("Cannot delete the list")
            })
            .then(()=>this.props.history.push("/"))
            .catch(error=>console.log(error.message))
        }
       
    }
    deleteItem(id,index,e){
      let updatedTodos = [...this.state.todos]
      updatedTodos.splice(index,1)
      this.setState({todos: updatedTodos})
      const url=`/destroy/${id}`
      const token=document.querySelector(`meta[name=csrf-token]`).content
      fetch(url,{
        method: "DELETE",
        headers: {
          "X-CSRF_Token": token,
          "Content-Type": "application/json"
        }
      })
        .then(response=>{
          if(response.ok){
            return response.json()
          }
          throw new Error("Cannot delete item from all todos")
        })
        .then(()=>this.props.history.push("/todos"))
        .catch(error=>console.log(error.message))
    }
    checkDone(todo,index,e) {
      console.log(todo,index,e.target)
      let updatedTodos = [...this.state.todos]
      updatedTodos[index].done = !updatedTodos[index].done
      this.setState({todos: updatedTodos})
      const url=`/update/${todo.id}`
      const body = this.state.todos[index]
      console.log(body)
      const token = document.querySelector(`meta[name=csrf-token]`).content;
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
          throw new Error("Cannot get item")
        })
        .then(()=>this.props.history.push("/todos"))
        .catch(error=>console.log(error.message))
    }
  
    componentDidMount() {
        const url = "todos/index"
        fetch(url)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
                throw new Error("Network response was not ok")
            })
            .then(response=> this.setState({
              todos: response,
              filtered: response
              }))
            .catch(()=>this.props.history.push("/"))
     
           
    }    
    render() {
   
    const todos  = this.state.todos;
    const filtered = this.state.filtered;
    
    
    const allTodos = filtered.map((todo, index) => {
        var date = moment(todo.deadline).format("HH:MM DD-MM-YYYY")
        var createTime = moment(todo.created_at).format("HH:MM DD-MM-YYYY")
        let now = this.getCurrentDate()
        console.log(now)
        var ms = moment(now,"HH:MM DD-MM-YYYY").diff(moment(date,"HH:MM DD-MM-YYYY"));
        var d = moment.duration(ms);
        
        var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        let hoursDiff = -(d.asHours())
        
        let daysLeft = Math.floor(hoursDiff/24)
        console.log(daysLeft)

        let hoursLeft = hoursDiff - daysLeft*24
        console.log(hoursLeft)
        let theme="card-body text-muted text-black"
        if(todo.urgency_point>=10 && !todo.done) theme = 'card-body bg-danger text-white'
        else if(todo.urgency_point>=5 && todo.urgency_point<10 && !todo.done) theme = 'card-body bg-primary text-white'
        else if(todo.done) theme="card-body text-white bg-success"
        return(
      <div key={index} className="col-md-6 col-lg-4">
        <div className="card mb-4">
         
          <div className={theme}>
            <h5 className="card-title">{todo.title}</h5>
            <h6 className="card-text">Deadline: {date}</h6>
            <h6 className="card-text">Details: {todo.details}</h6>
            <h6 className="card-text">Urgency Point: {todo.urgency_point}</h6>
            <h6 className="card-text">Time created: {createTime}</h6>
            <h6 className="card-text">Time left: {daysLeft} days and {hoursLeft} hours left</h6>
            <h6 className="card-text">Tags: {todo.tags.map((tag,index) =><span className="badge badge-info ml-2">{tag}</span>)}</h6>
          
            <div className="custom-control custom-checkbox">
              <input  
                className="custom-control-input" 
                type="checkbox"
                onChange={(e) => this.checkDone(todo,index,e)}
                checked={todo.done}
                id={todo.id}
              />
              
              <label className="custom-control-label" htmlFor={todo.id}>Done</label>
            </div>
           
            <br />
            <Link to={`/update/${todo.id}`} className="btn custom-button text-white">
            Edit Todo
            </Link>
            <div className="divider"></div>
            <Link to={`/todo/${todo.id}`} className="btn custom-button">
              View Todo
            </Link>
            <div className="divider"></div>
            <button
              className="btn custom-button"
              onClick={(e) => this.deleteItem(todo.id,index,e)}
            >
            Delete Todo
            </button>
          </div>
        </div>
      </div>
    )});
    const noTodo = (
      <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
        <h4>
          No todos yet. Why not <Link to="/todo">create one</Link>
        </h4>
      </div>
    );
    const background = {
      width: "100%",
      height: "100%",
      backgroundImage: `url(${Background})`
    }
    let activeButton = "btn custom-button"
    let disabledButton = "btn custom-button disabled"
    const selectedTags = tags => console.log(tags);
    
    return (
      <>
        <section className="jumbotron jumbotron-fluid text-center"  style={background}>
          <div className="container py-5">
            <h1 className="display-4">You have {this.state.todos.length} {this.state.todos.length>1 ? "jobs":"job"} to do</h1>
            <p className="lead text-black" >
              {this.state.todos.length===0 ? "Yay! Free!" : "Finish them soon!"}
            </p>
          </div>
        </section>
        <div className="py-5">
         
          <main className="container">
            <div className="active-cyan-3 active-cyan-4 mb-4">
              <input 
                className="form-control" 
                type="text" 
                placeholder="Search for Tags" 
                aria-label="Search"
                onChange={this.handleSearch}
              />
            </div>
            <div className="text-right mb-3">
              <Link to="/todo" className="btn custom-button">
                Create New Todo
              </Link>
            </div>
            <div className="row">
              {todos.length > 0 ? allTodos : noTodo}
            </div>
            <button 
              className={todos.length >0 ? activeButton: disabledButton} 
              onClick={this.clearList}
              aria-disabled={todos.length>0? "false":"true"}
            >Delete All</button>
          </main>
        </div>
      </>
    );
  
}
}