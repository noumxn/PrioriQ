import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import {boards} from '../config/mongoCollections.js';
import userData from './users.js'
import boardData from './boards.js';
import taskData from './tasks.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';


const exportedMethods = {
  async addTaskToCheckList(taskId, username) {
    const task = await taskData.getTaskById(taskId);
    const checkListItem = {
      taskId: task._id,
      taskName: task.taskName,
      completed: false
    }
    const user = await userData.getUserByUsername(username);
    user.checkList.push(checkListItem);

    const userCollection = await users();
    const updatedUser = await userCollection.updateOne(
      {username: username},
      {$set: {checkList: user.checkList}}
    );
    console.log(updatedUser);

    return await userData.getUserByUsername(username);
  },

  async completeCheckListItem(taskId, username) {
    const user = await userData.getUserByUsername(username);
    user.checkList.forEach(checkListItem => {
      if (checkListItem.taskId === taskId) {
        checkListItem.completed = true;
      }
    })

    const userCollection = await users();
    await userCollection.updateOne(
      {username: username},
      {$set: {checkList: user.checkList}}
    )

    return await userData.getUserByUsername(username);
  },
  async deleteTasksFromCheckList() {},
  async updateCheckListItem() {}
};

export default exportedMethods;
