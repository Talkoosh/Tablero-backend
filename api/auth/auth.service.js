const bcrypt = require('bcrypt');
const userService = require('../user/user.service');
const logger = require('../../services/logger.service');

async function login(email, password) {
  logger.debug(`auth.service - login with email: ${email}`);

  const user = await userService.getByEmail(email);
  if (!user) return Promise.reject('Invalid email or password');
  const match = await bcrypt.compare(password, user.password);
  if (!match) return Promise.reject('Invalid email or password bcrypt');

  delete user.password;
  user._id = user._id.toString();
  return user;
}

// (async ()=>{
//     await signup('bubu', '123', 'Bubu Bi')
//     await signup('mumu', '123', 'Mumu Maha')
// })()

async function signup(username, password, email) {
  const saltRounds = 10;

  logger.debug(
    `auth.service - signup with username: ${username}, email: ${email}`
  );
  if (!username || !password || !email)
    return Promise.reject('email, username and password are required!');

  const userExistMail = await userService.getByEmail(email);
  const userExistUsername = await userService.getByUsername(username);
  if (userExistMail || userExistUsername) return Promise.reject('Email or User is already used!');

  const hash = await bcrypt.hash(password, saltRounds);
  return userService.add({ username, password: hash, email });
}

module.exports = {
  signup,
  login,
};
