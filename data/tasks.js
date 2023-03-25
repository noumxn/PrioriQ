import {ObjectId} from 'mongodb';
import {boards} from '../config/mongoCollections.js';
import userData from './users.js';
import boardData from './boards.js';
import validation from '../utils/validation.js';
import helpers from './helpers.js';

const exportedMethods = {
  async createTask(taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo) {},
  async getTaskById(taskId) {},
  async updateTask(taskName, priority, difficulty, estimatedTime, deadline, description, assignedTo) {},
  async deleteTask(taskId) {},
};

export default exportedMethods;
