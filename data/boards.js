import {ObjectId} from 'mongodb';
import userData from './users.js';
import {boards} from '../config/mongoCollections.js';
import validation from '../utils/validation.js';
import helper from './helpers.js';

const exportedMethods = {
  async createBoard(boardName, owner, priorityScheduling, sortOrder, boardPassword) {},
  async getBoardById(boardId) {},
  async getBoardsByUser(userId) {},
  async updateBoard(boardName, sortOrder, boardPassword) {},
  async deleteBoard(boardId) {},
};

export default exportedMethods;
