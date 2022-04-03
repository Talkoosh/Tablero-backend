const dbService = require('../../services/db.service');
const logger = require('../../services/logger.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
  query,
  getById,
  getByUsername,
  getByEmail,
  remove,
  update,
  add,
  getByGoogleId
};

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy);
  try {
    const collection = await dbService.getCollection('user');
    var users = await collection.find(criteria).toArray();
    users = users.map((user) => {
      delete user.password;
      user.createdAt = ObjectId(user._id).getTimestamp();
      // Returning fake fresh data
      // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
      return user;
    });
    return users;
  } catch (err) {
    logger.error('cannot find users', err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection('user');
    const user = await collection.findOne({ _id: ObjectId(userId) });
    delete user.password;
    return user;
  } catch (err) {
    logger.error(`while finding user ${userId}`, err);
    throw err;
  }
}

async function getByGoogleId(googleId) {
  try {
    const collection = await dbService.getCollection('user');
    const user = await collection.findOne({googleId});
    if(user) delete user.password;
    return user;
  } catch (err) {
    logger.error(`whilsx;cms;kxcmklsmclksmlkmokwme finding users`, err)
    throw err;
  }
}

async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection('user');
    const user = await collection.findOne({ username });
    return user;
  } catch (err) {
    logger.error(`while finding user ${username}`, err);
    throw err;
  }
}
async function getByEmail(email) {
  try {
    const collection = await dbService.getCollection('user');
    const user = await collection.findOne({ email });
    return user;
  } catch (err) {
    logger.error(`while finding user ${username}`, err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection('user');
    await collection.deleteOne({ _id: ObjectId(userId) });
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err);
    throw err;
  }
}

async function update(user) {
  try {
    // peek only updatable fields!
    const userToSave = {
      _id: ObjectId(user._id), // needed for the returnd obj
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const collection = await dbService.getCollection('user');
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
    return userToSave;
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err);
    throw err;
  }
}

async function add(user) {
  try {
    // peek only updatable fields!
    const userToAdd = {
      username: user.username,
      password: user.password,
      email: user.email,
      isAdmin: false,
      imgUrl: '',
      googleId: null
    };
    if (user.googleId) {
      userToAdd.imgUrl = user.imgUrl;
      userToAdd.googleId = user.googleId;
    }

    const collection = await dbService.getCollection('user');
    await collection.insertOne(userToAdd);
    return userToAdd;
  } catch (err) {
    logger.error('cannot insert user', err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.searchName) {
    const txtCriteria = { $regex: filterBy.searchName, $options: 'i' };
    criteria.$or = [
      {
        username: txtCriteria,
      },
      {
        email: txtCriteria,
      },
    ];
  }
  return criteria;
}
