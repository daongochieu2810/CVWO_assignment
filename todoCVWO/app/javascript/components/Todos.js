import React from 'react';
import {Link} from 'react-router-dom';
import Background from './background.png';
import * as moment from 'moment';

export default class Todos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            filtered: [],
            userID: props.user_id
        }
        this.clearList = this.clearList.bind(this)
        this.checkDone = this.checkDone.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.getDeadlineDate=this.getDeadlineDate.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.modifyTitle=this.modifyTitle.bind(this)
        this.handleSort=this.handleSort.bind(this)
        
    }
    handleSort(e) {
      var Value = e.target.value
      var updatedTodos = [...this.state.todos]
      if(Value==="urgency_point")
      {
        updatedTodos.sort(
          function(a, b)
          {return -a.urgency_point+b.urgency_point}
        )
        this.setState({
          todos: updatedTodos,
          filtered: updatedTodos
        })
      }
      else {
        updatedTodos.sort(
          function(a, b)
          {
            var deadlineA = new Date(Date.parse(a.deadline))
            var deadlineB = new Date(Date.parse(b.deadline))
            
            return deadlineA > deadlineB ? -1 : 1
          }
        )
        this.setState({
          todos: updatedTodos,
          filtered: updatedTodos
        })
      }
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
   
    getDeadlineDate(newDate) {
        
        let separator="-";
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
      let updatedTodos = [...this.state.filtered]
    
      updatedTodos.splice(index,1)
      this.setState({filtered: updatedTodos})
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
     
      let updatedTodos = [...this.state.todos]
      updatedTodos[index].done = !updatedTodos[index].done
      this.setState({todos: updatedTodos})
      const url=`/update/${todo.id}`
      const body = this.state.todos[index]
    
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
        var id = this.state.userID
        const url = "todos/index"
        fetch(url)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
                throw new Error("Network response was not ok")
            })
            .then(response=> this.setState({
              todos: response.filter( function(todo) {
                return todo.userID===id
              }
              ),
              filtered: response.filter( function(todo) {
                return todo.userID===id
              }
              )
              }))
            .catch(error=>console.log(error.message))
     
           
    }   
    modifyTitle(title) {
      title = title.substr(0,30)
      title +="..."
      return title

    } 
    render() {
   
    const todos  = this.state.todos;
    const filtered = this.state.filtered;
    const styleL ={
      float: "left"
    }
    const styleR ={
      float: "right"
    }
    const style = {
      margin: "30px 0px 100px -10px"
    }
    
    const allTodos = filtered.map((todo, index) => {
        
        //time processing
        var deadline = new Date(Date.parse(todo.deadline))
        var now = new Date()
        var date = this.getDeadlineDate(deadline)//to show
        
        var createTime = moment(todo.created_at).format("HH:MM DD-MM-YYYY")
        var ms = moment(now,"YYYY-MM-DDTHH:mm:ss.sss").diff(moment(deadline,"YYYY-MM-DDTHH:mm:ss.sss"));
        var d = moment.duration(ms);
       
        let minutesDiff = -(d.asMinutes())
          
        let daysLeft = Math.floor(minutesDiff/1440)
        let hoursLeft = Math.floor((minutesDiff - daysLeft*1440)/60)
        let minutesLeft = Math.floor(minutesDiff - hoursLeft*60-daysLeft*1440)

        
        let theme="card-body text-muted text-black"
        if(todo.urgency_point>=10 && !todo.done) theme = 'card-body bg-danger text-white'
        else if(todo.urgency_point>=5 && todo.urgency_point<10 && !todo.done) theme = 'card-body bg-primary text-white'
        else if(todo.done) theme="card-body text-white bg-success"
        return(
      <div key={index} className="col-md-6 col-lg-4">
        <div className="card mb-4">
         
          <div className={theme}>
            <h5 className="card-title">{todo.title.length <=30 ? todo.title : this.modifyTitle(todo.title)}</h5>
            <h6 className="card-text">Deadline: {date}</h6>
            {minutesDiff>0 ? <h6 className="card-text">Time left: {daysLeft>0 ? daysLeft +" day(s) " : ""} {hoursLeft>0 ? hoursLeft + " hour(s) left" :""} {minutesLeft>0  ? minutesLeft+" minute(s) left": ""}</h6> : <h6 className="card-text">Deadline has already passed!</h6>}
            <h6 className="card-text">Tags: {todo.tags.map((tag,index) =><span key={index} className="badge badge-info ml-2">{tag}</span>)}</h6>
            <div className="dropdown">
              <button className="btn custom-button btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              More Info
              </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
             <h6 className="dropdown-item card-text">Details: {todo.details}</h6>
            <h6 className="dropdown-item card-text">Urgency Point: {todo.urgency_point}</h6>
            <h6 className="dropdown-item card-text">Time created: {createTime}</h6>
            </div>
            </div>
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
            <div className="container" style={style}>
            <div style={styleL}>
              <Link to="/todo" className="btn custom-button">
                Create New Todo
              </Link>
            </div>
            <div className="dropdown" style={styleR}>
              <button className="btn custom-button dropdown-toggle" type="button" id="dropdownSort" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Sort by
              </button>
            <div className="dropdown-menu" aria-labelledby="dropdownSort">
             <button 
              className="dropdown-item card-text"
              onClick={this.handleSort}
              value="urgency_point"
              >Urgency Point (Default)
             </button>
              <button 
              className="dropdown-item card-text"
              onClick={this.handleSort}
              value="time_left"
              >
              Time Left (Decreasing)
              </button>
           
            
            </div>
            </div>
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