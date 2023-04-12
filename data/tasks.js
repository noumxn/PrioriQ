import {ObjectId} from 'mongodb';
import {boards} from '../config/mongoCollections.js';
import validation from '../utils/validation.js';
import boardData from './boards.js';
import helpers from './helpers.js';
import sorting from './sortingAlgorithms.js';
import userData from './users.js';

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
  * @return {boardWithNewTask} Returns the board document with the newly created task in the toDo array
  **/
  async createTask(boardId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo) {
    // TODO: Check if the board task is being created for is set to priority or difficulty.
    //       Based on that, you either priority or difficulty is set to null. and the other one requires values from the user.
    validation.parameterCheck(boardId, taskName, estimatedTime, deadline, description, assignedTo);
    validation.idCheck(boardId);
    validation.strValidCheck(taskName, difficulty, estimatedTime, description);
    taskName = helpers.checkTaskName(taskName);
    difficulty = helpers.checkDifficulty(difficulty);
    description = helpers.checkDescription(description);
    priority = helpers.checkPriority(priority);
    validation.validDateCheck(deadline);
    validation.arrayValidCheck(assignedTo);
    for (let i in assignedTo) {
      validation.strValidCheck(assignedTo[i]);
      // Making sure the user actually exsits
      await userData.getUserByUsername(assignedTo[i]);
      // TODO: Need to make sure user is not on the blocked users list on the specific board, otherwise throw 'FORBIDDEN'
      // TODO: Need to make sure user is existing, and part in allowed users list on the specific board, otherwise throw 'UNAUTHORIZED'
    }
    const createdAt = new Date().toISOString();


    const newTask = {
      _id: new ObjectId(),
      taskName: taskName,
      createdAt: createdAt,
      priority: priority,
      difficulty: difficulty,
      estimatedTime: estimatedTime,
      deadline: deadline,
      description: description,
      assignedTo: assignedTo
    }


    const boardCollection = await boards();
    const boardWithNewTask = await boardCollection.findOneAndUpdate(
      {_id: new ObjectId(boardId)},
      {$push: {toDo: newTask}},
      {returnNewDocument: true});
    if (!boardWithNewTask) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not insert new task into board.`)
    boardWithNewTask.value._id = boardWithNewTask.value._id.toString();
    //-----------------------------------------------------------------------------------------------------------------
    // ignore this please
    //-----------------------------------------------------------------------------------------------------------------
    // // Sorting board to accomodate new task
    // let sortedBoard;
    // if (boardWithNewTask.priorityScheduling === true) {
    //   sortedBoard = await sorting.priorityBasedSorting(boardWithNewTask.value._id);
    // } else if (boardWithNewTask.priorityScheduling === false && boardWithNewTask.sortOrder === 'asc') {
    //   sortedBoard = await sorting.difficultyBasedSortAscending(boardWithNewTask.value._id)
    // } else if (boardWithNewTask.priorityScheduling === false && boardWithNewTask.sortOrder === 'desc') {
    //   sortedBoard = await sorting.difficultyBasedSortDescending(boardWithNewTask.value._id)
    // }
    // sortedBoard._id = sortedBoard._id.toString();
    //-----------------------------------------------------------------------------------------------------------------

    return await boardData.getBoardById(boardWithNewTask.value._id);
  },

  /*
   * @param {taskId} string
   * @description This function finds a task document by its id
   * @throws {NOT_FOUND} if all valid params are provided but function fails to find a task
   * @return {task} Returns the task that was just found
   **/
  async getTaskById(taskId) {
    validation.parameterCheck(taskId);
    taskId = validation.idCheck(taskId);


    const boardCollection = await boards();

    const foundTask = await boardCollection.findOne(
      {$or: [{'toDo._id': new ObjectId(taskId)}, {'inProgress._id': new ObjectId(taskId)}, {'done._id': new ObjectId(taskId)}]},
      {_id: 0, 'toDo.$': 1, 'inProgress.$': 1, 'done.$': 1});
    if (!foundTask) throw validation.returnRes('NOT_FOUND', `No task with ID: '${taskId}'`);

    if (foundTask.toDo.length === 0 && foundTask.inProgress.length === 0) {
      foundTask.done[0]._id = foundTask.done[0]._id.toString();
      return foundTask.done[0];
    }
    if (foundTask.inProgress.length === 0) {
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
   * @throws {NOT_FOUND} if all valid params are provided but function fails to update a task
   * @return {task} Returns the updated task.
   **/
  async updateTask(taskId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo) {
    validation.parameterCheck(taskId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo);
    validation.idCheck(taskId);
    validation.strValidCheck(taskName, difficulty, estimatedTime, description);
    taskName = helpers.checkTaskName(taskName);
    difficulty = helpers.checkDifficulty(difficulty);
    description = helpers.checkDescription(description);
    priority = helpers.checkPriority(priority);
    validation.validDateCheck(deadline);
    validation.arrayValidCheck(assignedTo);
    for (let i in assignedTo) {
      validation.strValidCheck(assignedTo[i]);
      // Making sure the user actually exsits
      await userData.getUserByUsername(assignedTo[i]);
      // TODO: Need to make sure user is not on the blocked users list on the specific board, otherwise throw 'FORBIDDEN'
      // TODO: Need to make sure user is existing, and part in allowed users list on the specific board, otherwise throw 'UNAUTHORIZED'
    }
    const createdAt = new Date().toISOString();

    const boardCollection = await boards();
    let updatedInfo = undefined;

    // First checks toDo list, then inProgress, then done.
    // This is ugly, but I couldn't find a nicer way to do it.
    updatedInfo = await boardCollection.findOneAndUpdate(
      {'toDo._id': new ObjectId(taskId)},
      {
        $set: {'toDo.$.createdAt': createdAt, 'toDo.$.taskName': taskName, 'toDo.$.priority': priority, 'toDo.$.difficulty': difficulty, 
        'toDo.$.estimatedTime': estimatedTime, 'toDo.$.deadline': deadline, 'toDo.$.description': description, 'toDo.$.assignedTo': assignedTo}
      },
      {returnDocument: 'after'});
      if (updatedInfo.lastErrorObject.n !== 0) {
        return await this.getTaskById(taskId);
      };

    updatedInfo = await boardCollection.findOneAndUpdate(
      {'inProgress._id': new ObjectId(taskId)},
      {
        $set: {'inProgress.$.createdAt': createdAt, 'inProgress.$.taskName': taskName, 'inProgress.$.priority': priority, 'inProgress.$.difficulty': difficulty, 
        'inProgress.$.estimatedTime': estimatedTime, 'inProgress.$.deadline': deadline, 'inProgress.$.description': description, 'inProgress.$.assignedTo': assignedTo}
      },
      {returnDocument: 'after'});
      if (updatedInfo.lastErrorObject.n !== 0) {
        return await this.getTaskById(taskId);
      };

    updatedInfo = await boardCollection.findOneAndUpdate(
      {'done._id': new ObjectId(taskId)},
      {
        $set: {'done.$.createdAt': createdAt, 'done.$.taskName': taskName, 'done.$.priority': priority, 'done.$.difficulty': difficulty, 
        'done.$.estimatedTime': estimatedTime, 'done.$.deadline': deadline, 'done.$.description': description, 'done.$.assignedTo': assignedTo}
      },
      {returnDocument: 'after'});
      if (updatedInfo.lastErrorObject.n !== 0) {
        return await this.getTaskById(taskId);
      };
 
    if (updatedInfo.lastErrorObject.n === 0) {
      throw validation.returnRes('NOT_FOUND', `No task with given id found.`);
    };

    return await this.getTaskById(taskId);
  },
  /*
  * @param {taskId} string
  * @description This function deletes the task with the given id from the database
  * @throws {NOT_FOUND} if all valid params are provided but function fails to delete a task
  * @return {task} Returns the updated board with the successfully deleted task
  **/
  async deleteTask(taskId) {
    validation.parameterCheck(taskId);
    validation.idCheck(taskId);

    const boardCollection = await boards();

    const updatedBoard = await boardCollection.updateOne(
      {$or: [{'toDo._id': new ObjectId(taskId)}, {'inProgress._id': new ObjectId(taskId)}, {'done._id': new ObjectId(taskId)}]},
      {$pull: {toDo: {_id: new ObjectId(taskId)}}},
      {$pull: {inProgress: {_id: new ObjectId(taskId)}}},
      {$pull: {done: {_id: new ObjectId(taskId)}}},
      {returnNewDocument: true});
    if (!updatedBoard) throw validation.returnRes('NOT_FOUND', `No task with given id found in board.`);

    return updatedBoard;
  },
};

export default exportedMethods;
