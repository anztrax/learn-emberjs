import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks';
import classNames from 'classnames';


export default class Task extends React.Component{
  constructor(props){
    super(props);
  }

  deleteThisTask(){
    Meteor.call('tasks.remove',this.props.task._id);
  }

  toggleChecked() {
    Meteor.call('tasks.setChecked',this.props.task._id,this.props.task.checked);
  }

  togglePrivate(){
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }

  _renderPrivateButton() {
    const buttonText = this.props.task.private ? 'Private' : 'Public';
    if(this.props.showPrivateButton){
      return (
        <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
          {buttonText}
        </button>
      );
    }else{
      return '';
    }
  }

  render(){
    //const taskClassName = this.props.task.checked ? 'checked' : '';
    const taskClassName = classNames({
      checked : this.props.task.checked,
      private : this.props.task.private
    })

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)} />

        {this._renderPrivateButton.bind(this)()}

        <span className="text">
          <strong>{ this.props.task.username }</strong> : { this.props.task.text }
        </span>
      </li>
    )
  }
}