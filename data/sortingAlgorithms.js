import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import {boards} from '../config/mongoCollections.js';
import userData from './users.js'
import boardData from './boards.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';

const exportedMethods = {
  /*
   * @param {boardId} ObjectId
   * @description This function sorts tasks in the toDo and inProgress subdocuments in ascending order of difficulty
   * @throws {NOT_FOUND} if boardId doesn't correspond to any board in the Database
   * @return {board} Returns board with tasks appropriately sorted
   **/
  // NOT TESTED YET
  async difficultyBasedSortAscending(boardId) {
    // Data validation
    validation.parameterCheck(boardId);
    validation.idCheck(boardId);

    // Retriving board using boardId
    const boardCollection = await boards()
    const board = await boardData.getBoardById(boardId);
    if (!board) throw validation.returnRes('NOT_FOUND', `Could not find board with ID: '${boardId}'.`);

    // assigning numberic values to dfficulty levels
    const difficultyOrder = {veryEasy: 1, easy: 2, medium: 3, hard: 4, veryHard: 5};
    // sorting
    board.toDo.sort((task1, task2) => difficultyOrder[task1.difficulty] - difficultyOrder[task2.difficulty]);
    await boardCollection.updateOne({_id: ObjectId(boardId)}, {$set: {toDo: board.toDo}});
    board.inProgress.sort((task1, task2) => difficultyOrder[task1.difficulty] - difficultyOrder[task2.difficulty]);
    await boardCollection.updateOne({_id: ObjectId(boardId)}, {$set: {inProgress: board.inProgress}});

    return board
  },

  /*
   * @param {boardId} ObjectId
   * @description This function sorts tasks in the toDo and inProgress subdocuments in descending order of difficulty
   * @throws {NOT_FOUND} if boardId doesn't correspond to any board in the Database
   * @return {board} Returns board with tasks appropriately sorted
   **/
  // NOT TESTED YET
  async difficultyBasedSortDescending(boardId) {
    // Data validation
    validation.parameterCheck(boardId);
    validation.idCheck(boardId);

    // Retriving board using boardId
    const boardCollection = await boards()
    const board = await boardData.getBoardById(boardId);
    if (!board) throw validation.returnRes('NOT_FOUND', `Could not find board with ID: '${boardId}'.`);

    // assigning numberic values to dfficulty levels
    const difficultyOrder = {veryEasy: 1, easy: 2, medium: 3, hard: 4, veryHard: 5};
    // sorting
    board.toDo.sort((task1, task2) => difficultyOrder[task2.difficulty] - difficultyOrder[task1.difficulty]);
    await boardCollection.updateOne({_id: ObjectId(boardId)}, {$set: {toDo: board.toDo}});
    board.inProgress.sort((task1, task2) => difficultyOrder[task2.difficulty] - difficultyOrder[task1.difficulty]);
    await boardCollection.updateOne({_id: ObjectId(boardId)}, {$set: {inProgress: board.inProgress}});

    return board
  },

  /*
   * @param {boardId} ObjectId
   * @description This function sorts tasks in the toDo and inProgress subdocuments in descending order of priority
   * @throws {NOT_FOUND} if boardId doesn't correspond to any board in the Database
   * @return {board} Returns board with tasks appropriately sorted
   **/
  // NOT TESTED YET
  async priorityBasedSorting(boardId) {
    // Data validation
    validation.parameterCheck(boardId);
    validation.idCheck(boardId);

    // Retriving board using boardId
    const boardCollection = await boards();
    const board = await boardData.getBoardById(boardId);
    if (!board) throw validation.returnRes('NOT_FOUND', `Could not find board with ID: '${boardId}'.`);

    // sorting
    board.toDo.sort((task1, task2) => task2.priority - task1.priority);
    await boardCollection.updateOne({_id: ObjectId(boardId)}, {$set: {toDo: board.toDo}});
    board.inProgress.sort((task1, task2) => task2.priority - task1.priority);
    await boardCollection.updateOne({_id: ObjectId(boardId)}, {$set: {inProgress: board.inProgress}});

    return board;
  },

  /*
   * @param {createdAt} date
   * @param {priority} number
   * @param {deadline} date
   * @param {estimatedTime} number
   * @description This function produces the current priority of any task based on the four params
   * @return {name} Returns the name after removing leading and trailing spaces if there are any
   **/
  async priorityAssignmentAlgorithm(createdAt, priority, deadline, estimatedTime) {
    // Data validation
    validation.parameterCheck(createdAt, priority, deadline, estimatedTime);
    validation.strValidCheck(createdAt, deadline);
    validation.validDateTimeFormatCheck(createdAt, deadline);
    validation.numberValidCheck(priority, estimatedTime);

    // Calculate time remaining until deadline
    const timeRemainingMs = deadline - createdAt - estimatedTime;

    // Calculate number of priority increments required
    const numIncrements = Math.max(10 - priority, 0);
    if (numIncrements === 0) {
      return priority;
    }
    const timePerIncrement = timeRemainingMs / numIncrements;

    // Calculate how many priority increments have already occurred
    const timeSinceCreationMs = Date.now() - createdAt.getTime();
    const numIncrementsSoFar = Math.min(Math.floor(timeSinceCreationMs / timePerIncrement), numIncrements);

    // Calculate current priority
    const currentPriority = priority + numIncrementsSoFar;
    if (priority > currentPriority) {
      return priority
    } else {
      return currentPriority
    }
  },
};

export default exportedMethods;
