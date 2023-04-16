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
    validation.parameterCheck(boardId, taskName, estimatedTime, deadline, description, assignedTo);
    validation.idCheck(boardId);
    validation.strValidCheck(taskName, estimatedTime, description);
    taskName = helpers.checkTaskName(taskName);
    description = helpers.checkDescription(description);
    validation.validDateCheck(deadline);
    validation.arrayValidCheck(assignedTo);

    const boardCollection = await boards();
    const originBoard = await boardData.getBoardById(boardId);

    for (let i in assignedTo) {
      validation.strValidCheck(assignedTo[i]);
      // Making sure the user actually exsits
      await userData.getUserByUsername(assignedTo[i]);
      // Makes sure each user in assignedTo is not blocked from the board and is allowed access to the board
      if (originBoard.blockedUsers.includes(assignedTo[i])) {
        throw validation.returnRes('FORBIDDEN', `${assignedTo[i]} is blocked from the board.`);
      }
      // This can be uncommented after Athena implements adding the creator of the board to the allowed users list upon creation
     // if (!originBoard.allowedUsers.includes(assignedTo[i])) {
     //   throw validation.returnRes('UNAUTHORIZED', `${assignedTo[i]} has not been added to the board.`)
     // }
    }

    if (originBoard.priorityScheduling) {
      priority = helpers.checkPriority(priority);
      difficulty = null;
    }
    else {
      difficulty = helpers.checkDifficulty(difficulty);
      priority = null;
    }
    const createdAt = new Date().toISOString();

    if (!difficulty) {}
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
  * @description This function gets the board to which the task with the given id belongs
  * @throws {NOT_FOUND} if all valid params are provided but function fails to find a board
  * @return {board} Returns the found board
  **/
  async getBoardByTaskId(taskId) {
    validation.parameterCheck(taskId);
    taskId = validation.idCheck(taskId);
    const boardCollection = await boards();

    const board = await boardCollection.findOne(
      {$or: [{'toDo._id': new ObjectId(taskId)}, {'inProgress._id': new ObjectId(taskId)}, {'done._id': new ObjectId(taskId)}]});
      if (!board) throw validation.returnRes('NOT_FOUND', `No board with a task with ID: '${taskId}'`);
    board._id = board._id.toString();
    return board;
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
    validation.parameterCheck(taskId, taskName, estimatedTime, deadline, description, assignedTo);
    taskId = validation.idCheck(taskId);
    validation.strValidCheck(taskName, estimatedTime, description);
    estimatedTime = estimatedTime.trim();
    description = description.trim();
    taskName = helpers.checkTaskName(taskName);
    validation.validDateCheck(deadline);
    validation.arrayValidCheck(assignedTo);

    const boardCollection = await boards();
    const originBoard = await this.getBoardByTaskId(taskId);

    for (let i in assignedTo) {
      validation.strValidCheck(assignedTo[i]);
      // Making sure the user actually exsits
      await userData.getUserByUsername(assignedTo[i]);
      if (originBoard.blockedUsers.includes(assignedTo[i])) {
        throw validation.returnRes('FORBIDDEN', `${assignedTo[i]} is blocked from the board.`);
      }
      // This can be uncommented after Athena implements adding the creator of the board to the allowed users list upon creation
     // if (!originBoard.allowedUsers.includes(assignedTo[i])) {
     //   throw validation.returnRes('UNAUTHORIZED', `${assignedTo[i]} has not been added to the board.`)
     // }
    }
    if (originBoard.priorityScheduling) {
      priority = helpers.checkPriority(priority);
      difficulty = null;
    }
    else {
      difficulty = helpers.checkDifficulty(difficulty);
      priority = null;
    }
    const createdAt = new Date().toISOString();

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
  * @return {board} Returns the updated board with the successfully deleted task
  **/
  async deleteTask(taskId) {
    validation.parameterCheck(taskId);
    validation.idCheck(taskId);

    const boardCollection = await boards();
    const board = await this.getBoardByTaskId(taskId);

    const updatedBoard = await boardCollection.updateOne(
      {$or: [{'toDo._id': new ObjectId(taskId)}, {'inProgress._id': new ObjectId(taskId)}, {'done._id': new ObjectId(taskId)}]},
      {$pull: {toDo: {_id: new ObjectId(taskId)}}},
      {$pull: {inProgress: {_id: new ObjectId(taskId)}}},
      {$pull: {done: {_id: new ObjectId(taskId)}}},
      {returnNewDocument: true});
    if (!updatedBoard) throw validation.returnRes('NOT_FOUND', `No task with given id found in board.`);

    return await boardData.getBoardById(board._id.toString());
  },

 /*
  * @param {taskId} string
  * @description This function moves the task from wherever it is to the toDo list on the board
  * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but function fails to move task
  * @return {boardWithMovedTask} Returns the updated board with the successfully moved task
  **/
  async moveToToDo(taskId) {
    validation.parameterCheck(taskId);
    validation.idCheck(taskId);

    const taskToMove = await this.getTaskById(taskId);

    const boardCollection = await boards();
    const board = await this.getBoardByTaskId(taskId);

    await this.deleteTask(taskId);

    const boardWithMovedTask = await boardCollection.findOneAndUpdate(
      {_id: new ObjectId(board._id)},
      {$push: {toDo: taskToMove}},
      {returnNewDocument: true});

    if (!boardWithMovedTask) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not move task to 'To Do' column on board.`)
    boardWithMovedTask.value._id = boardWithMovedTask.value._id.toString();
    return await boardData.getBoardById(boardWithMovedTask.value._id);
  },

 /*
  * @param {taskId} string
  * @description This function moves the task from wherever it is to the inProgress list on the board
  * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but function fails to move task
  * @return {boardWithMovedTask} Returns the updated board with the successfully moved task
  **/
  async moveToInProgress(taskId) {
    validation.parameterCheck(taskId);
    validation.idCheck(taskId);

    const taskToMove = await this.getTaskById(taskId);

    const boardCollection = await boards();
    const board = await this.getBoardByTaskId(taskId);

    await this.deleteTask(taskId);

    const boardWithMovedTask = await boardCollection.findOneAndUpdate(
      {_id: new ObjectId(board._id)},
      {$push: {inProgress: taskToMove}},
      {returnNewDocument: true});

    if (!boardWithMovedTask) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not move task to 'In Progress' column on board.`)
    boardWithMovedTask.value._id = boardWithMovedTask.value._id.toString();
    return await boardData.getBoardById(boardWithMovedTask.value._id);
  },

 /*
  * @param {taskId} string
  * @description This function moves the task from wherever it is to the done list on the board
  * @throws {INTERNAL_SERVER_ERROR} if all valid params are provided but function fails to move task
  * @return {boardWithMovedTask} Returns the updated board with the successfully moved task
  **/
  async moveToDone(taskId) {
    validation.parameterCheck(taskId);
    validation.idCheck(taskId);

    const taskToMove = await this.getTaskById(taskId);

    const boardCollection = await boards();
    const board = await this.getBoardByTaskId(taskId);

    await this.deleteTask(taskId);

    const boardWithMovedTask = await boardCollection.findOneAndUpdate(
      {_id: new ObjectId(board._id)},
      {$push: {done: taskToMove}},
      {returnNewDocument: true});

    if (!boardWithMovedTask) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not move task to 'Done' column on board.`)
    boardWithMovedTask.value._id = boardWithMovedTask.value._id.toString();
    return await boardData.getBoardById(boardWithMovedTask.value._id);
  }
};

export default exportedMethods;
