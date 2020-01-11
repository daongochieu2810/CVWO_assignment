import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
import Home from "../components/Home";
import NavBar from "../components/NavBar";
import Todos from "../components/Todos";
import Todo from "../components/Todo";
import NewTodo from "../components/NewTodo";
import UpdateTodo from "../components/UpdateTodo";
export default (
  <Router>
    <NavBar></NavBar>
    <Switch>
      
      <Route path="/" exact component={Home} />
      <Route path="/todos" exact component={Todos} />
      <Route path="/todo/:id" exact component={Todo} />
      <Route path="/todo" exact component={NewTodo} />
      <Route path="/update/:id" exact component={UpdateTodo} />
    </Switch>
  </Router>
);