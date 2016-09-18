import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

//we define method here
Meteor.methods({
  //this is for insert things
  'tasks.insert'(text){
    check(text,String);

    //make sure the user is logged in before inserting a task
    if(!this.userId){
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt : new Date(),
      owner : this.userId,
      username : Meteor.users.findOne(this.userId).username
    })
  },

  //this is used for remove task
  'tasks.remove'(taskId){
    check(taskId,String);
    Tasks.remove(taskId);
  },

  //this is for set checked
  'tasks.setChecked'(taskId,setChecked){
    check(taskId,String);
    check(setChecked,Boolean);

    Tasks.update(taskId,{ $set : { checked : setChecked }});
  }
})