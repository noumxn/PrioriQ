import {ObjectId} from 'mongodb';

const exportedMethods = {
  parameterCheck(...param) {
    for (let i in param) {
      if (!param[i] && param[i] !== 0)
        throw [400, `An Input parameter is undefined.`]
    }
  },

  idCheck(id) {
    if (!id) throw [400, `You must provide an ID`]
    if (typeof id !== 'string') throw [400, `ID must be a string`]
    id = id.trim();
    if (id.length === 0)
      throw [400, `ID cannot be an empty string or just spaces`]
    if (!ObjectId.isValid(id)) throw [400, `Invalid object ID`]
    return id;
  },

  arrayValidCheck(...arr) {
    for (let i in arr) {
      if (!Array.isArray(arr[i])) {
        throw [400, `${arr[i]} is not of type Array.`]
      }
      if (arr[i].length < 1) {
        throw [400, `Array can not be empty.`]
      }
    }
  },

  strValidCheck(...str) {
    for (let i in str) {
      if (typeof str[i] !== 'string') {
        throw [400, `${str[i]} is not of type string.`]
      }
      if (str[i].trim().length === 0) {
        throw [400, `A string can not be empty or just filled with spaces.`]
      }
    }
  }
};

export default exportedMethods;
