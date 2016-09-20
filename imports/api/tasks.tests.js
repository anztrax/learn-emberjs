/* eslint-env mocha */

//In any test we need to ensure the database is in the state we expect before beginning. We can use Mocha's beforeEach construct to that easily:
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks';

if(Meteor.isServer){
  describe('Tasks',() => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text : 'test task',
          createdAt : new Date(),
          owner : userId,
          username : 'tmeasday',
        });
      });

      it('can delete owned task', ()=> {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        //set up a fake method invocation
        const invocation = { userId };
        deleteTask.apply(invocation,[taskId]);
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}