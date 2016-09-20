import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

//this is use for publish tasks data
if(Meteor.isServer){
  Meteor.publish('tasks',function tasksPublications(){
    return Tasks.find({
      $or : [
        {private : { $ne : true}},
        {owner : this.userId}
      ]
    });
  });
}

function checkIsUserAuthorized(taskId){
  const task = Tasks.findOne(taskId);

  //make sure only the task owner can make a task private
  if(task.owner !== this.userId){
    throw new Meteor.Error('not-authorized');
    return false;
  }

  return true;
}

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
      username : Meteor.users.findOne(this.userId).username,
      private : true
    })
  },
  'tasks.remove'(taskId){
    check(taskId,String);

    if(checkIsUserAuthorized(taskId)) {
      Tasks.remove(taskId);
    }
  },
  'tasks.setChecked'(taskId,setChecked){
    check(taskId,String);
    check(setChecked,Boolean);

    if(checkIsUserAuthorized(taskId)) {
      Tasks.update(taskId,{ $set : { checked : setChecked }});
    }
  },
  'tasks.setPrivate'(taskId,setToPrivate){
    check(taskId,String);
    check(setToPrivate,Boolean);

    if(checkIsUserAuthorized(taskId)){
      Tasks.update(taskId, { $set : { private : setToPrivate }});
    }
  }
})