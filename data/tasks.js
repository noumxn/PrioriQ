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
   * @return {newTask} Returns the new task document
   **/
  async createTask(boardId, taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo) {
    validation.parameterCheck(boardId, taskName, estimatedTime, deadline, description, assignedTo);
    validation.idCheck(boardId);
    validation.strValidCheck(taskName, estimatedTime, description);
    taskName = helpers.checkTaskName(taskName);
    description = helpers.checkDescription(description);
    validation.validDateTimeFormatCheck(deadline);
    validation.arrayValidCheck(assignedTo);
    estimatedTime = helpers.convertEstimatedTimeToMs(estimatedTime);

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
      // TODO: This can be uncommented after Athena implements adding the creator of the board to the allowed users list upon creation
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

    //looks for task in database that matches input parameters and calls it duplicate
    //the value of duplicate is either null if nothing is found, or has a value if a task is found
    let duplicate = await boardCollection.findOne({_id: new ObjectId(boardId), 'toDo': {$elemMatch: {taskName:taskName, priority: priority, difficulty: difficulty, 
      estimatedTime: estimatedTime, deadline: deadline,description: description,assignedTo: assignedTo}}});
    //if duplicate is not null(a duplicate task was found), throw an error
      if(duplicate){
       throw validation.returnRes('NO_CONTENT', `Task already exists.`);
    }
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

    // Sorting board to accomodate new task
    if (boardWithNewTask.value.priorityScheduling === true) {
      await sorting.priorityBasedSorting(boardWithNewTask.value._id);
    } else if (boardWithNewTask.value.priorityScheduling === false && boardWithNewTask.value.sortOrder === 'asc') {
      await sorting.difficultyBasedSortAscending(boardWithNewTask.value._id)
    } else if (boardWithNewTask.value.priorityScheduling === false && boardWithNewTask.value.sortOrder === 'desc') {
      await sorting.difficultyBasedSortDescending(boardWithNewTask.value._id)
    }

    newTask._id = newTask._id.toString();

    return newTask;
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
    const foundBoards = await boardCollection.find().toArray();
    for (const board of foundBoards) {
      board.toDo.forEach(task => {task._id = task._id.toString();});
      board.inProgress.forEach(task => {task._id = task._id.toString();});
      board.done.forEach(task => {task._id = task._id.toString();});
      const toDoTask = board.toDo.find(task => task._id === taskId.toString());
      if (toDoTask) {
        return toDoTask;
      }
      const inProgressTask = board.inProgress.find(task => task._id === taskId.toString());
      if (inProgressTask) {
        return inProgressTask;
      }
      const doneTask = board.done.find(task => task._id === taskId.toString());
      if (doneTask) {
        return doneTask;
      }
    }
    throw validation.returnRes('NOT_FOUND', `No task with ID: '${taskId}'`);
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
    const foundBoards = await boardCollection.find().toArray();
    for (const board of foundBoards) {
      board.toDo.forEach(task => {task._id = task._id.toString();});
      const toDoTask = board.toDo.find(task => task._id === taskId);
      if (toDoTask) {
        return board;
      }
      board.inProgress.forEach(task => {task._id = task._id.toString();});
      const inProgressTask = board.inProgress.find(task => task._id === taskId);
      if (inProgressTask) {
        return board;
      }
      board.done.forEach(task => {task._id = task._id.toString();});
      const doneTask = board.done.find(task => task._id === taskId);
      if (doneTask) {
        return board;
      }
    }
    throw validation.returnRes('NOT_FOUND', `No board that has a task with ID: '${taskId}'`);
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
    validation.validDateTimeFormatCheck(deadline);
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
      // TODO: This can be uncommented after Athena implements adding the creator of the board to the allowed users list upon creation
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
    // FIXME: This is ugly, but I couldn't find a nicer way to do it.
    updatedInfo = await boardCollection.findOneAndUpdate(
      {'toDo._id': new ObjectId(taskId)},
      {
        $set: {
          'toDo.$.createdAt': createdAt, 'toDo.$.taskName': taskName, 'toDo.$.priority': priority, 'toDo.$.difficulty': difficulty,
          'toDo.$.estimatedTime': estimatedTime, 'toDo.$.deadline': deadline, 'toDo.$.description': description, 'toDo.$.assignedTo': assignedTo
        }
      },
      {returnDocument: 'after'});
    if (updatedInfo.lastErrorObject.n !== 0) {
      return await this.getTaskById(taskId);
    };

    updatedInfo = await boardCollection.findOneAndUpdate(
      {'inProgress._id': new ObjectId(taskId)},
      {
        $set: {
          'inProgress.$.createdAt': createdAt, 'inProgress.$.taskName': taskName, 'inProgress.$.priority': priority, 'inProgress.$.difficulty': difficulty,
          'inProgress.$.estimatedTime': estimatedTime, 'inProgress.$.deadline': deadline, 'inProgress.$.description': description, 'inProgress.$.assignedTo': assignedTo
        }
      },
      {returnDocument: 'after'});
    if (updatedInfo.lastErrorObject.n !== 0) {
      return await this.getTaskById(taskId);
    };

    updatedInfo = await boardCollection.findOneAndUpdate(
      {'done._id': new ObjectId(taskId)},
      {
        $set: {
          'done.$.createdAt': createdAt, 'done.$.taskName': taskName, 'done.$.priority': priority, 'done.$.difficulty': difficulty,
          'done.$.estimatedTime': estimatedTime, 'done.$.deadline': deadline, 'done.$.description': description, 'done.$.assignedTo': assignedTo
        }
      },
      {returnDocument: 'after'});
    if (updatedInfo.lastErrorObject.n !== 0) {
      return await this.getTaskById(taskId);
    };

    if (updatedInfo.lastErrorObject.n === 0) {
      throw validation.returnRes('NOT_FOUND', `No task with given id found.`);
    };
    // Sorting board to accomodate new task
    if (boardWithNewTask.value.priorityScheduling === true) {
      await sorting.priorityBasedSorting(boardWithNewTask.value._id);
    } else if (boardWithNewTask.value.priorityScheduling === false && boardWithNewTask.value.sortOrder === 'asc') {
      await sorting.difficultyBasedSortAscending(boardWithNewTask.value._id)
    } else if (boardWithNewTask.value.priorityScheduling === false && boardWithNewTask.value.sortOrder === 'desc') {
      await sorting.difficultyBasedSortDescending(boardWithNewTask.value._id)
    }

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
    const board = await boardCollection.findOne(
      {
        $or: [
          {toDo: {$elemMatch: {_id: new ObjectId(taskId)}}},
          {inProgress: {$elemMatch: {_id: new ObjectId(taskId)}}},
          {done: {$elemMatch: {_id: new ObjectId(taskId)}}}
        ]
      },
      {projection: {_id: 1}}
    );


    if (!board) {
      throw validation.returnRes('NOT_FOUND', `Task with ID ${taskId} not found in any board.`)
    }

    await boardCollection.updateOne(
      {_id: board._id},
      {
        $pull: {
          toDo: {_id: new ObjectId(taskId)},
          inProgress: {_id: new ObjectId(taskId)},
          done: {_id: new ObjectId(taskId)}
        }
      }
    );

    return validation.returnRes('SUCCESS', `Task with ID ${taskId} successfully deleted from board.`)
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
    taskToMove._id = new ObjectId(taskToMove._id);

    const boardCollection = await boards();
    const board = await this.getBoardByTaskId(taskId);

    await this.deleteTask(taskId);

    const boardWithMovedTask = await boardCollection.findOneAndUpdate(
      {_id: new ObjectId(board._id)},
      {$push: {toDo: taskToMove}},
      {returnNewDocument: true});

    if (!boardWithMovedTask) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not move task to 'To Do' column on board.`)
    boardWithMovedTask.value._id = boardWithMovedTask.value._id.toString();

    // Sorting board
    // NOTE: Probably don't actually need to sort board here. I think sorting a board only when you get a board is enough.
    if (boardWithMovedTask.value.priorityScheduling === true) {
      await sorting.priorityBasedSorting(boardWithMovedTask.value._id);
    } else if (boardWithMovedTask.value.priorityScheduling === false && boardWithMovedTask.value.sortOrder === 'asc') {
      await sorting.difficultyBasedSortAscending(boardWithMovedTask.value._id)
    } else if (boardWithMovedTask.value.priorityScheduling === false && boardWithMovedTask.value.sortOrder === 'desc') {
      await sorting.difficultyBasedSortDescending(boardWithMovedTask.value._id)
    }

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
    taskToMove._id = taskToMove._id.toString()

    const boardCollection = await boards();
    const board = await this.getBoardByTaskId(taskId);

    await this.deleteTask(taskId);

    const boardWithMovedTask = await boardCollection.findOneAndUpdate(
      {_id: new ObjectId(board._id)},
      {$push: {inProgress: taskToMove}},
      {returnNewDocument: true});

    if (!boardWithMovedTask) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not move task to 'In Progress' column on board.`)
    boardWithMovedTask.value._id = boardWithMovedTask.value._id.toString();

    // Sorting board
    // NOTE: Probably don't actually need to sort board here. I think sorting a board only when you get a board is enough.
    // if (boardWithMovedTask.value.priorityScheduling === true) {
    //   await sorting.priorityBasedSorting(boardWithMovedTask.value._id);
    // } else if (boardWithMovedTask.value.priorityScheduling === false && boardWithMovedTask.value.sortOrder === 'asc') {
    //   await sorting.difficultyBasedSortAscending(boardWithMovedTask.value._id)
    // } else if (boardWithMovedTask.value.priorityScheduling === false && boardWithMovedTask.value.sortOrder === 'desc') {
    //   await sorting.difficultyBasedSortDescending(boardWithMovedTask.value._id)
    // }

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
    taskToMove._id = taskToMove._id.toString()

    const boardCollection = await boards();
    const board = await this.getBoardByTaskId(taskId);

    await this.deleteTask(taskId);

    const boardWithMovedTask = await boardCollection.findOneAndUpdate(
      {_id: new ObjectId(board._id)},
      {$push: {done: taskToMove}},
      {returnNewDocument: true});

    if (!boardWithMovedTask) throw validation.returnRes('INTERNAL_SERVER_ERROR', `Could not move task to 'Done' column on board.`)
    boardWithMovedTask.value._id = boardWithMovedTask.value._id.toString();

    // Sorting board
    // NOTE: Probably don't actually need to sort board here. I think sorting a board only when you get a board is enough.
    // if (boardWithMovedTask.value.priorityScheduling === true) {
    //   await sorting.priorityBasedSorting(boardWithMovedTask.value._id);
    // } else if (boardWithMovedTask.value.priorityScheduling === false && boardWithMovedTask.value.sortOrder === 'asc') {
    //   await sorting.difficultyBasedSortAscending(boardWithMovedTask.value._id)
    // } else if (boardWithMovedTask.value.priorityScheduling === false && boardWithMovedTask.value.sortOrder === 'desc') {
    //   await sorting.difficultyBasedSortDescending(boardWithMovedTask.value._id)
    // }

    return await boardData.getBoardById(boardWithMovedTask.value._id);
  }
};

export default exportedMethods;
