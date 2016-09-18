import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

/**
 * by default meteor insecure :
 * - meteor remove insecure
 *
 * by default meteor is autopublish :
 * - autopublish package, which automatically synchronizes all of the database contents to the client
 */

class App extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      hideCompleted : false
    }
  }
  handleSubmit(event){
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('tasks.insert',text);

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }


  renderTasks(){
    let filteredTask = this.props.tasks;
    if(this.state.hideCompleted){
      filteredTask = filteredTask.filter(task => !task.checked);
    }
    return filteredTask.map(task => {
      return <Task key={task._id} task={task} />
    });
  }

  toggleHideCompleted(){
    this.setState({
      hideCompleted : !this.state.hideCompleted
    })
  }

  renderAddNewTask(){
    if(this.props.currentUser){
      return (
        <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" ref="textInput" placeholder="Type to add new Tasks" />
        </form>
      )
    }else{
      return '';
    }
  }

  render(){
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
          </label>

          <AccountsUIWrapper />
          {/* this information will be showed when user login*/}
          { this.renderAddNewTask() }

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
    tasks : Tasks.find({}, { sort : {createdAt : -1 } }).fetch(),
    incompleteCount : Tasks.find({checked : { $ne : true} }).count(),
    currentUser : Meteor.user()
  }
},App);