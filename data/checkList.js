import {users} from '../config/mongoCollections.js';
import validation from '../utils/validation.js';
import taskData from './tasks.js';
import userData from './users.js';


const exportedMethods = {
  async addTaskToCheckList(taskId, username) {
    // TODO: Make sure user is in the 'assignedTo' list before letting them add task to checkList. Throw 'UNAUTHORIZED'
    const task = await taskData.getTaskById(taskId);
    const checkListItem = {
      taskId: task._id,
      taskName: task.taskName,
      completed: false
    }
    const user = await userData.getUserByUsername(username);
    user.checkList.push(checkListItem);

    const userCollection = await users();
    await userCollection.updateOne(
      {username: username},
      {$set: {checkList: user.checkList}}
    );

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
    );

    return await userData.getUserByUsername(username);
  },

  async deleteTasksFromCheckList(username) {
    const user = await userData.getUserByUsername(username);
    const completedItems = user.checkList.filter(checkListItem => checkListItem.completed === true);
    for (let i = 0; i < completedItems.length; i++) {
      const taskId = completedItems[i].taskId;
      await taskData.moveToDone(taskId)
    }
    user.checkList = user.checkList.filter(checkListItem => checkListItem.completed === false)
    const userCollection = await users();
    await userCollection.updateOne(
      {username: username},
      {$set: {checkList: user.checkList}}
    );

    return await userData.getUserByUsername(username);
  },

  async updateCheckListItem(taskId, updatedName) {
    const allUsers = await userData.getAllUsers();
    for (let user of allUsers) {
      for (let checkListItem of user.checkList) {
        if (checkListItem.taskId === taskId) {
          if (checkListItem.taskName === updatedName) {
            return validation.returnRes('NO_CHANGE', `No changes were made.`);
          }
          checkListItem.taskName = updatedName;
        }
      }
      const userCollection = await users();
      await userCollection.updateOne(
        {_id: user._id},
        {$set: {checkList: user.checkList}}
      );
    }

  }

};

export default exportedMethods;
