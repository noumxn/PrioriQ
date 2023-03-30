import {ObjectId} from 'mongodb';
import {boards} from '../config/mongoCollections.js';
import userData from './users.js';
import boardData from './boards.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';

const exportedMethods = {
   /*
   * @param {boardId} string
   * @param {taskName} string 
   * @param {priority} number
   * @param {difficulty} string 
   * @param {estimatedTime} string
   * @param {deadline} date 
   * @param {description} string 
   * @param {assignedTo} array
   * @description This function creates a new task object and stores it in the database
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but function fails to create a task
   * @return {task} Returns the task that was just created
   **/
  async createTask(boardId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo) {
    validation.parameterCheck(boardId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
    validation.idCheck(boardId);
    validation.strValidCheck(taskName, difficulty, estimatedTime, description);
    validation.numberValidCheck(priority);
    validation.validDateCheck(deadline);
    validation.arrayValidCheck(assignedTo);
    for (let i in assignedTo) {
      validation.strValidCheck(i);
      helpers.checkUsername(i);
    }
    const newTask = {
        _id: new ObjectId(),
        taskName: taskName,
        priority: priority,
        difficulty: difficulty,
        estimatedTime: estimatedTime,
        deadline: deadline,
        description: description,
        assignedTo: assignedTo
    }

    const boardCollection = await boards();
    await boardCollection.findOneAndUpdate({_id: new ObjectId(boardId)}, {$push: {toDo: newTask}}); //How to check if this call succeeds?
    const task = await this.getTaskById(newTask._id);

    return task;
  },
  /*
   * @param {taskId} string
   * @description This function finds a task document by its id
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but function fails to find a task
   * @return {task} Returns the task that was just found
   **/
  async getTaskById(taskId) {
    validation.idCheck(taskId);

    const boardCollection = await boards();
    const foundTask = await boardCollection.findOne(
    {$or: [{'toDo._id': new ObjectId(taskId)}, {'inProgress._id': new ObjectId(taskId)}, {'done._id': new ObjectId(taskId)}]},
    {_id: 0, 'toDo.$': 1, 'inProgress.$': 1, 'done._id': 1});
    if (!foundTask) throw validation.throwErr('INTERNAL_SERVER_ERROR', `No task with given id found.`); //What kind of error/if at all should this be?
    
    if (foundTask.toDo.length === 0 && foundTask.inProgress === 0) {
      foundTask.done[0]._id = foundTask.done[0]._id.toString();
      return foundTask.done[0];
    }
    if (foundTask.inProgress === 0) {
      foundTask.toDo[0]._id = foundTask.toDo[0]._id.toString();
      return foundTask.toDo[0];
    }
    foundTask.inProgress[0]._id = foundTask.inProgress[0]._id.toString();
    return foundTask.inProgress[0];
  },

  /*
   * @param {taskId} string
   * @param {taskName} string 
   * @param {priority} number
   * @param {difficulty} string 
   * @param {estimatedTime} string 
   * @param {deadline} date 
   * @param {description} string 
   * @param {assignedTo} array
   * @description This function updates the task object defined by taskId within the database
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but function fails to update a task
   * @return {task} Returns the updated task
   **/
  async updateTask(taskId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo) {
    validation.parameterCheck(taskId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
    validation.idCheck(taskId);
    validation.strValidCheck(taskName, difficulty, estimatedTime, description);
    validation.numberValidCheck(priority);
    validation.validDateCheck(deadline);
    validation.arrayValidCheck(assignedTo);
    for (let i in assignedTo) {
      validation.strValidCheck(i);
      helpers.checkUsername(i);
    }

    const updatedTask = {
      _id: new ObjectId(taskId),
      taskName: taskName,
      priority: priority,
      difficulty: difficulty,
      estimatedTime: estimatedTime,
      deadline: deadline,
      description: description,
      assignedTo: assignedTo
  }

  const boardCollection = await boards();
    const updatedInfo = await boardCollection.findOneAndUpdate(
    {$or: [{'toDo._id': new ObjectId(taskId)}, {'inProgress._id': new ObjectId(taskId)}, {'done._id': new ObjectId(taskId)}]},
    {$set: [{_id: taskId}, {taskName: taskName}, {priority: priority}, {difficulty: difficulty}, {estimatedTime: estimatedTime},
    {deadline: deadline}, {description: description}, {assignedTo: assignedTo}]},
    {returnDocument: 'after'});
    if (updatedInfo.lastErrorObject.n === 0) {
      throw validation.throwErr('INTERNAL_SERVER_ERROR', `No task with given id found.`);
    };
  
    return await this.getTaskById(updatedTask._id);
  },
   /*
   * @param {taskId} string
   * @description This function deletes the task with the given id from the database
   * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but function fails to delete a task
   * @return {task} Returns the updated board with the successfully deleted task
   **/
  async deleteTask(taskId) {
    validation.idCheck(taskId);

    const foundTask = await boardCollection.updateOne(
    {$or: [{'toDo._id': new ObjectId(taskId)}, {'inProgress._id': new ObjectId(taskId)}, {'done._id': new ObjectId(taskId)}]},
    {$pull: {toDo: {_id: new ObjectId(taskId)} }}, 
    {$pull: {inProgress: {_id: new ObjectId(taskId)}} },
    {$pull: {done: {_id: new ObjectId(taskId)}} },
    {returnNewDocument: true});
    if (!foundTask) throw validation.throwErr('INTERNAL_SERVER_ERROR', `No task with given id found.`); //What kind of error/if at all should this be?

    return foundTask;
  },
};

export default exportedMethods;
