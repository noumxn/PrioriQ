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
  async priorityBasedScheduling(createdAt, priority, deadline, estimatedTime) {
    // Calculate time remaining until deadline
    const timeRemainingMs = deadline - createdAt;
    console.log("time remaing in MS: ", timeRemainingMs)
    const timeRemainingMinutes = Math.ceil(timeRemainingMs / (1000 * 60));
    console.log("time remaing in minutes: ", timeRemainingMinutes)

    // Calculate number of priority increments required
    const numIncrements = Math.max(10 - priority, 0);
    console.log("num increments: ", numIncrements)
    const timePerIncrement = timeRemainingMs / numIncrements;
    console.log("time per inc: ", timePerIncrement)

    // Calculate how many priority increments have already occurred
    const timeSinceCreationMs = Date.now() - createdAt.getTime();
    console.log("timeSinceCreationMS: ", timeSinceCreationMs)
    const timeSinceCreationMinutes = Math.ceil(timeSinceCreationMs / (1000 * 60));
    console.log("timeSinceCreationMinutes: ", timeSinceCreationMinutes)
    const numIncrementsSoFar = Math.min(Math.floor(timeSinceCreationMs / timePerIncrement), numIncrements);
    console.log("numIncrements so far: ", numIncrementsSoFar)

    // Calculate current priority
    const currentPriority = priority + numIncrementsSoFar;
    console.log("currentPriority: ", currentPriority)

    return currentPriority;
  }
};

function convertEstimatedTimeToMs(hours, mins) {
  const totalMinutes = hours * 60 + mins;
  const totalSeconds = totalMinutes * 60;
  const totalMicroseconds = totalSeconds * 1000000;
  return totalMicroseconds;
}

// const hours = 0;
// const mins = 2;

// const createdAt = new Date("2023-03-26T11:10:00.000Z");
// const priority = 2;
// const deadline = new Date("2023-03-26T11:14:00.000Z");
// const estimatedTime = convertEstimatedTimeToMs(0, 2);

// const currentPriority = schedulingAlgorithm(createdAt, priority, deadline, estimatedTime);
// console.log(currentPriority); // prints the current priority based on the current time

export default exportedMethods;
