const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

async function query() {
  try {
    // const criteria = _buildCriteria()
    // const collection = await dbService.getCollection('board');
    // console.log('criteria', criteria);
    // const reviews = await collection.find(criteria).toArray();
    // var boards = await collection
    //   .aggregate([
    //     {
    //       $match: criteria,
    //     },
    // {
    //   $addFields: {
    //     userObjId: { $toObjectId: '$userId' },
    //     toyObjId: { $toObjectId: '$toyId' },
    //   },
    // },
    //   {
    //     $lookup: {
    //       from: 'user',
    //       localField: 'userObjId',
    //       foreignField: '_id',
    //       as: 'byUser',
    //     },
    //   },
    //   {
    //     $unwind: '$byUser',
    //   },
    //   {
    //     $lookup: {
    //       from: 'toy',
    //       localField: 'toyObjId',
    //       foreignField: '_id',
    //       as: 'aboutToy',
    //     },
    //   },
    //   {
    //     $unwind: '$aboutToy',
    //   },
    //   {
    //     $project: {
    //       content: 1,
    //       byUser: { _id: 1, username: 1 },
    //       aboutToy: { _id: 1, name: 1, price: 1 },
    //     },
    //   },
    // ])
    // .toArray();
    // const criteria = _buildCriteria(filterBy)
    // const criteria = {};

    // const collection = await dbService.getCollection('board');
    // var boards = await collection.find(criteria).toArray();
    // return boards;
    try {
      // const criteria = _buildCriteria(filterBy)
      const criteria = {};

      const collection = await dbService.getCollection('board');
      var boards = await collection.find(criteria).toArray();
      return boards;
    } catch (err) {
      logger.error('cannot find boards', err);
      throw err;
    }
  } catch (err) {
    logger.error('cannot find boards', err);
    throw err;
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection('board');
    const board = collection.findOne({ _id: ObjectId(boardId) });
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

function _buildCriteria(userId) {
  const criteria = {};
  criteria._id = userId
  return criteria
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};
