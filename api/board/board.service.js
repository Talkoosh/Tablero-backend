const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

async function query(user) {
  try {
    const filterCriteria = _buildCriteria(user);
    const collection = await dbService.getCollection('board');
    var boards = await collection.find(filterCriteria).toArray();
    return boards;
  } catch (err) {
    logger.error('cannot find boards', err);
    throw err;
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection('board');
    const board = await collection.findOne({ _id: ObjectId(boardId) });
    board._id = boardId
    return board;
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err);
    throw err;
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board');
    await collection.deleteOne({ _id: ObjectId(boardId) });
    return boardId;
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err);
    throw err;
  }
}

async function add(board) {
  try {
    const collection = await dbService.getCollection('board');
    const addedBoard = await collection.insertOne(board);
    board._id = addedBoard.insertedId.toString();
    return board;
  } catch (err) {
    logger.error('cannot insert board', err);
    throw err;
  }
}
async function update(board) {
  try {
    var id = ObjectId(board._id);
    delete board._id;
    const collection = await dbService.getCollection('board');
    await collection.updateOne({ _id: id }, { $set: { ...board } });
    return board;
  } catch (err) {
    logger.error(`cannot update board ${boardId}`, err);
    throw err;
  }
}

function _buildCriteria(user) {
  const criteria = {};
  user = JSON.parse(JSON.stringify(user))
  if (!user._id) {
    criteria.members = { '$elemMatch': { "_id": "u123" } }
  } else if (user) {
    criteria.members = { '$elemMatch': { "_id": user._id } }
  }
  return criteria
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};
