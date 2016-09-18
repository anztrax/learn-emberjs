import React from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks';
import Task from './Task.jsx';

class App extends React.Component{
  handleSubmit(event){
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Tasks.insert({
      text,
      createdAt : new Date()
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }


  renderTasks(){
    return this.props.tasks.map(task => {
      return <Task key={task._id} task={task} />
    });
  }

  render(){
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" ref="textInput" placeholder="Type to add new Tasks" />
          </form>
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }
}

//this create container things inject props to App
export default createContainer(()=>{
  return {
    tasks : Tasks.find({}, { sort : {createdAt : -1 } }).fetch()
  }
},App);