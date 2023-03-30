import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import {boards} from '../config/mongoCollections.js';
import userData from './users.js'
import boardData from './boards.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';

const exportedMethods = {
  async difficultyBasedSorting() {},
  async priorityBasedSorting(boardId) {},

  /*
   * @param {createdAt} date
   * @param {priority} number
   * @param {deadline} date
   * @param {estimatedTime} number
   * @description This function produces the current priority of any task based on the four params
   * @return {name} Returns the name after removing leading and trailing spaces if there are any
   **/
  async priorityBasedScheduling(createdAt, priority, deadline, estimatedTime) {
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
