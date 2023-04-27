//import {helpers} from 'handlebars';
import {users} from '../config/mongoCollections.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';
import taskData from './tasks.js';
import userData from './users.js';


const exportedMethods = {
  async addTaskToCheckList(taskId, username) {
    validation.parameterCheck(taskId, username);
    validation.strValidCheck(taskId, username);
    taskId = validation.idCheck(taskId);

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
  },

  async completeCheckListItem(taskId, username) {
    validation.parameterCheck(taskId, username);
    validation.strValidCheck(taskId, username);
    taskId = validation.idCheck(taskId);

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
  },

  async deleteTasksFromCheckList(username) {
    validation.parameterCheck(username);
    validation.strValidCheck(username);

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
  },

  async updateCheckListItem(taskId, taskName) {
    validation.parameterCheck(taskId, taskName);
    validation.strValidCheck(taskId, taskName);
    taskName = helpers.checkTaskName(taskName);
    taskId = validation.idCheck(taskId);

    const allUsers = await userData.getAllUsers();
    for (let user of allUsers) {
      let checkList = user.checkList;
      let checkListItemIndex = checkList.findIndex(checkListItem => checkListItem.taskId === taskId);
      if (checkListItemIndex !== -1) {
        if (checkList[checkListItemIndex].taskName === taskName) {return validation.returnRes('NO_CONTENT', `No changes were made.`)}
        checkList[checkListItemIndex].taskName = taskName;
        const userCollection = await users();
        await userCollection.updateOne(
          {username: user.username},
          {$set: {checkList: checkList}}
        );
      }
    }
  }


};

export default exportedMethods;
