const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const asyncLocalStorage = require('../../services/als.service');

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy);
    console.log('criteria', criteria);
    const collection = await dbService.getCollection('review');
    console.log('criteria', criteria);
    // const reviews = await collection.find(criteria).toArray();
    var reviews = await collection
      .aggregate([
        {
          $match: criteria,
        },
        {
          $addFields: {
            userObjId: { $toObjectId: '$userId' },
            toyObjId: { $toObjectId: '$toyId' },
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userObjId',
            foreignField: '_id',
            as: 'byUser',
          },
        },
        {
          $unwind: '$byUser',
        },
        {
          $lookup: {
            from: 'toy',
            localField: 'toyObjId',
            foreignField: '_id',
            as: 'aboutToy',
          },
        },
        {
          $unwind: '$aboutToy',
        },
        {
          $project: {
            content: 1,
            byUser: { _id: 1, username: 1 },
            aboutToy: { _id: 1, name: 1, price: 1 },
          },
        },
      ])
      .toArray();

    // reviews = reviews.map((review) => {
    //   review.byUser = {
    //     _id: review.byUser._id,
    //     fullname: review.byUser.fullname,
    //   };
    //   review.aboutUser = {
    //     _id: review.aboutUser._id,
    //     fullname: review.aboutUser.fullname,
    //   };
    //   delete review.byUserId;
    //   delete review.aboutUserId;
    //   return review;
    // });

    return reviews;
  } catch (err) {
    logger.error('cannot find reviews', err);
    throw err;
  }
}

async function remove(reviewId) {
  try {
    const store = asyncLocalStorage.getStore();
    const { userId, isAdmin } = store;
    const collection = await dbService.getCollection('review');
    // remove only if user is owner/admin
    const criteria = { _id: ObjectId(reviewId) };
    if (!isAdmin) criteria.byUserId = ObjectId(userId);
    await collection.deleteOne(criteria);
  } catch (err) {
    logger.error(`cannot remove review ${reviewId}`, err);
    throw err;
  }
}

async function add(review) {
  try {
    const reviewToAdd = {
      //   userId: ObjectId(review.userId),
      //   toyId: ObjectId(review.toyId),
      //   content: review.content,
      userId: review.userId,
      toyId: review.toyId,
      content: review.content,
    };
    const collection = await dbService.getCollection('review');
    await collection.insertOne(reviewToAdd);
    return reviewToAdd;
  } catch (err) {
    logger.error('cannot insert review', err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.byUserId) criteria.userId = filterBy.byUserId;
  if (filterBy.byToyId) criteria.toyId = filterBy.byToyId;
  return criteria;
}

module.exports = {
  query,
  remove,
  add,
};
