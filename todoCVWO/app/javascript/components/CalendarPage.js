import React from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import * as moment from 'moment';
export default class CalendarPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            todos: [],
            currDate: new Date(),
            currMonth: new Date(),
            errors: '',
            id: props.user_id
        }
        this.handleHeader = this.handleHeader.bind(this)
        this.handleDays = this.handleDays.bind(this)
        this.handleCells = this.handleCells.bind(this)
    }
   componentDidMount() {
        let id = this.state.id
        console.log(id)
        const url = "todos/index"
        fetch(url)
            .then(response => {
                if(response.ok){
                    return response.json();
                }
                throw new Error("Network response was not ok")
            })
            .then(response=> this.setState({
                todos: response.filter(function(todo) {
                    return todo.userID === id
                })
              }
              ))
            .catch(error=>console.log(error.message))
           
    }
    handleHeader() {
    const dateFormat = "MMMM YYYY";
    return (
        <div className="header row flex-middle">
        <div className="col col-start">
            <div className="icon" onClick={this.prevMonth}>
            Previous
            </div>
        </div>
        <div className="col col-center">
            <span>
           {moment(this.state.currMonth).format(dateFormat)}
            </span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
            <div className="icon">Next</div>
        </div>
        </div>
    );

    }   
    handleDays() {
        const dateFormat = "dddd";
        const days = [];
        let startDate = moment().startOf("isoWeek");
        
        for (let i = 0; i < 7; i++) {
            days.push(
            <div className="col col-center" key={i}>
                { moment(startDate._d).add(i,'days').format(dateFormat)}
            </div>
            );
        }
        return (<div className="days row">{days}</div>);
    }
    handleCells() {
        const currentMonth = this.state.currMonth
        const selectedDate = this.state.currDate;
        const monthStart = moment(currentMonth).startOf("month");
        const monthEnd = moment(currentMonth).endOf("month");
        const startDate = moment(currentMonth).startOf("isoWeek");
        const endDate = moment(currentMonth).endOf("isoWeek");
        const dateFormat = "D";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";
        while (day <= monthEnd) {
        for (let i = 0; i < 7; i++) {
            formattedDate = moment(day).format(dateFormat);
            const cloneDay = day;
            days.push(
            <div
                className={`col cell ${
                !moment(day).isSame(monthStart,'month')
                    ? "disabled"
                    : moment(day).isSame(selectedDate,'day') ? "selected" : ""
                }`}
                key={day}
                onClick={() => this.onDateClick(cloneDay)}
            >
                <div>
                {this.state.todos.map(todo => {
                    return moment(day).isSame(todo.deadline,'day') ? <p>{todo.title}</p> : null
                })}
                </div>
                <span className="number">{formattedDate}</span>
                <span className="bg">{formattedDate}</span>
            </div>
            );
            day = moment(day._d).add(1,'days')
           
        }
        rows.push(
            <div className="row" key={day}>
            {days}
            </div>
        );
        days = [];
        }
        return <div className="body">{rows}</div>;

    }
    onDateClick = (day) => {
        this.setState({
            currDate: day
        });
    }
    nextMonth = () => {
        this.setState({
            currMonth: moment(this.state.currMonth).add(1,"M")
        })
    }
    prevMonth = () => {
        this.setState({
            currMonth: moment(this.state.currMonth).add(-1,"M")
        })

    }
    render() {
        const style = {
            margin: "auto",
            width: "75%",
            height: "1000px",
            padding: "10px"
        }
        return(
            <div className="calendar" style={style}>
            {this.handleHeader()}
           
            {this.handleDays()}
           
            {this.handleCells()}
            </div>
        )
    }
}